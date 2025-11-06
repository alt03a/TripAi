import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TripPlanner } from "@/components/trips/TripPlanner";
import { ItineraryEditor } from "@/components/trips/ItineraryEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";

export default function PlanTrip() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stage, setStage] = useState<"planning" | "editing">("planning");
  const [tripData, setTripData] = useState<any>(null);
  const [days, setDays] = useState<any[]>([]);

  const handlePlanComplete = (data: any) => {
    setTripData(data);
    
    // Generate mock itinerary based on dates
    const startDate = data.startDate || new Date();
    const endDate = data.endDate || addDays(startDate, 3);
    const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const mockDays = Array.from({ length: dayCount }, (_, i) => ({
      date: format(addDays(startDate, i), "MMMM d, yyyy"),
      activities: i === 0 ? [
        {
          id: crypto.randomUUID(),
          title: "Airport Transfer",
          time: "10:00",
          location: `${data.destination} Airport`,
          duration: "1 hour",
          cost: 50,
          notes: "Suggested pickup service",
        },
        {
          id: crypto.randomUUID(),
          title: "Hotel Check-in",
          time: "12:00",
          location: "City Center",
          duration: "30 minutes",
          cost: 0,
        },
      ] : [],
    }));

    setDays(mockDays);
    setStage("editing");
    
    toast({
      title: "Itinerary Generated!",
      description: "Your personalized itinerary is ready. Customize it as you like.",
    });
  };

  const handleSaveTrip = () => {
    toast({
      title: "Trip Saved!",
      description: "Your trip has been saved to My Trips.",
    });
    navigate("/trips");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                {stage === "planning" ? "Plan Your Trip" : "Customize Itinerary"}
              </h1>
              {tripData && stage === "editing" && (
                <p className="text-muted-foreground">
                  {tripData.destination} • {tripData.startDate && format(tripData.startDate, "MMM d")} - {tripData.endDate && format(tripData.endDate, "MMM d, yyyy")}
                </p>
              )}
            </div>
          </div>
          
          {stage === "editing" && (
            <Button onClick={handleSaveTrip} className="gap-2">
              <Save className="h-4 w-4" />
              Save Trip
            </Button>
          )}
        </div>

        {stage === "planning" ? (
          <TripPlanner onComplete={handlePlanComplete} />
        ) : (
          <ItineraryEditor days={days} onUpdateDays={setDays} />
        )}
      </div>
    </DashboardLayout>
  );
}
