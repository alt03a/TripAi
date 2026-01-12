import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ItineraryEditor } from "@/components/trips/ItineraryEditor";
import { MapView } from "@/components/trips/MapView";
import { DocumentsPanel } from "@/components/trips/DocumentsPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Share2, Edit, Calendar, MapPin, 
  DollarSign, FileText 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockTripData = {
  id: "1",
  title: "Summer in Bali",
  destination: "Bali, Indonesia",
  startDate: "June 15, 2024",
  endDate: "June 25, 2024",
  status: "upcoming",
  budget: 2500,
  image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop",
  days: [
    {
      date: "June 15, 2024",
      activities: [
        {
          id: "1",
          title: "Airport Transfer",
          time: "10:00",
          location: "Ngurah Rai Airport",
          lat: -8.7467,
          lng: 115.1667,
          duration: "1 hour",
          cost: 50,
          notes: "Pre-booked car service",
        },
        {
          id: "2",
          title: "Hotel Check-in",
          time: "12:00",
          location: "Seminyak Beach Hotel",
          lat: -8.6912,
          lng: 115.1663,
          duration: "30 minutes",
          cost: 0,
        },
        {
          id: "3",
          title: "Beach Sunset",
          time: "18:00",
          location: "Seminyak Beach",
          lat: -8.6872,
          lng: 115.1547,
          duration: "2 hours",
          cost: 20,
          notes: "Dinner at beach club",
        },
      ],
    },
    {
      date: "June 16, 2024",
      activities: [
        {
          id: "4",
          title: "Ubud Rice Terraces",
          time: "08:00",
          location: "Tegallalang Rice Terrace",
          lat: -8.4312,
          lng: 115.2792,
          duration: "3 hours",
          cost: 35,
        },
        {
          id: "5",
          title: "Monkey Forest",
          time: "13:00",
          location: "Sacred Monkey Forest Sanctuary",
          lat: -8.5184,
          lng: 115.2588,
          duration: "2 hours",
          cost: 25,
        },
      ],
    },
    {
      date: "June 17, 2024",
      activities: [],
    },
  ],
  documents: [
    {
      id: "1",
      name: "Flight Ticket.pdf",
      type: "pdf",
      uploadedAt: "May 20, 2024",
    },
    {
      id: "2",
      name: "Hotel Reservation.pdf",
      type: "pdf",
      uploadedAt: "May 22, 2024",
    },
  ],
};

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showMap, setShowMap] = useState(false);
  const [trip, setTrip] = useState(mockTripData);

  const handleShare = () => {
    toast({
      title: "Share link copied!",
      description: "Trip link has been copied to clipboard.",
    });
  };

  const handleUpdateDays = (days: any[]) => {
    setTrip({ ...trip, days });
  };

  const handleUploadDocument = () => {
    toast({
      title: "Upload document",
      description: "Document upload feature coming soon.",
    });
  };

  const handleDeleteDocument = (docId: string) => {
    toast({
      title: "Document deleted",
      description: "The document has been removed.",
    });
  };

  const locations = trip.days
    .flatMap((day) => day.activities)
    .filter((activity) => activity.lat && activity.lng)
    .map((activity) => ({
      name: activity.location,
      lat: activity.lat,
      lng: activity.lng,
    }));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/trips")} className="mb-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="relative h-64 rounded-lg overflow-hidden mb-6">
            <img
              src={trip.image}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-heading font-bold text-white mb-2">
                    {trip.title}
                  </h1>
                  <div className="flex items-center gap-4 text-white/90">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {trip.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {trip.startDate} - {trip.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ${trip.budget}
                    </span>
                  </div>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleShare} variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button onClick={() => navigate(`/plan-trip?edit=${id}`)} variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Trip
            </Button>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="itinerary" className="space-y-6">
          <TabsList>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary">
            <ItineraryEditor
              days={trip.days}
              onUpdateDays={handleUpdateDays}
              showMap={showMap}
              onToggleMap={() => setShowMap(!showMap)}
            />
          </TabsContent>

          <TabsContent value="map">
            <MapView locations={locations} />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsPanel
              documents={trip.documents}
              onUpload={handleUploadDocument}
              onDelete={handleDeleteDocument}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
