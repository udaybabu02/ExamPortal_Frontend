import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  endTime: number;
  onTimeUp: () => void;
}

const Timer = ({ endTime, onTimeUp }: TimerProps) => {
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.floor((endTime - Date.now()) / 1000)));

  useEffect(() => {
    const id = setInterval(() => {
      const left = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setRemaining(left);
      
      // Stop timer and submit exam when it hits 0
      if (left <= 0) {
        clearInterval(id);
        onTimeUp();
      }
    }, 1000);
    
    return () => clearInterval(id);
  }, [endTime, onTimeUp]);

  // Format the time as MM:SS
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  
  // Update warning threshold: Turns red at 2 minutes remaining (120 seconds)
  const isLow = remaining < 120; 

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-bold tabular-nums transition-colors duration-300 shadow-sm",
        isLow 
          ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 animate-pulse" 
          : "border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-card dark:text-slate-100"
      )}
    >
      <Clock className={cn("h-4 w-4", isLow && "text-red-600 dark:text-red-400")} />
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
};

export default Timer;