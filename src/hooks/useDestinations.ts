import { useQuery } from "@tanstack/react-query";

// Mock data for now - will be replaced with real API calls
const mockDestinations = [
  {
    id: "1",
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop",
    rating: 4.8,
    avgCost: 75,
    tags: ["Beach", "Culture", "Nature"],
    summary: "Tropical paradise with stunning temples and beaches",
    bestTime: "April to October",
  },
  {
    id: "2",
    name: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop",
    rating: 4.9,
    avgCost: 150,
    tags: ["Culture", "Food", "Shopping"],
    summary: "Modern metropolis blending tradition and innovation",
    bestTime: "March to May, September to November",
  },
  {
    id: "3",
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
    rating: 4.7,
    avgCost: 200,
    tags: ["Culture", "Food", "Romantic"],
    summary: "City of lights, art, and romance",
    bestTime: "April to June, September to October",
  },
  {
    id: "4",
    name: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&auto=format&fit=crop",
    rating: 4.9,
    avgCost: 180,
    tags: ["Beach", "Romantic", "Relaxation"],
    summary: "Iconic white-washed buildings and stunning sunsets",
    bestTime: "April to November",
  },
  {
    id: "5",
    name: "New York",
    country: "USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop",
    rating: 4.6,
    avgCost: 250,
    tags: ["Culture", "Shopping", "Nightlife"],
    summary: "The city that never sleeps",
    bestTime: "April to June, September to November",
  },
  {
    id: "6",
    name: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop",
    rating: 4.7,
    avgCost: 220,
    tags: ["Shopping", "Adventure", "Luxury"],
    summary: "Futuristic city with luxury and adventure",
    bestTime: "November to March",
  },
];

export const useDestinations = (query?: string) => {
  return useQuery({
    queryKey: ["destinations", query],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (query) {
        return mockDestinations.filter(
          (d) =>
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.country.toLowerCase().includes(query.toLowerCase()) ||
            d.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
        );
      }
      
      return mockDestinations;
    },
  });
};

export const useFeaturedDestinations = () => {
  return useQuery({
    queryKey: ["featured-destinations"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockDestinations.slice(0, 4);
    },
  });
};

export const useTrendingDestinations = () => {
  return useQuery({
    queryKey: ["trending-destinations"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...mockDestinations].sort((a, b) => b.rating - a.rating).slice(0, 3);
    },
  });
};
