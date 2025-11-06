import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const activityOptions = [
  "Adventure", "Relaxation", "Culture", "Food", "Shopping",
  "Nature", "Nightlife", "Photography", "Sports", "Beach"
];

const languageOptions = [
  "English", "Spanish", "French", "German", "Italian",
  "Japanese", "Chinese", "Portuguese", "Arabic", "Hindi"
];

export const PreferencesForm = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    travelStyle: "balanced",
    budget: "medium",
    activities: ["Adventure", "Culture"],
    languages: ["English"],
  });

  const handleSave = () => {
    toast({
      title: "Preferences Saved",
      description: "Your travel preferences have been updated",
    });
  };

  const addActivity = (activity: string) => {
    if (!preferences.activities.includes(activity)) {
      setPreferences({
        ...preferences,
        activities: [...preferences.activities, activity],
      });
    }
  };

  const removeActivity = (activity: string) => {
    setPreferences({
      ...preferences,
      activities: preferences.activities.filter((a) => a !== activity),
    });
  };

  const addLanguage = (language: string) => {
    if (!preferences.languages.includes(language)) {
      setPreferences({
        ...preferences,
        languages: [...preferences.languages, language],
      });
    }
  };

  const removeLanguage = (language: string) => {
    setPreferences({
      ...preferences,
      languages: preferences.languages.filter((l) => l !== language),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel Preferences</CardTitle>
        <CardDescription>
          Help us personalize your trip recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="travelStyle">Travel Style</Label>
          <Select
            value={preferences.travelStyle}
            onValueChange={(value) =>
              setPreferences({ ...preferences, travelStyle: value })
            }
          >
            <SelectTrigger id="travelStyle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adventure">Adventure Seeker</SelectItem>
              <SelectItem value="relaxation">Relaxation Focused</SelectItem>
              <SelectItem value="cultural">Cultural Explorer</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="luxury">Luxury Traveler</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Typical Budget</Label>
          <Select
            value={preferences.budget}
            onValueChange={(value) =>
              setPreferences({ ...preferences, budget: value })
            }
          >
            <SelectTrigger id="budget">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget ($-$$)</SelectItem>
              <SelectItem value="medium">Medium ($$-$$$)</SelectItem>
              <SelectItem value="premium">Premium ($$$-$$$$)</SelectItem>
              <SelectItem value="luxury">Luxury ($$$$+)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Favorite Activities</Label>
          <Select onValueChange={addActivity}>
            <SelectTrigger>
              <SelectValue placeholder="Add activity" />
            </SelectTrigger>
            <SelectContent>
              {activityOptions.map((activity) => (
                <SelectItem key={activity} value={activity}>
                  {activity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {preferences.activities.map((activity) => (
              <Badge key={activity} variant="secondary" className="gap-1">
                {activity}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeActivity(activity)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Languages</Label>
          <Select onValueChange={addLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Add language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {preferences.languages.map((language) => (
              <Badge key={language} variant="secondary" className="gap-1">
                {language}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeLanguage(language)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
};
