import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDestination } from "@/hooks/useDestinations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
            className="w-full h-[300px] md:h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
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
            <div className="flex items-center gap-2 mb-2">
              {destination.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
              {destination.name}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{destination.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{destination.rating}</span>
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-heading font-semibold mb-3">About {destination.name}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {destination.summary}. {destination.name} is one of the most popular travel destinations, 
                offering visitors a unique blend of experiences. Whether you're seeking adventure, 
                relaxation, or cultural immersion, this destination has something for everyone. 
                The best time to visit is {destination.bestTime?.toLowerCase()}, when the weather is 
                ideal for exploring all the attractions.
              </p>
            </Card>

            {/* Highlights */}
            {destination.highlights && (
              <Card className="p-6">
                <h2 className="text-xl font-heading font-semibold mb-4">Top Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
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
      </div>
    </DashboardLayout>
  );
}