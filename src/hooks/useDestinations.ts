import { useQuery } from "@tanstack/react-query";

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  avgCost: number;
  tags: string[];
  summary: string;
  bestTime: string;
  highlights?: string[];
  climate?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  gallery?: string[];
}

// Mock data for now - will be replaced with real API calls
const mockDestinations: Destination[] = [
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
    highlights: ["Ubud Rice Terraces", "Uluwatu Temple", "Seminyak Beach", "Mount Batur Sunrise Trek", "Tanah Lot Temple"],
    climate: "Tropical with dry and wet seasons",
    currency: "Indonesian Rupiah (IDR)",
    language: "Indonesian, Balinese",
    timezone: "GMT+8",
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&auto=format&fit=crop",
    ],
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
    highlights: ["Shibuya Crossing", "Senso-ji Temple", "Tokyo Skytree", "Tsukiji Outer Market", "Harajuku District"],
    climate: "Humid subtropical with four seasons",
    currency: "Japanese Yen (JPY)",
    language: "Japanese",
    timezone: "GMT+9",
    gallery: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&auto=format&fit=crop",
    ],
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
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Champs-Élysées", "Montmartre"],
    climate: "Oceanic with mild winters and warm summers",
    currency: "Euro (EUR)",
    language: "French",
    timezone: "GMT+1",
    gallery: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=800&auto=format&fit=crop",
    ],
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
    highlights: ["Oia Sunset", "Red Beach", "Akrotiri Archaeological Site", "Fira Town", "Wine Tasting Tours"],
    climate: "Mediterranean with hot, dry summers",
    currency: "Euro (EUR)",
    language: "Greek",
    timezone: "GMT+2",
    gallery: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop",
    ],
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
    highlights: ["Statue of Liberty", "Central Park", "Times Square", "Brooklyn Bridge", "Empire State Building"],
    climate: "Humid subtropical with hot summers and cold winters",
    currency: "US Dollar (USD)",
    language: "English",
    timezone: "GMT-5",
    gallery: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&auto=format&fit=crop",
    ],
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
    highlights: ["Burj Khalifa", "Palm Jumeirah", "Dubai Mall", "Desert Safari", "Dubai Marina"],
    climate: "Hot desert climate with very hot summers",
    currency: "UAE Dirham (AED)",
    language: "Arabic, English",
    timezone: "GMT+4",
    gallery: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&auto=format&fit=crop",
    ],
  },
];

export const useDestinations = (query?: string) => {
  return useQuery({
    queryKey: ["destinations", query],
    queryFn: async () => {
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

export const useDestination = (id: string) => {
  return useQuery({
    queryKey: ["destination", id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDestinations.find((d) => d.id === id) || null;
    },
    enabled: !!id,
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
