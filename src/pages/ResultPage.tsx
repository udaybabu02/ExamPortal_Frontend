import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy, AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const ResultPage = () => {
  const navigate = useNavigate();
  const [resultData, setResultData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Load results from local storage
    const storedResult = localStorage.getItem("exam_result");
    if (!storedResult) {
      navigate("/dashboard");
      return;
    }

    const parsedResult = JSON.parse(storedResult);
    setResultData(parsedResult);

    // 2. Fetch the actual questions from the database for the review section
    const fetchQuestionsForReview = async () => {
      try {
        const subjectName = decodeURIComponent(parsedResult.examTitle || parsedResult.examId);
        const response = await axios.get(`http://localhost:5000/api/questions/${encodeURIComponent(subjectName)}`);
        if (response.data) {
          setQuestions(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch questions for review:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsForReview();
  }, [navigate]);

  // The Fixed Function: Safely gets the text for an option from MySQL or fallback arrays
  const getOptionText = (question: any, optionId: string) => {
    if (!question) return optionId;
    if (optionId === "Not answered") return "Not answered";

    // 1. MySQL Database Structure (option_a, option_b, etc.)
    if (question.option_a !== undefined) {
      if (optionId === 'a') return question.option_a;
      if (optionId === 'b') return question.option_b;
      if (optionId === 'c') return question.option_c;
      if (optionId === 'd') return question.option_d;
    }

    // 2. Fallback for old static array structure
    if (question.options && Array.isArray(question.options)) {
      const opt = question.options.find((o: any) => o.id === optionId);
      return opt ? opt.text : optionId;
    }

    return optionId; // Fallback if nothing matches
  };

  if (loading || !resultData) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-background">
        <div className="text-lg font-medium animate-pulse text-indigo-600">Generating your results...</div>
      </div>
    );
  }

  const { percentage, passed, totalQuestions, correctAnswers, wrongAnswers, answers, examTitle } = resultData;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-20">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Top Summary Card */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100 dark:bg-card dark:border-slate-800 text-center mb-10">
          <div className="flex justify-center mb-6">
            {passed ? (
              <div className="rounded-full bg-green-100 p-6 dark:bg-green-900/30">
                <Trophy className="h-16 w-16 text-green-600 dark:text-green-500" />
              </div>
            ) : (
              <div className="rounded-full bg-red-100 p-6 dark:bg-red-900/30">
                <AlertTriangle className="h-16 w-16 text-red-600 dark:text-red-500" />
              </div>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {passed ? "Congratulations!" : "Keep Practicing!"}
          </h1>
          <p className="text-lg text-slate-500 mb-8 capitalize">
            You have completed the {decodeURIComponent(examTitle)} exam.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6 w-40">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Score</p>
              <p className={cn("text-3xl font-bold", passed ? "text-green-600" : "text-red-600")}>
                {percentage}%
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6 w-40">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Correct</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {correctAnswers} <span className="text-lg text-slate-400">/ {totalQuestions}</span>
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6 w-40">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Wrong</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{wrongAnswers}</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/dashboard")} variant="outline" className="rounded-xl h-12 px-6 font-bold">
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Dashboard
            </Button>
            <Button onClick={() => navigate(`/exam/${examTitle}`)} className="rounded-xl h-12 px-6 font-bold bg-indigo-600 hover:bg-indigo-700">
              <RotateCcw className="mr-2 h-5 w-5" /> Retake Exam
            </Button>
          </div>
        </div>

        {/* Detailed Review Section */}
        {questions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Answer Review</h2>
            <div className="space-y-6">
              {answers.map((ans: any, index: number) => {
                const question = questions.find((q) => q.id.toString() === ans.questionId.toString());
                
                // Use our fixed function to get the actual text instead of crashing!
                const selectedText = getOptionText(question, ans.selected);
                const correctText = question ? question.correct_answer : "Unknown";

                return (
                  <div key={index} className="bg-white dark:bg-card p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex gap-4">
                      <div className="mt-1 flex-shrink-0">
                        {ans.isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                      <div className="w-full">
                        <p className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-4">
                          <span className="text-slate-400 mr-2">{index + 1}.</span> 
                          {question ? question.question_text : "Question text unavailable"}
                        </p>
                        
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className={cn(
                            "p-3 rounded-xl border",
                            ans.isCorrect ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/50" : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/50"
                          )}>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-500">Your Answer</p>
                            <p className={cn("font-medium", ans.isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400")}>
                              {selectedText}
                            </p>
                          </div>

                          {!ans.isCorrect && (
                            <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                              <p className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-500">Correct Answer</p>
                              <p className="font-medium text-slate-700 dark:text-slate-300">
                                {getOptionText(question, correctText)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResultPage;