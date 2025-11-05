import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Filter } from "lucide-react";

interface FilterBarProps {
  onBudgetChange: (value: number[]) => void;
  onSeasonChange: (season: string) => void;
  onMoodChange: (mood: string) => void;
  selectedActivities: string[];
  onActivityToggle: (activity: string) => void;
}

const activities = ["Adventure", "Beach", "Culture", "Food", "Nature", "Shopping", "Nightlife", "Relaxation"];
const moods = ["Romantic", "Adventure", "Relaxing", "Cultural", "Party", "Family"];

export const FilterBar = ({
  onBudgetChange,
  onSeasonChange,
  onMoodChange,
  selectedActivities,
  onActivityToggle,
}: FilterBarProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2 text-foreground">
        <Filter className="h-5 w-5" />
        <h3 className="font-heading font-semibold">Filters</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Budget (per day)</label>
          <Slider
            defaultValue={[100]}
            max={500}
            step={10}
            onValueChange={onBudgetChange}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Season</label>
          <Select onValueChange={onSeasonChange}>
            <SelectTrigger>
              <SelectValue placeholder="Any season" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="any">Any season</SelectItem>
              <SelectItem value="spring">Spring</SelectItem>
              <SelectItem value="summer">Summer</SelectItem>
              <SelectItem value="fall">Fall</SelectItem>
              <SelectItem value="winter">Winter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Mood</label>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <Badge
                key={mood}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onMoodChange(mood)}
              >
                {mood}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Activities</label>
          <div className="flex flex-wrap gap-2">
            {activities.map((activity) => (
              <Badge
                key={activity}
                variant={selectedActivities.includes(activity) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => onActivityToggle(activity)}
              >
                {activity}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
