const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export interface LoginResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  totalQuestions: number;
  status: "not_started" | "completed";
  score?: number;
}

export interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
}

export interface ExamData {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
}

export interface ResultData {
  examTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  passed: boolean;
  answers: { questionId: string; selected: string; correct: string; isCorrect: boolean }[];
}

export const api = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getExams: () => request<Exam[]>("/exams"),

  getExam: (id: string) => request<ExamData>(`/exam/${id}`),

  submitExam: (examId: string, answers: Record<string, string>) =>
    request<{ resultId: string }>("/submit", {
      method: "POST",
      body: JSON.stringify({ examId, answers }),
    }),

  getResult: (userId: string) => request<ResultData>(`/result/${userId}`),
};
