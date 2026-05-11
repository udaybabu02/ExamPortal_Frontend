import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useExam } from "@/context/ExamContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Timer from "@/components/Timer";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Send, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// --- IMPORT ADDED HERE ---
import { API_BASE_URL } from "@/config";

interface QuestionItem {
  id: number;
  subject: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

const ExamPage = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { answers, setAnswer, clearExam } = useExam();

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [activeEndTime, setActiveEndTime] = useState<number | null>(null);

  // 1. POOLING LOGIC: 10 QUESTIONS PER SUBJECT (30 TOTAL)
  useEffect(() => {
    const fetchAndMixQuestions = async () => {
      try {
        setLoading(true);
        
        // 👇 CHANGED KEYS: This forces the browser to drop the old 20-question cache and fetch the 30 fresh ones!
        const sessionKey = `active_exam_questions_v3_final`;
        const timerKey = `timer_v3_final`;
        
        const savedQuestions = sessionStorage.getItem(sessionKey);
        const savedTime = sessionStorage.getItem(timerKey);

        if (savedQuestions && savedTime) {
          setQuestions(JSON.parse(savedQuestions));
          setActiveEndTime(parseInt(savedTime, 10));
        } else {
          const subjects = ["Java", "Python", "Aptitude"];
          let combinedPool: QuestionItem[] = [];

          for (const sub of subjects) {
            try {
              // --- LOCALHOST REMOVED, API_BASE_URL ADDED HERE ---
              const res = await axios.get(`${API_BASE_URL}/questions/${encodeURIComponent(sub)}`);
              const subjectSelection = res.data
                .sort(() => Math.random() - 0.5)
                .slice(0, 10);
              combinedPool = [...combinedPool, ...subjectSelection];
            } catch (e) {
              console.error(`Error fetching ${sub}:`, e);
            }
          }

          if (combinedPool.length > 0) {
            // 👇 FIXED TEXT BUG: Removed the aggressive replace() so text doesn't get deleted
            const finalShuffled = combinedPool.sort(() => Math.random() - 0.5).map(q => ({
              ...q,
              question_text: q.question_text 
            }));

            setQuestions(finalShuffled);
            sessionStorage.setItem(sessionKey, JSON.stringify(finalShuffled));

            const newEndTime = Date.now() + 30 * 60 * 1000;
            setActiveEndTime(newEndTime);
            sessionStorage.setItem(timerKey, newEndTime.toString());
          }
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Server Connection Failed" });
      } finally {
        setLoading(false);
      }
    };

    fetchAndMixQuestions();
  }, [toast]);

  // 2. ANTI-CHEAT & TAB PROTECTION
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !submitting && questions.length > 0) {
        setTabWarnings((prev) => {
          const next = prev + 1;
          toast({
            variant: "destructive",
            title: `⚠️ Security Warning (${next}/3)`,
            description: next >= 3 ? "Exceeded limit. Auto-submitting." : "Stay on the exam screen!",
          });
          if (next >= 3) handleSubmit();
          return next;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [toast, questions.length, submitting]);

  // 3. FINAL SUBMISSION (WITH USER-SPECIFIC STORAGE)
  const handleSubmit = useCallback(async () => {
    if (submitting || questions.length === 0 || !user?.id) return;
    setSubmitting(true);

    try {
      let correct = 0;
      const resultsData = questions.map((q) => {
        const userAnswer = answers[q.id.toString()] || "Not answered";
        const isCorrect = userAnswer === q.correct_answer;
        if (isCorrect) correct++;
        return { questionId: q.id, selected: userAnswer, isCorrect };
      });

      const percentage = Math.round((correct / questions.length) * 100);

      // 👇 UPDATED PAYLOAD: Now includes studentName
      const payload = {
        userId: user.id,
        studentName: user.name, 
        examId: "unified-assessment",
        percentage,
        passed: percentage >= 40,
        totalQuestions: questions.length,
        correctAnswers: correct,
        wrongAnswers: questions.length - correct,
        answers: resultsData
      };

      // --- LOCALHOST REMOVED, API_BASE_URL ADDED HERE ---
      await axios.post(`${API_BASE_URL}/results`, payload);
      
      // 👉 USER-SPECIFIC PROGRESS TRACKER
      const allProgress = JSON.parse(localStorage.getItem("user_exam_progress") || "{}");
      if (!allProgress[user.id]) allProgress[user.id] = [];
      
      if (!allProgress[user.id].includes("unified-assessment")) {
        allProgress[user.id].push("unified-assessment");
      }
      localStorage.setItem("user_exam_progress", JSON.stringify(allProgress));

      localStorage.setItem("exam_result", JSON.stringify({ 
        ...payload, 
        examTitle: "Comprehensive Final Assessment" 
      }));
      
      // 👇 Ensure we delete the correct session keys so they can retake it later if needed
      sessionStorage.removeItem("active_exam_questions_v3_final");
      sessionStorage.removeItem("timer_v3_final");
      
      clearExam();
      navigate("/result");
    } catch (error) {
      toast({ variant: "destructive", title: "Result save failed" });
    } finally {
      setSubmitting(false);
    }
  }, [user, answers, questions, clearExam, navigate, toast, submitting]);

  const onTimeUp = useCallback(() => {
    toast({ variant: "destructive", title: "Time Expired!" });
    handleSubmit();
  }, [handleSubmit, toast]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
  if (questions.length === 0) return <div className="flex h-screen items-center justify-center"><AlertTriangle className="h-16 w-16 text-amber-500" /></div>;

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      <div className="sticky top-16 z-40 border-b bg-white/80 backdrop-blur-md px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Final Comprehensive Exam</h2>
          <div className="flex items-center gap-4">
            {tabWarnings > 0 && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">Warnings: {tabWarnings}/3</span>}
            {activeEndTime && <Timer endTime={activeEndTime} onTimeUp={onTimeUp} />}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-64 lg:shrink-0">
            <div className="rounded-2xl border bg-white p-5 shadow-sm sticky top-40">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Questions</h3>
              <div className="grid grid-cols-6 gap-2 lg:grid-cols-5">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQ(i)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all",
                      i === currentQ ? "bg-indigo-600 text-white shadow-md" : 
                      !!answers[q.id.toString()] ? "bg-indigo-50 text-indigo-600 border border-indigo-200" : "bg-slate-100 text-slate-400"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <QuestionCard
              question={{
                id: questions[currentQ].id.toString(),
                text: questions[currentQ].question_text,
                options: [
                  { id: "a", text: questions[currentQ].option_a },
                  { id: "b", text: questions[currentQ].option_b },
                  { id: "c", text: questions[currentQ].option_c },
                  { id: "d", text: questions[currentQ].option_d },
                ]
              }}
              index={currentQ}
              total={questions.length}
              selectedOption={answers[questions[currentQ].id.toString()]}
              onSelect={(val) => setAnswer(questions[currentQ].id.toString(), val)}
            />

            <div className="mt-10 flex items-center justify-between">
              <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ(p => p - 1)} className="rounded-xl h-12">Previous</Button>
              {currentQ < questions.length - 1 ? (
                <Button className="rounded-xl h-12 px-8 bg-indigo-600 font-bold" onClick={() => setCurrentQ(p => p + 1)}>Next</Button>
              ) : (
                <Button className="rounded-xl h-12 px-8 bg-green-600 text-white font-bold" onClick={() => setShowConfirm(true)}>Submit Exam</Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Submit Assessment?</DialogTitle>
            <DialogDescription className="text-center">Answered {answeredCount} / {questions.length} questions.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>Review</Button>
            <Button className="bg-indigo-600 font-bold px-8 h-12 rounded-xl" onClick={handleSubmit} disabled={submitting}>Yes, Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamPage;
