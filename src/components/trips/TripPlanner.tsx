import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MapPin, DollarSign, Users, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TripPlannerProps {
  onComplete: (tripData: any) => void;
}

const activityTags = [
  "Adventure", "Culture", "Relaxation", "Food", "Nature", 
  "Shopping", "Nightlife", "History", "Beach", "Mountains"
];

export const TripPlanner = ({ onComplete }: TripPlannerProps) => {
  const [step, setStep] = useState(1);
  const [tripData, setTripData] = useState({
    destination: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    budget: "",
    companions: "solo",
    selectedActivities: [] as string[],
    notes: "",
  });

  const updateData = (key: string, value: any) => {
    setTripData({ ...tripData, [key]: value });
  };

  const toggleActivity = (activity: string) => {
    const activities = tripData.selectedActivities.includes(activity)
      ? tripData.selectedActivities.filter(a => a !== activity)
      : [...tripData.selectedActivities, activity];
    updateData("selectedActivities", activities);
  };

  const handleGenerate = () => {
    onComplete(tripData);
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                s === step ? "bg-primary text-primary-foreground" : 
                s < step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={cn(
                  "flex-1 h-1 mx-2 transition-colors",
                  s < step ? "bg-accent" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {/* Step 1: Destination */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-heading font-bold">Where to?</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Tokyo, Paris, Bali..."
                value={tripData.destination}
                onChange={(e) => updateData("destination", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Dates */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-heading font-bold">When?</h2>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tripData.startDate ? format(tripData.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tripData.startDate}
                      onSelect={(date) => updateData("startDate", date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tripData.endDate ? format(tripData.endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tripData.endDate}
                      onSelect={(date) => updateData("endDate", date)}
                      initialFocus
                      className="pointer-events-auto"
                      disabled={(date) => tripData.startDate ? date < tripData.startDate : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Budget & Companions */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-heading font-bold">Budget & Travel Style</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 2000"
                value={tripData.budget}
                onChange={(e) => updateData("budget", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Travel Companions</Label>
              <div className="flex gap-2 flex-wrap">
                {["solo", "couple", "family", "friends"].map((type) => (
                  <Badge
                    key={type}
                    variant={tripData.companions === type ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateData("companions", type)}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preferences */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-heading font-bold">What interests you?</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {activityTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={tripData.selectedActivities.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleActivity(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="space-y-2 mt-6">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special requirements or preferences..."
                value={tripData.notes}
                onChange={(e) => updateData("notes", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Back
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleGenerate} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Itinerary
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
