const LABELS = ['ア', 'イ', 'ウ', 'エ'] as const;

interface AnswerChoicesProps {
  choices: readonly string[];
  selectedIndex: number | null;
  correctIndex?: number;
  revealed?: boolean;
  disabled?: boolean;
  onSelect: (index: number) => void;
}

export default function AnswerChoices({
  choices,
  selectedIndex,
  correctIndex,
  revealed = false,
  disabled = false,
  onSelect,
}: AnswerChoicesProps) {
  return (
    <div className="flex flex-col gap-2">
      {choices.map((choice, index) => {
        const isSelected = selectedIndex === index;
        const isCorrectChoice = revealed && correctIndex === index;
        const isWrongSelected = revealed && isSelected && correctIndex !== index;

        let stateClasses = 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50';
        if (isCorrectChoice) {
          stateClasses = 'border-emerald-500 bg-emerald-50';
        } else if (isWrongSelected) {
          stateClasses = 'border-rose-500 bg-rose-50';
        } else if (isSelected && !revealed) {
          stateClasses = 'border-blue-500 bg-blue-50';
        }

        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(index)}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors disabled:cursor-not-allowed ${stateClasses}`}
          >
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold ${
                isCorrectChoice
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : isWrongSelected
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : isSelected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 text-slate-500'
              }`}
            >
              {LABELS[index]}
            </span>
            <span className="pt-0.5 leading-relaxed text-slate-800">{choice}</span>
            {isCorrectChoice && <span className="ml-auto shrink-0 text-xs font-bold text-emerald-600">正解</span>}
            {isWrongSelected && <span className="ml-auto shrink-0 text-xs font-bold text-rose-600">あなたの解答</span>}
          </button>
        );
      })}
    </div>
  );
}
