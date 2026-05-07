"use client";

import { Question } from "@/lib/domain/types";

interface QuestionGroupProps {
  question: Question;
  value?: number;
  onChange: (questionId: string, value: number) => void;
  error?: string;
}

const options = [1, 2, 3, 4, 5];

export function QuestionGroup({ question, value, onChange, error }: QuestionGroupProps) {
  return (
    <fieldset className="rounded-lg border border-slate-200 p-4">
      <legend className="px-1 text-sm font-semibold text-slate-700">{question.text}</legend>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer flex-col items-center gap-1 rounded-md border border-slate-200 p-2 text-xs"
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={value === option}
              onChange={() => onChange(question.id, option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </fieldset>
  );
}
