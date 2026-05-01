import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Brain, Trophy, Clock, FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from "@/components/Navbar";

const ExamSelection = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserProgress = () => {
            // Wait for user context to load
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                // 👉 READ USER-SPECIFIC PROGRESS
                const allProgress = JSON.parse(localStorage.getItem("user_exam_progress") || "{}");
                const currentUserData = allProgress[user.id] || [];
                
                setIsFinished(currentUserData.includes("unified-assessment"));
            } catch (e) {
                console.error("Progress read error", e);
            } finally {
                setLoading(false);
            }
        };

        checkUserProgress();
    }, [user]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12">
                
                <div className="mb-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Welcome, {user?.name || "Student"}</h1>
                            <p className="text-gray-500 mt-1">Complete your final comprehensive assessment.</p>
                        </div>
                        {isFinished && (
                            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full font-bold">
                                <Trophy size={20} /> Assessment Complete!
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between text-sm font-bold text-gray-400 uppercase mb-2">
                            <span>Overall Progress</span>
                            <span className={isFinished ? "text-green-600" : "text-indigo-600"}>
                                {isFinished ? "1 of 1" : "0 of 1"} Tasks Complete
                            </span>
                        </div>
                        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${isFinished ? "bg-green-500" : "bg-indigo-600"}`} style={{ width: isFinished ? '100%' : '0%' }} />
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div 
                        onClick={() => !isFinished && navigate("/exam/unified-assessment")}
                        className={`p-8 rounded-3xl border transition-all ${isFinished ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-90" : "bg-white border-indigo-100 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer"}`}
                    >
                        <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                            <Brain className="w-8 h-8 text-indigo-600" />
                        </div>
                        
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">Final Comprehensive Exam</h2>
                        <p className="text-gray-500 mb-8">Contains 30 questions (10 each from Java, Python, and Aptitude) shuffled together.</p>

                        <div className="flex items-center gap-6 text-gray-400 text-sm mb-8 font-medium">
                            <div className="flex items-center gap-1.5"><FileText size={18} /><span>30 Questions</span></div>
                            <div className="flex items-center gap-1.5"><Clock size={18} /><span>30 min</span></div>
                        </div>

                        {isFinished ? (
                            <div className="w-full text-center bg-green-50 text-green-700 border-2 border-green-200 py-4 rounded-2xl font-bold">
                                <CheckCircle size={20} className="inline mr-2" /> Assessment Finished
                            </div>
                        ) : (
                            <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700">
                                Start Final Assessment
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamSelection;