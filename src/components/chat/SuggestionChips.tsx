import { Button } from "@/components/ui/button";

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
}

const suggestions = [
  "Plan a weekend trip",
  "Best time to visit Japan",
  "Budget-friendly destinations in Europe",
  "Adventure activities in New Zealand",
  "Family-friendly resorts",
  "Solo travel safety tips",
];

export const SuggestionChips = ({ onSelect }: SuggestionChipsProps) => {
  return (
    <div className="p-4 border-b border-border">
      <p className="text-sm text-muted-foreground mb-2">Quick suggestions:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
            className="text-xs"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};
