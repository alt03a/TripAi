import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "past" | "draft";
  progress?: number;
  image: string;
  onClick?: () => void;
}

export const TripCard = ({
  title,
  destination,
  startDate,
  endDate,
  status,
  progress = 0,
  image,
  onClick,
}: TripCardProps) => {
  const statusColors = {
    upcoming: "bg-primary text-primary-foreground",
    ongoing: "bg-accent text-accent-foreground",
    past: "bg-muted text-muted-foreground",
    draft: "bg-secondary text-secondary-foreground",
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={image} alt={title} className="object-cover w-full h-full" />
        <Badge className={`absolute top-3 right-3 ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-heading font-semibold text-foreground mb-1">{title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{destination}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{startDate}</span>
          </div>
          <span>-</span>
          <span>{endDate}</span>
        </div>
        {status === "draft" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Planning Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>
    </Card>
  );
};
