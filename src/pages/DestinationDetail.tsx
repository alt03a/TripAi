import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDestination } from "@/hooks/useDestinations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Heart,
  Languages,
  MapPin,
  Star,
  Thermometer,
  Plane,
  Mountain,
  Lightbulb,
  Map,
  Compass,
  Camera,
  Briefcase,
  Shield,
  Navigation,
  Bookmark,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: destination, isLoading } = useDestination(id || "");
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48 col-span-2" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!destination) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-4">
            Destination Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The destination you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/explore")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      Temple: <Compass className="h-4 w-4" />,
      Nature: <Mountain className="h-4 w-4" />,
      Landmark: <Camera className="h-4 w-4" />,
      Museum: <Bookmark className="h-4 w-4" />,
      Historical: <Map className="h-4 w-4" />,
      Beach: <Compass className="h-4 w-4" />,
      Shopping: <Briefcase className="h-4 w-4" />,
    };
    return icons[category] || <MapPin className="h-4 w-4" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Moderate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      "Easy-Moderate": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      Challenging: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[difficulty] || "bg-muted text-muted-foreground";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={destination.gallery?.[selectedImage] || destination.image}
            alt={destination.name}
            className="w-full h-[300px] md:h-[450px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Save Button */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart
              className={cn(
                "h-6 w-6 transition-colors",
                isSaved ? "fill-secondary text-secondary" : "text-muted-foreground"
              )}
            />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {destination.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-2">
              {destination.name}
            </h1>
            <div className="flex items-center gap-4 text-white/90 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{destination.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{destination.rating}/5</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">${destination.avgCost}/day avg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {destination.gallery && destination.gallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {destination.gallery.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                  selectedImage === index
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="gap-2">
              <Globe className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="attractions" className="gap-2">
              <Camera className="h-4 w-4" />
              Attractions
            </TabsTrigger>
            <TabsTrigger value="activities" className="gap-2">
              <Mountain className="h-4 w-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="guide" className="gap-2">
              <Map className="h-4 w-4" />
              Travel Guide
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Summary */}
                <Card className="p-6">
                  <h2 className="text-xl font-heading font-semibold mb-3">About {destination.name}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {destination.summary}
                  </p>
                </Card>

                {/* Highlights */}
                {destination.highlights && destination.highlights.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                      <Star className="h-5 w-5 text-accent" />
                      Top Highlights
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {destination.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="font-medium">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Local Tips */}
                {destination.localTips && destination.localTips.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-accent" />
                      Local Tips
                    </h2>
                    <ul className="space-y-3">
                      {destination.localTips.map((tip, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="text-primary font-bold">•</span>
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Info */}
                <Card className="p-6">
                  <h2 className="text-lg font-heading font-semibold mb-4">Quick Info</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Cost</p>
                        <p className="font-semibold">${destination.avgCost}/day</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Best Time</p>
                        <p className="font-semibold">{destination.bestTime}</p>
                      </div>
                    </div>
                    {destination.climate && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Thermometer className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Climate</p>
                          <p className="font-semibold text-sm">{destination.climate}</p>
                        </div>
                      </div>
                    )}
                    {destination.currency && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Currency</p>
                          <p className="font-semibold">{destination.currency}</p>
                        </div>
                      </div>
                    )}
                    {destination.language && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Languages className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Language</p>
                          <p className="font-semibold">{destination.language}</p>
                        </div>
                      </div>
                    )}
                    {destination.timezone && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Timezone</p>
                          <p className="font-semibold">{destination.timezone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* CTA */}
                <Card className="p-6 bg-primary/5 border-primary/20">
                  <h3 className="font-heading font-semibold mb-2">Ready to explore?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start planning your trip to {destination.name} today.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => navigate("/plan-trip")}
                  >
                    <Plane className="h-4 w-4 mr-2" />
                    Plan a Trip
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Attractions Tab */}
          <TabsContent value="attractions" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-bold">Must-Visit Attractions</h2>
              <p className="text-muted-foreground">
                Discover the top attractions and landmarks in {destination.name}
              </p>
              
              {destination.attractions && destination.attractions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {destination.attractions.map((attraction, index) => (
                    <Card key={index} className="p-5 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {getCategoryIcon(attraction.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-heading font-semibold">{attraction.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {attraction.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {attraction.description}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{attraction.duration}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Attraction information coming soon for {destination.name}
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-bold">Things To Do</h2>
              <p className="text-muted-foreground">
                Experience the best activities and adventures in {destination.name}
              </p>
              
              {destination.activities && destination.activities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {destination.activities.map((activity, index) => (
                    <Card key={index} className="p-5 hover:shadow-lg transition-shadow">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-heading font-semibold">{activity.name}</h3>
                          <Badge className={getDifficultyColor(activity.difficulty)}>
                            {activity.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="flex items-center gap-1 text-sm font-medium text-primary">
                            <DollarSign className="h-4 w-4" />
                            <span>{activity.price_range}</span>
                          </div>
                          <Button size="sm" variant="outline">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Mountain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Activity information coming soon for {destination.name}
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Travel Guide Tab */}
          <TabsContent value="guide" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visa & Getting Around */}
              <Card className="p-6">
                <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Visa Information
                </h3>
                <p className="text-muted-foreground">
                  {destination.travelGuide?.visa_info || "Check with your local embassy for visa requirements."}
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Getting Around
                </h3>
                <p className="text-muted-foreground">
                  {destination.travelGuide?.getting_around || "Various transportation options available for tourists."}
                </p>
              </Card>

              {/* Best Areas */}
              {destination.travelGuide?.best_areas && destination.travelGuide.best_areas.length > 0 && (
                <Card className="p-6 lg:col-span-2">
                  <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Best Areas to Stay
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {destination.travelGuide.best_areas.map((area, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-1">{area.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{area.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {area.vibe}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Health & Safety */}
              <Card className="p-6">
                <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Health & Safety
                </h3>
                <p className="text-muted-foreground">
                  {destination.travelGuide?.health_safety || "Standard travel precautions apply. Consult a travel health clinic before your trip."}
                </p>
              </Card>

              {/* Packing Essentials */}
              {destination.travelGuide?.packing_essentials && destination.travelGuide.packing_essentials.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Packing Essentials
                  </h3>
                  <ul className="space-y-2">
                    {destination.travelGuide.packing_essentials.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
