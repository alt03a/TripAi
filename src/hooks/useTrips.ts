import { useQuery } from "@tanstack/react-query";

const mockTrips = [
  {
    id: "1",
    title: "Summer in Bali",
    destination: "Bali, Indonesia",
    startDate: "Jun 15",
    endDate: "Jun 25",
    status: "upcoming" as const,
    progress: 85,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    startDate: "Mar 10",
    endDate: "Mar 20",
    status: "draft" as const,
    progress: 45,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop",
  },
];

export const useRecentTrips = () => {
  return useQuery({
    queryKey: ["recent-trips"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockTrips;
    },
  });
};
