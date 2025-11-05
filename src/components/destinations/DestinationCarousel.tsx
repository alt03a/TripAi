import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DestinationCard } from "./DestinationCard";
import { useNavigate } from "react-router-dom";

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  avgCost: number;
  tags: string[];
}

interface DestinationCarouselProps {
  title: string;
  destinations: Destination[];
}

export const DestinationCarousel = ({ title, destinations }: DestinationCarouselProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-heading font-bold text-foreground">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {destinations.map((destination) => (
            <CarouselItem key={destination.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <DestinationCard
                {...destination}
                onClick={() => navigate(`/destinations/${destination.id}`)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};
