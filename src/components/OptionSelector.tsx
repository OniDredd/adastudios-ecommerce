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

const colorMap: { [key: string]: string } = {
  // Muted, sophisticated color palette
  'black': '#2C2C2C',
  'white': '#FAFAFA',
  'red': '#D35F5F',
  'blue': '#6B8CAE',
  'green': '#7FA283',
  'yellow': '#E6C670',
  'purple': '#9B8AA6',
  'pink': '#E6B3B3',
  'orange': '#E6A seventeen5',
  'brown': '#9F8170',
  'gray': '#939393',
  'grey': '#939393',
  'navy': '#414756',
  'navy blue': '#414756',
  'light blue': '#B6CAD7',
  'dark blue': '#2B4B6F',
  'light green': '#B7C9B7',
  'dark green': '#3C5141',
  'olive green': '#8B8B6E',
  'forest green': '#4A634E',
  'hot pink': '#D67E7E',
  'light pink': '#E6CCCC',
  'dark pink': '#C45B5B',
  'burgundy': '#8E4A4A',
  'maroon': '#804D4D',
  'beige': '#E8E6D9',
  'cream': '#F0EDE3',
  'tan': '#C4B5A2',
  'khaki': '#B5AD98',
  'silver': '#C5C5C5',
  'gold': '#D4B86A',
  'bronze': '#B17F5C',
  'charcoal': '#4A4A4A',
  'ivory': '#F6F3E7',
};

function isColorOption(optionName: string): boolean {
  return optionName.toLowerCase().includes('color') || 
         optionName.toLowerCase().includes('colour');
}

function getColorCode(colorName: string): string | null {
  const normalizedColor = colorName.toLowerCase().trim();
  return colorMap[normalizedColor] || null;
}

export function OptionSelector({
  option,
  selectedValue,
  onSelect,
  disabledValues = []
}: OptionSelectorProps) {
  const isColor = isColorOption(option.name);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <label className="text-sm tracking-wide uppercase text-main-maroon/80">
          {option.name}
        </label>
        {isColor && selectedValue && (
          <span className="text-xs text-main-maroon/60 capitalize">
            {selectedValue}
          </span>
        )}
      </div>
      
      <div className={cn(
        "flex flex-wrap",
        isColor ? "gap-4" : "gap-2"
      )}>
        {option.values.map((value) => {
          const colorCode = isColor ? getColorCode(value) : null;
          
          if (colorCode) {
            return (
              <button
                key={value}
                onClick={() => onSelect(value)}
                disabled={disabledValues.includes(value)}
                className={cn(
                  'group relative w-7 h-7 rounded-full flex items-center justify-center',
                  'transition-all duration-300 ease-in-out',
                  selectedValue === value
                    ? 'scale-110'
                    : 'hover:scale-105',
                  disabledValues.includes(value)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                )}
                title={value}
              >
                <span 
                  className={cn(
                    'absolute inset-0 rounded-full transition-transform duration-300',
                    'group-hover:scale-110 group-active:scale-95',
                    selectedValue === value 
                      ? 'ring-1 ring-main-maroon/40 ring-offset-1'
                      : ''
                  )}
                  style={{ backgroundColor: colorCode }}
                />
                {(colorCode === '#FAFAFA' || colorCode === '#F6F3E7' || colorCode === '#F0EDE3' || colorCode === '#E8E6D9') && (
                  <span 
                    className={cn(
                      'absolute inset-0 rounded-full border',
                      selectedValue === value 
                        ? 'border-main-maroon/40'
                        : 'border-gray-200'
                    )}
                  />
                )}
              </button>
            );
          }

          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              disabled={disabledValues.includes(value)}
              className={cn(
                'px-6 py-2.5 rounded-full text-sm tracking-wide transition-all duration-300',
                'border border-main-maroon/20 backdrop-blur-sm',
                selectedValue === value
                  ? 'bg-main-maroon/90 text-secondary-peach shadow-sm scale-105'
                  : 'bg-transparent text-main-maroon hover:border-main-maroon/40 hover:scale-105',
                disabledValues.includes(value)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              )}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
