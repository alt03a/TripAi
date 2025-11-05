import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  avgCost: number;
  tags: string[];
  onClick?: () => void;
}

export const DestinationCard = ({
  id,
  name,
  country,
  image,
  rating,
  avgCost,
  tags,
  onClick,
}: DestinationCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-10"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isSaved ? "fill-secondary text-secondary" : "text-muted-foreground"
            )}
          />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-2">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-heading font-semibold text-foreground">{name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{country}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-medium text-sm">{rating}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          From <span className="font-semibold text-foreground">${avgCost}</span> / day
        </div>
      </div>
    </Card>
  );
};
