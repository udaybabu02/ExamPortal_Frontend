import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AlertTriangle, Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ResultPage = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Fetch the result data we saved in ExamPage.tsx
    const savedResult = localStorage.getItem("exam_result");
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    } else {
      // If someone tries to access this page directly without taking the exam, send them back
      navigate("/");
    }
  }, [navigate]);

  if (!result) return null;

  const isPassing = result.passed;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-10 text-center">
          
          {/* Top Icon */}
          <div className="flex justify-center mb-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isPassing ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
              {isPassing ? <Trophy size={48} /> : <AlertTriangle size={48} />}
            </div>
          </div>

          {/* Headings */}
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            {isPassing ? "Congratulations!" : "Keep Practicing!"}
          </h1>
          <p className="text-slate-500 text-lg mb-10">
            You Have Completed The {result.examTitle || "Comprehensive Final Assessment Exam"}.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {/* Score */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Score</p>
              <p className={`text-4xl font-black ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                {result.percentage}%
              </p>
            </div>
            
            {/* Correct */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Correct</p>
              <p className="text-4xl font-black text-slate-700">
                {result.correctAnswers} <span className="text-lg text-slate-400 font-medium">/ {result.totalQuestions}</span>
              </p>
            </div>
            
            {/* Wrong */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Wrong</p>
              <p className="text-4xl font-black text-slate-700">
                {result.wrongAnswers}
              </p>
            </div>
          </div>

          {/* Action Buttons - Retake Removed! */}
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              className="h-12 px-8 rounded-xl font-semibold border-slate-200 hover:bg-slate-50 text-slate-700"
              onClick={() => navigate("/")} 
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultPage;