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
  
  // NEW: Robust local timer state
  const [activeEndTime, setActiveEndTime] = useState<number | null>(null);

  // 1. DYNAMIC FETCH & TIMER START LOGIC
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const subjectName = decodeURIComponent(id);
        const response = await axios.get(`http://localhost:5000/api/questions/${encodeURIComponent(subjectName)}`);

        if (response.data && response.data.length > 0) {
          setQuestions(response.data);

          // --- CHEAT-PROOF TIMER LOGIC ---
          // Check if this exam already has a running timer in this session
          const savedTime = sessionStorage.getItem(`timer_${subjectName}`);
          if (savedTime) {
            setActiveEndTime(parseInt(savedTime, 10)); // Resume existing timer
          } else {
            const newEndTime = Date.now() + 10 * 60 * 1000; // Start new 10-minute timer
            setActiveEndTime(newEndTime);
            sessionStorage.setItem(`timer_${subjectName}`, newEndTime.toString());
          }
          // -------------------------------

        } else {
          toast({ variant: "destructive", title: "Subject Not Found" });
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Connection Failed" });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id, toast]);

  // 2. TAB PROTECTION
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !submitting && questions.length > 0) {
        setTabWarnings((prev) => {
          const next = prev + 1;
          toast({
            variant: "destructive",
            title: `⚠️ Tab Switch Warning (${next}/3)`,
            description: next >= 3 ? "Auto-submitting now." : "Please stay on the exam page!",
          });
          if (next >= 3) handleSubmit();
          return next;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [toast, questions.length, submitting]);

  // 3. SUBMISSION LOGIC
  const handleSubmit = useCallback(async () => {
    if (submitting || questions.length === 0) return;
    setSubmitting(true);

    try {
      let correct = 0;
      const resultsData = questions.map((q) => {
        const userAnswer = answers[q.id.toString()] || "Not answered";
        const isCorrect = userAnswer === q.correct_answer;
        if (isCorrect) correct++;
        return { questionId: q.id, selected: userAnswer, isCorrect: isCorrect };
      });

      const percentage = Math.round((correct / questions.length) * 100);

      const payload = {
        userId: user?.id,
        examId: id,
        percentage,
        passed: percentage >= 40,
        totalQuestions: questions.length,
        correctAnswers: correct,
        wrongAnswers: questions.length - correct,
        answers: resultsData
      };

      await axios.post("http://localhost:5000/api/results", payload);
      localStorage.setItem("exam_result", JSON.stringify({ ...payload, examTitle: id }));
      
      // Clear the timer from memory so they can take it again later
      sessionStorage.removeItem(`timer_${decodeURIComponent(id || "")}`);
      
      clearExam();
      navigate("/result");
    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed" });
    } finally {
      setSubmitting(false);
    }
  }, [id, user, answers, questions, clearExam, navigate, toast, submitting]);

  const onTimeUp = useCallback(() => {
    toast({ variant: "destructive", title: "Time's up!" });
    handleSubmit();
  }, [handleSubmit, toast]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
  if (questions.length === 0) return <div className="flex h-screen items-center justify-center"><AlertTriangle className="h-16 w-16 text-amber-500" /></div>;

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-20">
      <Navbar />
      <div className="sticky top-16 z-40 border-b bg-white/80 backdrop-blur-md px-4 py-4 dark:bg-card/95">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          {/* FIXED: Removed the hardcoded "Exam" text so it doesn't repeat */}
          <h2 className="text-xl font-bold capitalize text-slate-800 dark:text-slate-100">
            {decodeURIComponent(id || "")}
          </h2>
          <div className="flex items-center gap-4">
            {tabWarnings > 0 && <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600 border border-red-200">Warnings: {tabWarnings}/3</span>}
            
            {/* FIXED: Uses the active local timer */}
            {activeEndTime && <Timer endTime={activeEndTime} onTimeUp={onTimeUp} />}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-56 lg:shrink-0">
            <div className="rounded-2xl border bg-white dark:bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Jump to Question</h3>
              <div className="grid grid-cols-5 gap-2 lg:grid-cols-4">
                {questions.map((q, i) => {
                  const isCurrent = i === currentQ;
                  const isAnswered = !!answers[q.id.toString()];
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQ(i)}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200",
                        isCurrent ? "bg-indigo-600 text-white shadow-md ring-4 ring-indigo-100" : isAnswered ? "bg-transparent text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      )}
                    >
                      {i + 1}
                    </button>
                  );
                })}
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
              <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ(p => p - 1)} className="rounded-xl h-12 font-bold px-6"><ChevronLeft className="mr-2" /> Previous</Button>
              {currentQ < questions.length - 1 ? (
                <Button className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 font-bold" onClick={() => setCurrentQ(p => p + 1)}>Next <ChevronRight className="ml-2" /></Button>
              ) : (
                <Button className="rounded-xl h-12 px-8 bg-green-600 hover:bg-green-700 text-white font-bold" onClick={() => setShowConfirm(true)}><Send className="mr-2" /> Submit Exam</Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Ready to Finish?</DialogTitle>
            <DialogDescription className="text-center pt-2">You've answered <span className="font-bold text-indigo-600">{answeredCount}</span> out of {questions.length} questions.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-3 mt-4">
            <Button variant="ghost" className="font-bold" onClick={() => setShowConfirm(false)}>Review Answers</Button>
            <Button className="bg-indigo-600 px-8 font-bold rounded-xl h-12" onClick={handleSubmit} disabled={submitting}>{submitting ? "Saving..." : "Yes, Submit"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamPage;