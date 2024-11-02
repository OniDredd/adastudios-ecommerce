'use client';

import { cn } from '../lib/utils';

interface OptionSelectorProps {
  option: {
    name: string;
    values: string[];
  };
  selectedValue: string;
  onSelect: (value: string) => void;
  disabledValues?: string[];
}

export function OptionSelector({
  option,
  selectedValue,
  onSelect,
  disabledValues = []
}: OptionSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{option.name}</label>
      <div className="flex flex-wrap gap-2">
        {option.values.map((value) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            disabled={disabledValues.includes(value)}
            className={cn(
              'h-10 px-4 rounded-full flex items-center justify-center border',
              selectedValue === value
                ? 'border-black'
                : 'border-gray-200',
              disabledValues.includes(value)
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:border-black transition-colors'
            )}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
