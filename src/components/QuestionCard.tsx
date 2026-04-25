import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    options: { id: string; text: string }[];
  };
  index: number;
  total: number;
  selectedOption?: string;
  onSelect: (id: string) => void;
}

const QuestionCard = ({ question, index, total, selectedOption, onSelect }: QuestionCardProps) => {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100 dark:bg-card dark:border-slate-800">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-bold tracking-wider text-slate-400 uppercase">
          Question {index + 1} of {total}
        </span>
      </div>

      <h3 className="mb-8 text-xl font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
        {question.text}
      </h3>

      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={cn(
                "w-full flex items-center p-4 rounded-xl transition-all duration-200 border-2 text-left",
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-md dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100" // DARK WHEN SELECTED
                  : "bg-transparent text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800" // EMPTY/TRANSPARENT WHEN NOT SELECTED
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg mr-4 font-bold text-sm transition-colors",
                  isSelected
                    ? "bg-white/20 text-white dark:bg-black/10 dark:text-black"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                )}
              >
                {opt.id.toUpperCase()}
              </div>
              <span className="text-base font-medium">{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;