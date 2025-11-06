import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, MapPin, DollarSign, Plus, GripVertical, 
  Edit, Trash2, Map as MapIcon 
} from "lucide-react";
import { ActivityModal } from "./ActivityModal";

interface Activity {
  id: string;
  title: string;
  time: string;
  location: string;
  duration: string;
  cost: number;
  notes?: string;
}

interface Day {
  date: string;
  activities: Activity[];
}

interface ItineraryEditorProps {
  days: Day[];
  onUpdateDays: (days: Day[]) => void;
  showMap?: boolean;
  onToggleMap?: () => void;
}

export const ItineraryEditor = ({ 
  days, 
  onUpdateDays,
  showMap = false,
  onToggleMap 
}: ItineraryEditorProps) => {
  const [editingActivity, setEditingActivity] = useState<{ dayIndex: number; activity?: Activity } | null>(null);

  const handleAddActivity = (dayIndex: number) => {
    setEditingActivity({ dayIndex });
  };

  const handleSaveActivity = (dayIndex: number, activity: Activity) => {
    const newDays = [...days];
    const activityIndex = newDays[dayIndex].activities.findIndex(a => a.id === activity.id);
    
    if (activityIndex >= 0) {
      newDays[dayIndex].activities[activityIndex] = activity;
    } else {
      newDays[dayIndex].activities.push(activity);
    }
    
    onUpdateDays(newDays);
    setEditingActivity(null);
  };

  const handleDeleteActivity = (dayIndex: number, activityId: string) => {
    const newDays = [...days];
    newDays[dayIndex].activities = newDays[dayIndex].activities.filter(a => a.id !== activityId);
    onUpdateDays(newDays);
  };

  const totalBudget = days.reduce((total, day) => 
    total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.cost, 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <Card className="p-4 bg-accent/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Estimated Cost</p>
            <p className="text-2xl font-bold text-foreground">${totalBudget.toFixed(2)}</p>
          </div>
          {onToggleMap && (
            <Button variant="outline" onClick={onToggleMap} className="gap-2">
              <MapIcon className="h-4 w-4" />
              {showMap ? "Hide" : "Show"} Map
            </Button>
          )}
        </div>
      </Card>

      {/* Days Timeline */}
      <div className="space-y-6">
        {days.map((day, dayIndex) => (
          <Card key={dayIndex} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-heading font-semibold">Day {dayIndex + 1}</h3>
                <p className="text-sm text-muted-foreground">{day.date}</p>
              </div>
              <Button onClick={() => handleAddActivity(dayIndex)} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Activity
              </Button>
            </div>

            {/* Activities */}
            <div className="space-y-3">
              {day.activities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No activities yet. Add your first activity!
                </div>
              ) : (
                day.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="cursor-move pt-1">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{activity.title}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {activity.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {activity.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ${activity.cost}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingActivity({ dayIndex, activity })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteActivity(dayIndex, activity.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{activity.location}</span>
                      </div>
                      
                      {activity.notes && (
                        <p className="text-sm text-muted-foreground">{activity.notes}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Activity Modal */}
      {editingActivity && (
        <ActivityModal
          isOpen={true}
          onClose={() => setEditingActivity(null)}
          onSave={(activity) => handleSaveActivity(editingActivity.dayIndex, activity)}
          activity={editingActivity.activity}
        />
      )}
    </div>
  );
};
