import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, Code, Terminal, FileText, Clock, CheckCircle, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Added this to get the logged-in user

const ExamSelection = () => {
    const { user } = useAuth(); // Get the current user
    const [exams, setExams] = useState([]);
    const [completedExams, setCompletedExams] = useState([]); // Track finished exams
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch all available exams
                const examsRes = await axios.get('http://localhost:5000/api/exams');
                const uniqueExams = examsRes.data.reduce((acc, current) => {
                    const x = acc.find(item => item.title === current.title);
                    if (!x) return acc.concat([current]);
                    return acc;
                }, []);
                setExams(uniqueExams);

                // 2. Fetch the exams this specific user has completed
                if (user?.id) {
                    const progressRes = await axios.get(`http://localhost:5000/api/user/completed-exams/${user.id}`);
                    setCompletedExams(progressRes.data);
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    // Helper to pick the right icon based on the title
    const getIcon = (title) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('java')) return <Terminal className="w-6 h-6 text-orange-500" />;
        if (lowerTitle.includes('python')) return <Code className="w-6 h-6 text-blue-500" />;
        return <Brain className="w-6 h-6 text-purple-500" />; // For Aptitude
    };

    if (loading) {
        return <div className="text-center p-10 font-bold text-indigo-600 animate-pulse">Loading your dashboard...</div>;
    }

    const isAllComplete = exams.length > 0 && completedExams.length === exams.length;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            
            {/* PROGRESS TRACKER SECTION */}
            <div className="mb-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Welcome, {user?.name || "Student"}</h1>
                        <p className="text-gray-500 mt-1 text-lg">Complete all subject exams to finish your assessment.</p>
                    </div>
                    {isAllComplete && (
                        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full font-bold">
                            <Trophy size={20} /> Assessment Complete!
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <span>Overall Progress</span>
                        <span className={isAllComplete ? "text-green-600" : "text-indigo-600"}>
                            {completedExams.length} of {exams.length} Exams
                        </span>
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ${isAllComplete ? "bg-green-500" : "bg-indigo-600"}`}
                            style={{ width: `${(completedExams.length / exams.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* EXAM CARDS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => {
                    // Check if the title exists in the completedExams array
                    const isFinished = completedExams.includes(exam.title);

                    return (
                        <div key={exam.id} className={`bg-white p-6 rounded-xl border transition-all ${isFinished ? 'border-gray-200 bg-gray-50 opacity-90' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
                            <div className="bg-white border border-gray-100 shadow-sm w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                {getIcon(exam.title)}
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{exam.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">
                                {exam.description}
                            </p>

                            <div className="flex items-center gap-4 text-gray-400 text-sm mb-6 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <FileText size={16} />
                                    <span>10 Questions</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={16} />
                                    <span>10 min</span>
                                </div>
                            </div>

                            {/* CONDITIONAL BUTTON: Start vs Completed */}
                            {isFinished ? (
                                <button 
                                    disabled
                                    className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 border-2 border-green-200 py-3 rounded-xl font-bold cursor-not-allowed"
                                >
                                    <CheckCircle size={18} /> Completed
                                </button>
                            ) : (
                                <button 
                                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors hover:-translate-y-0.5 active:translate-y-0"
                                    onClick={() => {
                                        window.location.href = `/exam/${encodeURIComponent(exam.title)}`;
                                    }}
                                >
                                    Start Exam
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ExamSelection;