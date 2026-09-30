import { interviewQuestions } from "@/data/questions";
import { cn } from "@/utils/cn";

interface QuestionNavigatorProps {
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function QuestionNavigator({ currentIndex, onSelect }: QuestionNavigatorProps) {
  return (
    <section className="rounded-lg bg-surface-container-lowest p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-headline-sm">Question bank</h2>
        <span className="font-mono text-label-sm text-outline">{interviewQuestions.length} problems</span>
      </div>
      <label className="mb-2 block text-body-sm text-on-surface-variant">
        Jump to question
        <select
          aria-label="Select interview question"
          className="mt-1 w-full rounded border border-outline-variant bg-surface-container-low px-2 py-1.5 text-body-sm"
          value={currentIndex}
          onChange={(event) => onSelect(Number(event.target.value))}
        >
          {interviewQuestions.map((question, index) => (
            <option key={question.id} value={index}>
              Q{index + 1}. {question.title} ({question.difficulty})
            </option>
          ))}
        </select>
      </label>
      <div className="grid max-h-48 grid-cols-5 gap-1 overflow-auto sm:grid-cols-8">
        {interviewQuestions.map((question, index) => (
          <button
            key={question.id}
            type="button"
            title={`${question.prompt}: ${question.title}`}
            className={cn(
              "rounded px-1 py-1 font-mono text-label-sm",
              index === currentIndex
                ? "bg-primary-container text-on-primary-container"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high",
            )}
            onClick={() => onSelect(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
