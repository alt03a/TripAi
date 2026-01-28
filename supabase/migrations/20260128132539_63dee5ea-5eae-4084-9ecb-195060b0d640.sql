-- Create wishlists table for saving favorite destinations
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, destination_id)
);

-- Enable RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist"
  ON public.wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their wishlist"
  ON public.wishlists FOR DELETE
  USING (auth.uid() = user_id);

-- Add location columns to destinations
ALTER TABLE public.destinations 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Update ALL destinations with complete content including locations
UPDATE public.destinations SET
  highlights = ARRAY['Ancient temples and rice terraces', 'World-class surfing beaches', 'Traditional Balinese ceremonies', 'Luxury wellness retreats', 'Vibrant nightlife in Seminyak'],
  attractions = '[{"name": "Tanah Lot Temple", "description": "Iconic sea temple perched on a rock formation", "category": "Temple", "duration": "2-3 hours"}, {"name": "Tegallalang Rice Terraces", "description": "Stunning UNESCO-listed terraced rice paddies", "category": "Nature", "duration": "2-3 hours"}, {"name": "Uluwatu Temple", "description": "Clifftop temple with spectacular sunset views", "category": "Temple", "duration": "3-4 hours"}, {"name": "Sacred Monkey Forest", "description": "Ancient temple complex home to hundreds of monkeys", "category": "Nature", "duration": "2-3 hours"}]'::jsonb,
  activities = '[{"name": "Surfing in Kuta", "description": "Learn to surf on Bali''s famous waves", "difficulty": "Beginner to Advanced", "price_range": "$30-80"}, {"name": "Mount Batur Sunrise Trek", "description": "Hike an active volcano for sunrise views", "difficulty": "Moderate", "price_range": "$50-100"}, {"name": "Balinese Cooking Class", "description": "Learn traditional recipes at a local home", "difficulty": "Easy", "price_range": "$40-70"}, {"name": "White Water Rafting", "description": "Adventure down the Ayung River", "difficulty": "Moderate", "price_range": "$50-90"}]'::jsonb,
  local_tips = ARRAY['Haggle respectfully at markets - start at 50% of asking price', 'Carry small bills for temple donations and tips', 'Dress modestly when visiting temples (sarongs available)', 'Book drivers for day trips rather than renting scooters', 'Visit temples early morning to avoid crowds'],
  travel_guide = '{"visa_info": "Many nationalities get 30-day visa on arrival. Visa extension possible for 30 more days.", "getting_around": "Hire private drivers for day trips, use Grab/Gojek for short distances. Scooter rental popular but risky.", "best_areas": [{"name": "Ubud", "description": "Cultural heart with rice terraces and yoga retreats", "vibe": "Spiritual & Artsy"}, {"name": "Seminyak", "description": "Trendy beach area with boutiques and beach clubs", "vibe": "Upscale & Vibrant"}, {"name": "Canggu", "description": "Laid-back surf town with digital nomad scene", "vibe": "Hipster & Relaxed"}], "packing_essentials": ["Light, breathable clothing", "Sarong for temple visits", "Reef-safe sunscreen", "Mosquito repellent", "Water shoes for waterfalls"], "health_safety": "Drink bottled water only. Be cautious with street food. Travel insurance recommended."}'::jsonb,
  climate = 'Tropical with dry season (Apr-Oct) and wet season (Nov-Mar). Avg temp 27°C year-round.',
  currency = 'Indonesian Rupiah (IDR)',
  language = 'Indonesian, Balinese',
  timezone = 'WITA (UTC+8)',
  gallery = ARRAY['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800', 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800'],
  latitude = -8.4095,
  longitude = 115.1889
WHERE name = 'Bali';

UPDATE public.destinations SET
  highlights = ARRAY['Cutting-edge technology and ancient traditions', 'World-renowned cuisine from ramen to sushi', 'Cherry blossom season magic', 'Efficient public transportation', 'Unique pop culture and anime scene'],
  attractions = '[{"name": "Senso-ji Temple", "description": "Tokyo''s oldest and most significant Buddhist temple", "category": "Temple", "duration": "2-3 hours"}, {"name": "Tokyo Skytree", "description": "Tallest structure in Japan with observation decks", "category": "Landmark", "duration": "2-3 hours"}, {"name": "Shibuya Crossing", "description": "World''s busiest pedestrian crossing", "category": "Landmark", "duration": "1 hour"}, {"name": "Meiji Shrine", "description": "Peaceful Shinto shrine in forested grounds", "category": "Temple", "duration": "2 hours"}]'::jsonb,
  activities = '[{"name": "Tsukiji Outer Market Tour", "description": "Explore the famous fish market and taste fresh sushi", "difficulty": "Easy", "price_range": "$50-100"}, {"name": "Traditional Tea Ceremony", "description": "Experience Japanese tea culture firsthand", "difficulty": "Easy", "price_range": "$30-80"}, {"name": "Robot Restaurant Show", "description": "Bizarre and entertaining robot cabaret", "difficulty": "Easy", "price_range": "$80-100"}, {"name": "Sumo Wrestling Match", "description": "Watch Japan''s national sport live", "difficulty": "Easy", "price_range": "$50-200"}]'::jsonb,
  local_tips = ARRAY['Get a Suica/Pasmo card for easy transit', 'Bow when greeting and thanking people', 'Remove shoes when entering homes and some restaurants', 'Cash is still king in many places', 'Quiet voices on public transport are expected'],
  travel_guide = '{"visa_info": "Many countries have visa-free access for 90 days. Check requirements for your nationality.", "getting_around": "JR Pass essential for tourists. Subway efficient but complex - use Google Maps. Taxis expensive.", "best_areas": [{"name": "Shinjuku", "description": "Major hub with entertainment and nightlife", "vibe": "Bustling & Exciting"}, {"name": "Shibuya", "description": "Youth culture center with shopping and dining", "vibe": "Trendy & Energetic"}, {"name": "Asakusa", "description": "Traditional Tokyo with temples and old-town charm", "vibe": "Historic & Cultural"}], "packing_essentials": ["Comfortable walking shoes", "Portable WiFi or SIM card", "Small towel (not provided everywhere)", "Cash in Yen", "Power adapter (Type A/B)"], "health_safety": "One of the safest cities in the world. Tap water is drinkable. Excellent healthcare."}'::jsonb,
  climate = 'Four distinct seasons. Hot humid summers (Jun-Aug), mild spring (Mar-May) with cherry blossoms. Avg temp 16°C.',
  currency = 'Japanese Yen (JPY)',
  language = 'Japanese',
  timezone = 'JST (UTC+9)',
  gallery = ARRAY['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800', 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800'],
  latitude = 35.6762,
  longitude = 139.6503
WHERE name = 'Tokyo';

UPDATE public.destinations SET
  highlights = ARRAY['Eiffel Tower and iconic landmarks', 'World-class art museums', 'Exquisite French cuisine', 'Romantic Seine River cruises', 'Charming neighborhoods and cafés'],
  attractions = '[{"name": "Eiffel Tower", "description": "Iconic iron lattice tower and symbol of Paris", "category": "Landmark", "duration": "3-4 hours"}, {"name": "Louvre Museum", "description": "World''s largest art museum housing the Mona Lisa", "category": "Museum", "duration": "4-6 hours"}, {"name": "Notre-Dame Cathedral", "description": "Gothic masterpiece on Île de la Cité", "category": "Architecture", "duration": "2 hours"}, {"name": "Sacré-Cœur Basilica", "description": "White-domed basilica atop Montmartre", "category": "Architecture", "duration": "2-3 hours"}]'::jsonb,
  activities = '[{"name": "Seine River Cruise", "description": "Romantic boat ride past illuminated monuments", "difficulty": "Easy", "price_range": "$15-80"}, {"name": "Wine Tasting in Montmartre", "description": "Sample French wines in historic vineyard area", "difficulty": "Easy", "price_range": "$40-100"}, {"name": "Cooking Class", "description": "Learn to make croissants and French classics", "difficulty": "Easy", "price_range": "$80-150"}, {"name": "Versailles Day Trip", "description": "Explore the opulent palace and gardens", "difficulty": "Easy", "price_range": "$50-120"}]'::jsonb,
  local_tips = ARRAY['Learn basic French phrases - locals appreciate the effort', 'Museums free first Sunday of month', 'Metro is efficient - buy carnet of 10 tickets', 'Tipping not expected but rounding up is nice', 'Many shops close on Sundays'],
  travel_guide = '{"visa_info": "Schengen visa rules apply. Many nationalities get 90 days visa-free.", "getting_around": "Metro is best for getting around. Paris is very walkable. Vélib bikes available.", "best_areas": [{"name": "Le Marais", "description": "Historic Jewish quarter with trendy boutiques", "vibe": "Artsy & Historic"}, {"name": "Saint-Germain-des-Prés", "description": "Literary cafés and upscale shopping", "vibe": "Intellectual & Elegant"}, {"name": "Montmartre", "description": "Bohemian hilltop village with Sacré-Cœur", "vibe": "Romantic & Artistic"}], "packing_essentials": ["Comfortable walking shoes", "Layers for variable weather", "Scarf or wrap for churches", "Reusable water bottle", "Adapter for EU outlets"], "health_safety": "Very safe for tourists. Watch for pickpockets in crowded areas. Tap water is safe."}'::jsonb,
  climate = 'Mild continental climate. Warm summers, cold winters. Best weather Apr-Jun and Sep-Oct. Avg temp 12°C.',
  currency = 'Euro (EUR)',
  language = 'French',
  timezone = 'CET (UTC+1)',
  gallery = ARRAY['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800', 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800'],
  latitude = 48.8566,
  longitude = 2.3522
WHERE name = 'Paris';

UPDATE public.destinations SET
  highlights = ARRAY['Stunning blue-domed churches', 'World-famous sunsets in Oia', 'Volcanic beaches and hot springs', 'Ancient Akrotiri ruins', 'Exceptional local wines'],
  attractions = '[{"name": "Oia Village", "description": "Picturesque village famous for stunning sunsets", "category": "Village", "duration": "4-5 hours"}, {"name": "Red Beach", "description": "Unique beach with striking red volcanic cliffs", "category": "Beach", "duration": "2-3 hours"}, {"name": "Akrotiri Archaeological Site", "description": "Preserved Bronze Age settlement", "category": "Historical", "duration": "2-3 hours"}, {"name": "Fira Town", "description": "Main town with caldera views and museums", "category": "Village", "duration": "3-4 hours"}]'::jsonb,
  activities = '[{"name": "Sunset Sailing Cruise", "description": "Catamaran cruise around the caldera at sunset", "difficulty": "Easy", "price_range": "$80-150"}, {"name": "Wine Tasting Tour", "description": "Sample Assyrtiko and other local varieties", "difficulty": "Easy", "price_range": "$50-100"}, {"name": "Volcano Hot Springs Hike", "description": "Trek the volcano and swim in hot springs", "difficulty": "Moderate", "price_range": "$40-80"}, {"name": "Greek Cooking Class", "description": "Learn traditional Santorinian recipes", "difficulty": "Easy", "price_range": "$80-120"}]'::jsonb,
  local_tips = ARRAY['Book accommodations with caldera views in advance', 'Visit Oia sunset spot early to get a good position', 'Rent an ATV to explore the island freely', 'Avoid cruise ship days for less crowds', 'Try local tomatoes and fava beans'],
  travel_guide = '{"visa_info": "Schengen visa rules apply. Many nationalities get 90 days visa-free.", "getting_around": "Rent ATV or car. Local buses available but infrequent. Taxis expensive.", "best_areas": [{"name": "Oia", "description": "Most photographed village with luxury hotels", "vibe": "Romantic & Exclusive"}, {"name": "Fira", "description": "Main town with best nightlife and shopping", "vibe": "Vibrant & Central"}, {"name": "Imerovigli", "description": "Quiet village with best caldera views", "vibe": "Peaceful & Scenic"}], "packing_essentials": ["Comfortable sandals for cobblestones", "Sunscreen and hat", "Light layers for evening", "Camera for sunsets", "Swimwear"], "health_safety": "Very safe island. Strong sun - stay hydrated. Some steep walks."}'::jsonb,
  climate = 'Mediterranean climate. Hot dry summers (Jun-Sep), mild winters. Best time Apr-Oct. Avg temp 20°C.',
  currency = 'Euro (EUR)',
  language = 'Greek',
  timezone = 'EET (UTC+2)',
  gallery = ARRAY['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800'],
  latitude = 36.3932,
  longitude = 25.4615
WHERE name = 'Santorini';

UPDATE public.destinations SET
  highlights = ARRAY['Iconic skyline and Statue of Liberty', 'Broadway shows and theater district', 'World-class museums and galleries', 'Diverse culinary scene', 'Central Park urban oasis'],
  attractions = '[{"name": "Statue of Liberty", "description": "Iconic symbol of freedom on Liberty Island", "category": "Landmark", "duration": "4-5 hours"}, {"name": "Central Park", "description": "843-acre urban park in Manhattan", "category": "Nature", "duration": "3-4 hours"}, {"name": "Empire State Building", "description": "Art Deco skyscraper with observation decks", "category": "Landmark", "duration": "2-3 hours"}, {"name": "Metropolitan Museum of Art", "description": "One of the world''s largest art museums", "category": "Museum", "duration": "4-6 hours"}]'::jsonb,
  activities = '[{"name": "Broadway Show", "description": "World-famous theater experience", "difficulty": "Easy", "price_range": "$80-300"}, {"name": "Food Tour in Greenwich Village", "description": "Sample diverse cuisines and local favorites", "difficulty": "Easy", "price_range": "$60-100"}, {"name": "Helicopter Tour", "description": "Aerial views of Manhattan skyline", "difficulty": "Easy", "price_range": "$200-400"}, {"name": "Brooklyn Bridge Walk", "description": "Iconic walk with stunning city views", "difficulty": "Easy", "price_range": "Free"}]'::jsonb,
  local_tips = ARRAY['Buy MetroCard for unlimited subway rides', 'Walk across Brooklyn Bridge for great photos', 'TKTS booth for discounted same-day Broadway tickets', 'Avoid Times Square restaurants - overpriced', 'Museums often have pay-what-you-wish evenings'],
  travel_guide = '{"visa_info": "ESTA required for Visa Waiver Program countries. Apply online 72+ hours before travel.", "getting_around": "Subway is fastest and cheapest. Uber/Lyft available. Yellow cabs iconic but pricey.", "best_areas": [{"name": "Midtown", "description": "Central location near Times Square and theaters", "vibe": "Bustling & Tourist-friendly"}, {"name": "SoHo", "description": "Trendy shopping and cast-iron architecture", "vibe": "Artsy & Upscale"}, {"name": "Brooklyn", "description": "Hip neighborhoods with local flavor", "vibe": "Creative & Diverse"}], "packing_essentials": ["Comfortable walking shoes", "Layers for weather changes", "Portable phone charger", "Light rain jacket", "Subway map/app"], "health_safety": "Generally safe but stay aware in crowded areas. Tap water is excellent."}'::jsonb,
  climate = 'Four seasons with hot humid summers and cold snowy winters. Best time Apr-Jun and Sep-Nov. Avg temp 13°C.',
  currency = 'US Dollar (USD)',
  language = 'English',
  timezone = 'EST (UTC-5)',
  gallery = ARRAY['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800', 'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800'],
  latitude = 40.7128,
  longitude = -74.0060
WHERE name = 'New York City';

UPDATE public.destinations SET
  highlights = ARRAY['Burj Khalifa - world''s tallest building', 'Luxury shopping malls', 'Desert safari adventures', 'Palm Jumeirah man-made island', 'Futuristic architecture'],
  attractions = '[{"name": "Burj Khalifa", "description": "World''s tallest building at 828 meters", "category": "Landmark", "duration": "2-3 hours"}, {"name": "Dubai Mall", "description": "World''s largest shopping mall with aquarium", "category": "Shopping", "duration": "4-6 hours"}, {"name": "Palm Jumeirah", "description": "Iconic palm-shaped artificial island", "category": "Landmark", "duration": "3-4 hours"}, {"name": "Dubai Marina", "description": "Upscale waterfront district with skyscrapers", "category": "Neighborhood", "duration": "3-4 hours"}]'::jsonb,
  activities = '[{"name": "Desert Safari", "description": "Dune bashing, camel rides, and BBQ dinner", "difficulty": "Easy", "price_range": "$60-150"}, {"name": "Dhow Cruise Dinner", "description": "Traditional boat cruise with dinner and views", "difficulty": "Easy", "price_range": "$50-100"}, {"name": "Skydiving over Palm", "description": "Tandem skydive with Palm Jumeirah views", "difficulty": "Adventurous", "price_range": "$400-600"}, {"name": "Indoor Skiing", "description": "Ski slopes inside Mall of Emirates", "difficulty": "Easy to Moderate", "price_range": "$60-120"}]'::jsonb,
  local_tips = ARRAY['Dress modestly outside resorts and beaches', 'Alcohol only in licensed venues', 'Friday is the weekend day off', 'Haggle in traditional souks', 'Metro is clean and efficient'],
  travel_guide = '{"visa_info": "Many nationalities get visa on arrival for 30-90 days. Check requirements.", "getting_around": "Metro is modern and efficient. Taxis affordable. Water taxis for Marina areas.", "best_areas": [{"name": "Downtown Dubai", "description": "Near Burj Khalifa and Dubai Mall", "vibe": "Modern & Central"}, {"name": "Dubai Marina", "description": "Waterfront living with dining options", "vibe": "Trendy & Upscale"}, {"name": "Old Dubai", "description": "Historic area with souks and creek", "vibe": "Traditional & Authentic"}], "packing_essentials": ["Modest clothing for public areas", "Sunscreen and sunglasses", "Light breathable fabrics", "Swimming attire", "Comfortable shoes for malls"], "health_safety": "Very safe city. Tap water is safe. Stay hydrated in extreme heat."}'::jsonb,
  climate = 'Desert climate with very hot summers (40°C+). Best time Nov-Mar with pleasant 20-25°C.',
  currency = 'UAE Dirham (AED)',
  language = 'Arabic, English widely spoken',
  timezone = 'GST (UTC+4)',
  gallery = ARRAY['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800', 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800'],
  latitude = 25.2048,
  longitude = 55.2708
WHERE name = 'Dubai';

UPDATE public.destinations SET
  highlights = ARRAY['Ancient Colosseum and Forum', 'Vatican City and St. Peter''s Basilica', 'Renaissance art and architecture', 'Authentic Italian cuisine', 'Romantic fountains and piazzas'],
  attractions = '[{"name": "Colosseum", "description": "Ancient Roman gladiatorial amphitheater", "category": "Historical", "duration": "3-4 hours"}, {"name": "Vatican Museums", "description": "Extensive art collection and Sistine Chapel", "category": "Museum", "duration": "4-5 hours"}, {"name": "Trevi Fountain", "description": "Baroque masterpiece and coin-tossing tradition", "category": "Landmark", "duration": "1 hour"}, {"name": "Roman Forum", "description": "Ancient center of Roman public life", "category": "Historical", "duration": "2-3 hours"}]'::jsonb,
  activities = '[{"name": "Pasta Making Class", "description": "Learn authentic Italian pasta from scratch", "difficulty": "Easy", "price_range": "$60-100"}, {"name": "Vespa Tour", "description": "Explore Rome on iconic Italian scooter", "difficulty": "Easy", "price_range": "$80-150"}, {"name": "Underground Rome Tour", "description": "Explore catacombs and hidden chambers", "difficulty": "Easy", "price_range": "$40-80"}, {"name": "Wine Tasting Excursion", "description": "Day trip to Castelli Romani wineries", "difficulty": "Easy", "price_range": "$100-180"}]'::jsonb,
  local_tips = ARRAY['Book Vatican and Colosseum tickets online to skip lines', 'Dress code enforced at Vatican (covered shoulders and knees)', 'Avoid restaurants with picture menus near attractions', 'Aperitivo hour offers free snacks with drinks', 'Validate train tickets before boarding'],
  travel_guide = '{"visa_info": "Schengen visa rules apply. Many nationalities get 90 days visa-free.", "getting_around": "Walking is best for centro storico. Metro has two lines. Buses can be confusing.", "best_areas": [{"name": "Centro Storico", "description": "Historic center with Pantheon and Piazza Navona", "vibe": "Classic & Central"}, {"name": "Trastevere", "description": "Charming neighborhood with local restaurants", "vibe": "Bohemian & Authentic"}, {"name": "Monti", "description": "Trendy area near Colosseum with boutiques", "vibe": "Hip & Artsy"}], "packing_essentials": ["Comfortable walking shoes (cobblestones!)", "Modest clothing for churches", "Reusable water bottle", "Sun hat for summer", "EU power adapter"], "health_safety": "Safe for tourists. Beware of pickpockets. Public fountains have drinkable water."}'::jsonb,
  climate = 'Mediterranean climate. Hot summers, mild winters. Best time Apr-Jun and Sep-Oct. Avg temp 16°C.',
  currency = 'Euro (EUR)',
  language = 'Italian',
  timezone = 'CET (UTC+1)',
  gallery = ARRAY['https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800', 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800'],
  latitude = 41.9028,
  longitude = 12.4964
WHERE name = 'Rome';

UPDATE public.destinations SET
  highlights = ARRAY['Ancient Incan citadel at 2,430m', 'Stunning Andean mountain scenery', 'Rich Peruvian history and culture', 'Sacred Valley exploration', 'Unique local cuisine'],
  attractions = '[{"name": "Machu Picchu Citadel", "description": "Iconic 15th-century Incan citadel", "category": "Historical", "duration": "4-6 hours"}, {"name": "Huayna Picchu", "description": "Steep mountain peak with panoramic views", "category": "Nature", "duration": "2-3 hours"}, {"name": "Sun Gate (Inti Punku)", "description": "Ancient entrance with stunning sunrise views", "category": "Historical", "duration": "1-2 hours"}, {"name": "Temple of the Sun", "description": "Sacred Incan astronomical observatory", "category": "Historical", "duration": "1 hour"}]'::jsonb,
  activities = '[{"name": "Inca Trail Trek", "description": "Classic 4-day hike to Machu Picchu", "difficulty": "Challenging", "price_range": "$600-1200"}, {"name": "Sunrise at Machu Picchu", "description": "Early morning visit for magical light", "difficulty": "Easy", "price_range": "$50-80"}, {"name": "Sacred Valley Tour", "description": "Visit Ollantaytambo, Pisac, and markets", "difficulty": "Easy", "price_range": "$50-100"}, {"name": "Train Journey", "description": "Scenic Vistadome train through Andes", "difficulty": "Easy", "price_range": "$80-400"}]'::jsonb,
  local_tips = ARRAY['Book tickets months in advance - limited daily entries', 'Spend a day in Cusco first to acclimatize to altitude', 'Bring rain gear - weather changes quickly', 'Hire a guide for historical context', 'No drones or tripods allowed'],
  travel_guide = '{"visa_info": "Many nationalities don''t need visa for up to 90 days in Peru.", "getting_around": "Train from Cusco/Ollantaytambo to Aguas Calientes. Bus up to entrance.", "best_areas": [{"name": "Aguas Calientes", "description": "Gateway town at base of Machu Picchu", "vibe": "Touristy & Convenient"}, {"name": "Cusco", "description": "Historic Incan capital worth exploring", "vibe": "Colonial & Cultural"}, {"name": "Sacred Valley", "description": "Beautiful valley with Incan ruins", "vibe": "Rural & Authentic"}], "packing_essentials": ["Layered clothing", "Rain jacket", "Sun protection", "Good hiking boots", "Altitude sickness medication"], "health_safety": "Altitude sickness is real - take it slow. Drink coca tea. Buy travel insurance."}'::jsonb,
  climate = 'Two seasons: dry (May-Oct) and wet (Nov-Apr). Temperatures 10-20°C. Best time May-Sep.',
  currency = 'Peruvian Sol (PEN)',
  language = 'Spanish, Quechua',
  timezone = 'PET (UTC-5)',
  gallery = ARRAY['https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800', 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=800'],
  latitude = -13.1631,
  longitude = -72.5450
WHERE name = 'Machu Picchu';

-- Update remaining destinations with full content
UPDATE public.destinations SET
  highlights = ARRAY['Stunning harbor and Opera House', 'Beautiful beaches like Bondi', 'Vibrant arts and dining scene', 'Harbour Bridge climb experience', 'Diverse multicultural neighborhoods'],
  attractions = '[{"name": "Sydney Opera House", "description": "Iconic performing arts venue on the harbor", "category": "Landmark", "duration": "2-3 hours"}, {"name": "Sydney Harbour Bridge", "description": "Historic bridge with BridgeClimb experience", "category": "Landmark", "duration": "3-4 hours"}, {"name": "Bondi Beach", "description": "Famous golden sand beach and surf spot", "category": "Beach", "duration": "Half day"}, {"name": "Taronga Zoo", "description": "World-class zoo with harbor views", "category": "Nature", "duration": "4-5 hours"}]'::jsonb,
  activities = '[{"name": "BridgeClimb Sydney", "description": "Climb to the top of Sydney Harbour Bridge", "difficulty": "Moderate", "price_range": "$200-400"}, {"name": "Bondi to Coogee Walk", "description": "Scenic coastal walk past beaches and cliffs", "difficulty": "Easy", "price_range": "Free"}, {"name": "Harbor Cruise", "description": "Sail past Opera House and Harbour Bridge", "difficulty": "Easy", "price_range": "$40-80"}, {"name": "Surf Lesson at Bondi", "description": "Learn to surf at Australia''s most famous beach", "difficulty": "Beginner", "price_range": "$80-120"}]'::jsonb,
  local_tips = ARRAY['Opal card for public transport', 'Swim between the flags at beaches', 'Free walking tours available from Circular Quay', 'Happy hour drinks at rooftop bars', 'Visit Rocks markets on weekends'],
  travel_guide = '{"visa_info": "ETA or eVisitor visa required for most nationalities. Apply online.", "getting_around": "Ferries are scenic and practical. Trains cover suburbs. Opal card essential.", "best_areas": [{"name": "Circular Quay", "description": "Harbor front with Opera House access", "vibe": "Iconic & Touristy"}, {"name": "Surry Hills", "description": "Hip neighborhood with cafes and bars", "vibe": "Trendy & Local"}, {"name": "Bondi", "description": "Beach lifestyle and coastal living", "vibe": "Laid-back & Active"}], "packing_essentials": ["Sunscreen (Australian sun is strong)", "Swimwear", "Comfortable walking shoes", "Light layers", "Hat and sunglasses"], "health_safety": "Very safe city. Strong UV - slip, slop, slap. Tap water is excellent."}'::jsonb,
  climate = 'Mild climate year-round. Warm summers (Dec-Feb), mild winters. Avg temp 18°C.',
  currency = 'Australian Dollar (AUD)',
  language = 'English',
  timezone = 'AEST (UTC+10)',
  gallery = ARRAY['https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', 'https://images.unsplash.com/photo-1523428096881-5bd79d043006?w=800', 'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?w=800'],
  latitude = -33.8688,
  longitude = 151.2093
WHERE name = 'Sydney';

UPDATE public.destinations SET
  highlights = ARRAY['Colourful spice markets', 'Historic mosques and palaces', 'Bosphorus strait views', 'Ancient Grand Bazaar', 'Delicious Turkish cuisine'],
  attractions = '[{"name": "Hagia Sophia", "description": "Byzantine masterpiece turned mosque", "category": "Historical", "duration": "2-3 hours"}, {"name": "Blue Mosque", "description": "Stunning mosque with blue tile interior", "category": "Religious", "duration": "1-2 hours"}, {"name": "Grand Bazaar", "description": "One of world''s oldest covered markets", "category": "Shopping", "duration": "3-4 hours"}, {"name": "Topkapi Palace", "description": "Ottoman sultans'' palace with treasures", "category": "Historical", "duration": "3-4 hours"}]'::jsonb,
  activities = '[{"name": "Bosphorus Cruise", "description": "Boat trip between Europe and Asia", "difficulty": "Easy", "price_range": "$15-50"}, {"name": "Turkish Bath Experience", "description": "Traditional hammam spa treatment", "difficulty": "Easy", "price_range": "$30-80"}, {"name": "Turkish Cooking Class", "description": "Learn to make kebabs and mezes", "difficulty": "Easy", "price_range": "$60-100"}, {"name": "Hot Air Balloon Cappadocia", "description": "Day trip for sunrise balloon flight", "difficulty": "Easy", "price_range": "$200-350"}]'::jsonb,
  local_tips = ARRAY['Haggle in bazaars - it''s expected', 'Dress modestly for mosques', 'Get Istanbul Museum Pass for savings', 'Try street food - simit and doner', 'Taxi apps like BiTaksi prevent scams'],
  travel_guide = '{"visa_info": "E-visa available for most nationalities. Apply online before travel.", "getting_around": "Istanbulkart for metro, tram, ferry. Traffic terrible - avoid taxis in rush hour.", "best_areas": [{"name": "Sultanahmet", "description": "Historic center with major attractions", "vibe": "Historic & Touristy"}, {"name": "Beyoğlu", "description": "Trendy area with Istiklal Avenue", "vibe": "Vibrant & Modern"}, {"name": "Kadıköy", "description": "Asian side with local markets", "vibe": "Authentic & Foodie"}], "packing_essentials": ["Scarf for mosque visits", "Comfortable walking shoes", "Layers for weather", "Turkish lira cash", "Power adapter"], "health_safety": "Generally safe. Watch for pickpockets in tourist areas. Tap water not recommended."}'::jsonb,
  climate = 'Mediterranean climate with hot summers, cold rainy winters. Best time Apr-May and Sep-Nov. Avg temp 14°C.',
  currency = 'Turkish Lira (TRY)',
  language = 'Turkish',
  timezone = 'TRT (UTC+3)',
  gallery = ARRAY['https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800'],
  latitude = 41.0082,
  longitude = 28.9784
WHERE name = 'Istanbul';

UPDATE public.destinations SET
  highlights = ARRAY['Table Mountain views', 'Cape Point and penguins', 'World-class wine regions', 'Diverse beaches and coastline', 'Rich history and culture'],
  attractions = '[{"name": "Table Mountain", "description": "Iconic flat-topped mountain with cable car", "category": "Nature", "duration": "3-4 hours"}, {"name": "Cape Point", "description": "Dramatic cliffs where oceans meet", "category": "Nature", "duration": "Half day"}, {"name": "Robben Island", "description": "Historic prison where Mandela was held", "category": "Historical", "duration": "4 hours"}, {"name": "V&A Waterfront", "description": "Harbor with shops, restaurants, and aquarium", "category": "Shopping", "duration": "3-4 hours"}]'::jsonb,
  activities = '[{"name": "Wine Tasting in Stellenbosch", "description": "Tour Cape Winelands and sample wines", "difficulty": "Easy", "price_range": "$60-120"}, {"name": "Shark Cage Diving", "description": "Get up close with great white sharks", "difficulty": "Adventurous", "price_range": "$150-250"}, {"name": "Cape Peninsula Tour", "description": "Full day trip to Cape Point and Boulders Beach", "difficulty": "Easy", "price_range": "$80-150"}, {"name": "Paragliding from Signal Hill", "description": "Tandem flight with city and ocean views", "difficulty": "Easy", "price_range": "$80-120"}]'::jsonb,
  local_tips = ARRAY['Book Table Mountain early morning for best views', 'Uber is safe and affordable', 'Load shedding affects electricity - have backup', 'Don''t flash valuables in public', 'Cape Malay food in Bo-Kaap is excellent'],
  travel_guide = '{"visa_info": "Many nationalities get 90 days visa-free. Check requirements.", "getting_around": "Rent a car for flexibility. Uber/Bolt widely available. MyCiti bus in center.", "best_areas": [{"name": "V&A Waterfront", "description": "Safe, touristy area with harbor views", "vibe": "Safe & Upscale"}, {"name": "Sea Point", "description": "Coastal suburb with promenade", "vibe": "Residential & Active"}, {"name": "City Bowl", "description": "Central area near Table Mountain", "vibe": "Urban & Convenient"}], "packing_essentials": ["Layers (weather changes fast)", "Windbreaker", "Sun protection", "Comfortable walking shoes", "Power adapter"], "health_safety": "Be vigilant in tourist areas. Don''t walk alone at night. Tap water is safe."}'::jsonb,
  climate = 'Mediterranean climate. Warm dry summers (Nov-Mar), cool wet winters. Avg temp 17°C.',
  currency = 'South African Rand (ZAR)',
  language = 'English, Afrikaans, Xhosa',
  timezone = 'SAST (UTC+2)',
  gallery = ARRAY['https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800', 'https://images.unsplash.com/photo-1591628001888-c38e7a8e5ff2?w=800', 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=800'],
  latitude = -33.9249,
  longitude = 18.4241
WHERE name = 'Cape Town';

UPDATE public.destinations SET
  highlights = ARRAY['Ornate temples and palaces', 'Vibrant street food scene', 'Floating markets', 'Legendary nightlife', 'Affordable luxury spas'],
  attractions = '[{"name": "Grand Palace", "description": "Opulent royal residence and temple complex", "category": "Historical", "duration": "3-4 hours"}, {"name": "Wat Pho", "description": "Temple with giant reclining Buddha", "category": "Temple", "duration": "2 hours"}, {"name": "Wat Arun", "description": "Iconic riverside Temple of Dawn", "category": "Temple", "duration": "2 hours"}, {"name": "Chatuchak Weekend Market", "description": "Massive market with 15,000+ stalls", "category": "Shopping", "duration": "4-5 hours"}]'::jsonb,
  activities = '[{"name": "Street Food Tour", "description": "Sample Bangkok''s legendary street eats", "difficulty": "Easy", "price_range": "$30-60"}, {"name": "Thai Cooking Class", "description": "Learn to make pad thai and curries", "difficulty": "Easy", "price_range": "$40-80"}, {"name": "Floating Market Trip", "description": "Visit Damnoen Saduak or Amphawa markets", "difficulty": "Easy", "price_range": "$40-80"}, {"name": "Muay Thai Experience", "description": "Watch or train in Thai boxing", "difficulty": "Easy to Moderate", "price_range": "$30-100"}]'::jsonb,
  local_tips = ARRAY['Dress modestly for temples (knees and shoulders covered)', 'Use Grab app for taxis to avoid scams', 'Carry toilet paper - not always provided', 'Negotiate tuk-tuk prices before riding', 'Try khao san road for backpacker vibe'],
  travel_guide = '{"visa_info": "Many nationalities get 30-60 days visa-free on arrival.", "getting_around": "BTS Skytrain and MRT are efficient. Grab for taxis. Boats on Chao Phraya River.", "best_areas": [{"name": "Sukhumvit", "description": "Modern area with malls and nightlife", "vibe": "Trendy & Convenient"}, {"name": "Silom", "description": "Business district with rooftop bars", "vibe": "Professional & Upscale"}, {"name": "Khao San Road", "description": "Backpacker hub with budget options", "vibe": "Party & Budget"}], "packing_essentials": ["Light breathable clothing", "Modest attire for temples", "Umbrella for rainy season", "Mosquito repellent", "Sunscreen"], "health_safety": "Generally safe. Stay hydrated. Be cautious with spicy food if not used to it."}'::jsonb,
  climate = 'Tropical with hot (Mar-May), rainy (Jun-Oct), and cool (Nov-Feb) seasons. Avg temp 28°C.',
  currency = 'Thai Baht (THB)',
  language = 'Thai',
  timezone = 'ICT (UTC+7)',
  gallery = ARRAY['https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800', 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800'],
  latitude = 13.7563,
  longitude = 100.5018
WHERE name = 'Bangkok';

UPDATE public.destinations SET
  highlights = ARRAY['Gothic Quarter medieval streets', 'Gaudí architectural masterpieces', 'Beach city vibes', 'World-class tapas scene', 'Vibrant nightlife'],
  attractions = '[{"name": "La Sagrada Familia", "description": "Gaudí''s unfinished masterpiece basilica", "category": "Architecture", "duration": "2-3 hours"}, {"name": "Park Güell", "description": "Whimsical park with mosaic art", "category": "Park", "duration": "2-3 hours"}, {"name": "Gothic Quarter", "description": "Medieval maze of atmospheric streets", "category": "Neighborhood", "duration": "3-4 hours"}, {"name": "La Boqueria Market", "description": "Famous food market on La Rambla", "category": "Market", "duration": "1-2 hours"}]'::jsonb,
  activities = '[{"name": "Tapas and Wine Tour", "description": "Sample local pintxos and Catalan wines", "difficulty": "Easy", "price_range": "$50-100"}, {"name": "Flamenco Show", "description": "Experience passionate Spanish dance", "difficulty": "Easy", "price_range": "$40-80"}, {"name": "Montserrat Day Trip", "description": "Visit mountain monastery and hike", "difficulty": "Easy to Moderate", "price_range": "$50-100"}, {"name": "Sailing Trip", "description": "Mediterranean sunset sail with drinks", "difficulty": "Easy", "price_range": "$60-120"}]'::jsonb,
  local_tips = ARRAY['Book Sagrada Familia tickets online in advance', 'Watch for pickpockets on La Rambla', 'Lunch is 2-4pm, dinner after 9pm', 'Learn basic Catalan phrases - appreciated', 'Free museum days on first Sunday'],
  travel_guide = '{"visa_info": "Schengen visa rules apply. Many nationalities get 90 days visa-free.", "getting_around": "Metro is efficient. Walking is best for Barri Gòtic. T-Casual card for 10 trips.", "best_areas": [{"name": "Barri Gòtic", "description": "Medieval Gothic Quarter in old town", "vibe": "Historic & Atmospheric"}, {"name": "Gràcia", "description": "Bohemian neighborhood with plazas", "vibe": "Artsy & Local"}, {"name": "Barceloneta", "description": "Beach neighborhood with seafood", "vibe": "Beach & Relaxed"}], "packing_essentials": ["Comfortable walking shoes", "Light layers", "Sunscreen", "Anti-theft bag", "Smart casual for restaurants"], "health_safety": "Safe city but watch for pickpockets. Beaches can be crowded in summer."}'::jsonb,
  climate = 'Mediterranean climate. Hot summers, mild winters. Best time May-Jun and Sep-Oct. Avg temp 16°C.',
  currency = 'Euro (EUR)',
  language = 'Spanish, Catalan',
  timezone = 'CET (UTC+1)',
  gallery = ARRAY['https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800', 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800'],
  latitude = 41.3851,
  longitude = 2.1734
WHERE name = 'Barcelona';

UPDATE public.destinations SET
  highlights = ARRAY['Turquoise overwater bungalows', 'World-class diving and snorkeling', 'Pristine white sand beaches', 'Incredible marine life', 'Ultimate luxury resorts'],
  attractions = '[{"name": "Male Fish Market", "description": "Bustling local fish market in the capital", "category": "Cultural", "duration": "1-2 hours"}, {"name": "Maafushi Island", "description": "Budget-friendly local island experience", "category": "Beach", "duration": "Full day"}, {"name": "Hulhumalé", "description": "Modern artificial island near airport", "category": "Urban", "duration": "Half day"}, {"name": "Bioluminescent Beach", "description": "Glowing plankton on night beaches", "category": "Nature", "duration": "2-3 hours"}]'::jsonb,
  activities = '[{"name": "Scuba Diving", "description": "Explore coral reefs and swim with mantas", "difficulty": "Moderate", "price_range": "$80-150"}, {"name": "Snorkeling Safari", "description": "Island hopping with snorkel stops", "difficulty": "Easy", "price_range": "$50-100"}, {"name": "Sunset Dolphin Cruise", "description": "Watch dolphins in golden hour", "difficulty": "Easy", "price_range": "$40-80"}, {"name": "Spa Overwater Treatment", "description": "Luxury spa experience over lagoon", "difficulty": "Easy", "price_range": "$100-300"}]'::jsonb,
  local_tips = ARRAY['Alcohol only on resort islands', 'Pack reef-safe sunscreen', 'Budget travelers can stay on local islands', 'Best diving Dec-Apr', 'Friday is the holy day - limited services'],
  travel_guide = '{"visa_info": "30-day visa on arrival for most nationalities.", "getting_around": "Speedboats and seaplanes between islands. Domestic flights available.", "best_areas": [{"name": "North Malé Atoll", "description": "Closest resorts to the airport", "vibe": "Convenient & Luxurious"}, {"name": "South Ari Atoll", "description": "Best for whale shark sightings", "vibe": "Marine Life Haven"}, {"name": "Baa Atoll", "description": "UNESCO biosphere reserve", "vibe": "Eco-Conscious & Natural"}], "packing_essentials": ["Reef-safe sunscreen", "Snorkeling gear", "Light cotton clothes", "Waterproof phone case", "Underwater camera"], "health_safety": "Very safe destination. Hydrate well. Coral cuts can be serious - use water shoes."}'::jsonb,
  climate = 'Tropical climate year-round. Dry (Nov-Apr) and wet (May-Oct) seasons. Avg temp 28°C.',
  currency = 'Maldivian Rufiyaa (MVR), USD widely accepted',
  language = 'Dhivehi, English widely spoken',
  timezone = 'MVT (UTC+5)',
  gallery = ARRAY['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800', 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800'],
  latitude = 3.2028,
  longitude = 73.2207
WHERE name = 'Maldives';

UPDATE public.destinations SET
  highlights = ARRAY['Traditional ryokans and onsens', 'Zen gardens and bamboo groves', 'Geisha culture in Gion', 'Ancient temples and shrines', 'Seasonal cherry blossoms and fall colors'],
  attractions = '[{"name": "Fushimi Inari Shrine", "description": "Thousands of vermillion torii gates", "category": "Temple", "duration": "2-3 hours"}, {"name": "Kinkaku-ji", "description": "Golden Pavilion reflecting in pond", "category": "Temple", "duration": "1-2 hours"}, {"name": "Arashiyama Bamboo Grove", "description": "Towering bamboo forest pathways", "category": "Nature", "duration": "2-3 hours"}, {"name": "Gion District", "description": "Historic geisha entertainment district", "category": "Cultural", "duration": "2-3 hours"}]'::jsonb,
  activities = '[{"name": "Tea Ceremony Experience", "description": "Traditional matcha preparation ritual", "difficulty": "Easy", "price_range": "$40-80"}, {"name": "Kimono Rental", "description": "Dress in traditional attire for the day", "difficulty": "Easy", "price_range": "$50-100"}, {"name": "Zen Meditation Session", "description": "Morning meditation at a temple", "difficulty": "Easy", "price_range": "$20-50"}, {"name": "Sake Tasting in Fushimi", "description": "Sample sake at historic breweries", "difficulty": "Easy", "price_range": "$30-60"}]'::jsonb,
  local_tips = ARRAY['Many temples close by 5pm', 'Rent a bicycle to explore efficiently', 'Book popular kaiseki restaurants weeks ahead', 'Geishas don''t like having photos taken', 'Visit Fushimi Inari at dawn to avoid crowds'],
  travel_guide = '{"visa_info": "Many countries have visa-free access for 90 days.", "getting_around": "Buses and subway cover the city. Rent bikes for temples. JR Pass useful for day trips.", "best_areas": [{"name": "Gion", "description": "Traditional area with geisha culture", "vibe": "Historic & Elegant"}, {"name": "Higashiyama", "description": "Preserved streets with temples", "vibe": "Traditional & Photogenic"}, {"name": "Downtown", "description": "Central area with shops and dining", "vibe": "Modern & Convenient"}], "packing_essentials": ["Comfortable walking shoes", "Layers for temples", "Coin purse for temple donations", "Japanese phrase book", "Portable WiFi"], "health_safety": "Extremely safe. Tap water drinkable. Very clean city."}'::jsonb,
  climate = 'Four seasons with hot humid summers and cold winters. Best time Mar-May and Sep-Nov. Avg temp 15°C.',
  currency = 'Japanese Yen (JPY)',
  language = 'Japanese',
  timezone = 'JST (UTC+9)',
  gallery = ARRAY['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800'],
  latitude = 35.0116,
  longitude = 135.7681
WHERE name = 'Kyoto';

UPDATE public.destinations SET
  highlights = ARRAY['Carioca lifestyle and samba', 'Christ the Redeemer statue', 'Copacabana and Ipanema beaches', 'Sugarloaf Mountain views', 'Carnival celebrations'],
  attractions = '[{"name": "Christ the Redeemer", "description": "Iconic Art Deco statue atop Corcovado", "category": "Landmark", "duration": "3-4 hours"}, {"name": "Sugarloaf Mountain", "description": "Cable car to peak with panoramic views", "category": "Nature", "duration": "3-4 hours"}, {"name": "Copacabana Beach", "description": "Famous crescent-shaped beach", "category": "Beach", "duration": "Half day"}, {"name": "Escadaria Selarón", "description": "Colorful tile-covered stairway", "category": "Art", "duration": "1 hour"}]'::jsonb,
  activities = '[{"name": "Samba Dancing Lesson", "description": "Learn the basics of Brazilian samba", "difficulty": "Easy", "price_range": "$30-60"}, {"name": "Favela Tour", "description": "Guided tour of vibrant communities", "difficulty": "Easy", "price_range": "$40-80"}, {"name": "Hang Gliding", "description": "Tandem flight from Pedra Bonita", "difficulty": "Adventurous", "price_range": "$150-250"}, {"name": "Caipirinha Making Class", "description": "Learn Brazil''s national cocktail", "difficulty": "Easy", "price_range": "$30-50"}]'::jsonb,
  local_tips = ARRAY['Don''t take valuables to the beach', 'Use Uber rather than hailing taxis', 'Learn some Portuguese phrases', 'Visit Christ early morning or at sunset', 'Carnival tickets sell out months ahead'],
  travel_guide = '{"visa_info": "Visa-free for many nationalities for 90 days. E-visa available for others.", "getting_around": "Metro covers main areas. Uber is reliable and safe. Avoid walking at night in unfamiliar areas.", "best_areas": [{"name": "Ipanema", "description": "Upscale beach neighborhood", "vibe": "Trendy & Safe"}, {"name": "Copacabana", "description": "Classic beachfront with nightlife", "vibe": "Iconic & Vibrant"}, {"name": "Santa Teresa", "description": "Bohemian hilltop neighborhood", "vibe": "Artsy & Historic"}], "packing_essentials": ["Light summer clothes", "Swimwear", "Sunscreen", "Flip flops", "Money belt for beach"], "health_safety": "Be street-smart. Don''t flash valuables. Yellow fever vaccine recommended."}'::jsonb,
  climate = 'Tropical climate. Hot wet summer (Dec-Mar), mild dry winter (Jun-Sep). Avg temp 24°C.',
  currency = 'Brazilian Real (BRL)',
  language = 'Portuguese',
  timezone = 'BRT (UTC-3)',
  gallery = ARRAY['https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800', 'https://images.unsplash.com/photo-1544989164-31dc3c645987?w=800', 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800'],
  latitude = -22.9068,
  longitude = -43.1729
WHERE name = 'Rio de Janeiro';

UPDATE public.destinations SET
  highlights = ARRAY['Lion City skyline', 'Gardens by the Bay supertrees', 'World-class street food hawker centers', 'Sentosa Island attractions', 'Diverse cultural districts'],
  attractions = '[{"name": "Marina Bay Sands", "description": "Iconic hotel with infinity pool and SkyPark", "category": "Landmark", "duration": "3-4 hours"}, {"name": "Gardens by the Bay", "description": "Futuristic gardens with Supertree Grove", "category": "Nature", "duration": "3-4 hours"}, {"name": "Sentosa Island", "description": "Resort island with beaches and attractions", "category": "Entertainment", "duration": "Full day"}, {"name": "Chinatown", "description": "Historic district with temples and food", "category": "Cultural", "duration": "2-3 hours"}]'::jsonb,
  activities = '[{"name": "Hawker Center Food Tour", "description": "Sample Singapore''s legendary street food", "difficulty": "Easy", "price_range": "$40-80"}, {"name": "Night Safari", "description": "World''s first nocturnal wildlife park", "difficulty": "Easy", "price_range": "$40-60"}, {"name": "Marina Bay Light Show", "description": "Free nightly light and water show", "difficulty": "Easy", "price_range": "Free"}, {"name": "Universal Studios", "description": "Theme park on Sentosa Island", "difficulty": "Easy", "price_range": "$60-100"}]'::jsonb,
  local_tips = ARRAY['Chewing gum is banned - don''t bring any', 'Try chicken rice at Maxwell Food Centre', 'MRT is efficient and air-conditioned', 'No tipping required', 'Gardens by the Bay light show is free at 7:45pm and 8:45pm'],
  travel_guide = '{"visa_info": "Many nationalities get 30-90 days visa-free on arrival.", "getting_around": "MRT is excellent. Grab app for taxis. Very walkable city.", "best_areas": [{"name": "Marina Bay", "description": "Central area with iconic skyline", "vibe": "Modern & Iconic"}, {"name": "Orchard Road", "description": "Premier shopping belt", "vibe": "Upscale & Commercial"}, {"name": "Tiong Bahru", "description": "Hip neighborhood with cafes", "vibe": "Trendy & Local"}], "packing_essentials": ["Light breathable clothing", "Umbrella", "Comfortable walking shoes", "Cardigan for AC", "Sunglasses"], "health_safety": "Extremely safe, clean city. Tap water is safe. Strict laws - follow them."}'::jsonb,
  climate = 'Tropical climate year-round. Hot and humid. Frequent afternoon showers. Avg temp 27°C.',
  currency = 'Singapore Dollar (SGD)',
  language = 'English, Mandarin, Malay, Tamil',
  timezone = 'SGT (UTC+8)',
  gallery = ARRAY['https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800', 'https://images.unsplash.com/photo-1496939376851-89342e90adcd?w=800'],
  latitude = 1.3521,
  longitude = 103.8198
WHERE name = 'Singapore';

UPDATE public.destinations SET
  highlights = ARRAY['Colonial architecture', 'Halong Bay cruises', 'Ancient temples of Angkor style', 'Vibrant Old Quarter', 'Incredible pho and street food'],
  attractions = '[{"name": "Ho Chi Minh Mausoleum", "description": "Final resting place of Vietnam''s revolutionary leader", "category": "Historical", "duration": "2 hours"}, {"name": "Temple of Literature", "description": "Vietnam''s first national university from 1070", "category": "Temple", "duration": "2 hours"}, {"name": "Hoan Kiem Lake", "description": "Scenic lake in the heart of the city", "category": "Nature", "duration": "1-2 hours"}, {"name": "Old Quarter", "description": "Historic 36 streets with unique trades", "category": "Cultural", "duration": "3-4 hours"}]'::jsonb,
  activities = '[{"name": "Street Food Tour", "description": "Sample pho, bun cha, and banh mi", "difficulty": "Easy", "price_range": "$20-50"}, {"name": "Halong Bay Overnight Cruise", "description": "Sail through limestone karsts", "difficulty": "Easy", "price_range": "$100-300"}, {"name": "Cooking Class", "description": "Learn Vietnamese cuisine secrets", "difficulty": "Easy", "price_range": "$30-60"}, {"name": "Water Puppet Show", "description": "Traditional Vietnamese performance art", "difficulty": "Easy", "price_range": "$5-15"}]'::jsonb,
  local_tips = ARRAY['Look both ways constantly - traffic is chaotic', 'Bargain at markets', 'Coffee with condensed milk is a must-try', 'Grab app works for motorbike taxis', 'Try egg coffee at Cafe Giang'],
  travel_guide = '{"visa_info": "E-visa available for many nationalities. Some get visa-free for 15-30 days.", "getting_around": "Grab for taxis and motorbikes. Walking in Old Quarter. Bus for longer trips.", "best_areas": [{"name": "Old Quarter", "description": "Historic heart with street life", "vibe": "Chaotic & Authentic"}, {"name": "Hoan Kiem", "description": "Central district around the lake", "vibe": "Scenic & Central"}, {"name": "West Lake", "description": "Upscale area with expat scene", "vibe": "Quiet & Residential"}], "packing_essentials": ["Lightweight clothing", "Rain jacket", "Comfortable shoes", "Mosquito repellent", "Travel adapter"], "health_safety": "Generally safe. Watch traffic carefully. Street food is generally safe."}'::jsonb,
  climate = 'Subtropical with four seasons. Hot summers, cold winters. Best time Oct-Apr. Avg temp 24°C.',
  currency = 'Vietnamese Dong (VND)',
  language = 'Vietnamese',
  timezone = 'ICT (UTC+7)',
  gallery = ARRAY['https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800', 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'],
  latitude = 21.0285,
  longitude = 105.8542
WHERE name = 'Hanoi';

UPDATE public.destinations SET
  highlights = ARRAY['Incredible wildlife safaris', 'Great Migration spectacle', 'Maasai culture experiences', 'Stunning endless plains', 'Hot air balloon safaris'],
  attractions = '[{"name": "Serengeti National Park", "description": "Endless plains with incredible wildlife", "category": "Nature", "duration": "Multiple days"}, {"name": "Ngorongoro Crater", "description": "World''s largest intact volcanic caldera", "category": "Nature", "duration": "Full day"}, {"name": "Olduvai Gorge", "description": "Cradle of mankind archaeological site", "category": "Historical", "duration": "2-3 hours"}, {"name": "Grumeti River", "description": "Dramatic crocodile crossing point", "category": "Nature", "duration": "Half day"}]'::jsonb,
  activities = '[{"name": "Game Drive Safari", "description": "Track the Big Five in open vehicles", "difficulty": "Easy", "price_range": "$200-500 per day"}, {"name": "Hot Air Balloon Safari", "description": "Sunrise flight over the Serengeti", "difficulty": "Easy", "price_range": "$500-600"}, {"name": "Maasai Village Visit", "description": "Cultural experience with local tribe", "difficulty": "Easy", "price_range": "$30-50"}, {"name": "Walking Safari", "description": "Guided bush walk with armed rangers", "difficulty": "Moderate", "price_range": "$100-200"}]'::jsonb,
  local_tips = ARRAY['Great Migration is Jul-Oct', 'Book lodges well in advance', 'Bring binoculars and good camera', 'Neutral colors for safari clothing', 'Malaria prophylaxis is essential'],
  travel_guide = '{"visa_info": "Visa required for most nationalities. Apply online before travel.", "getting_around": "Fly into Kilimanjaro or Arusha. Internal flights between camps. 4x4 for game drives.", "best_areas": [{"name": "Central Serengeti", "description": "Year-round wildlife viewing", "vibe": "Classic Safari"}, {"name": "Northern Serengeti", "description": "Migration river crossings", "vibe": "Dramatic Wildlife"}, {"name": "Ndutu Area", "description": "Calving season location", "vibe": "Seasonal Highlights"}], "packing_essentials": ["Khaki/neutral colored clothing", "Sun hat and sunglasses", "Binoculars", "Camera with zoom lens", "Malaria medication"], "health_safety": "Yellow fever vaccine required. Take malaria precautions. Stay in vehicle during game drives."}'::jsonb,
  climate = 'Tropical. Dry seasons (Jun-Oct, Jan-Feb) best for wildlife. Avg temp 25°C.',
  currency = 'Tanzanian Shilling (TZS), USD widely accepted',
  language = 'Swahili, English',
  timezone = 'EAT (UTC+3)',
  gallery = ARRAY['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800'],
  latitude = -2.3333,
  longitude = 34.8333
WHERE name = 'Serengeti';

-- Add more destinations with complete content
UPDATE public.destinations SET
  highlights = ARRAY['World''s largest coral reef system', 'Incredible snorkeling and diving', 'Tropical island resorts', 'Unique marine biodiversity', 'Gateway to Australian tropics'],
  attractions = '[{"name": "Outer Reef", "description": "Pristine coral formations in open ocean", "category": "Nature", "duration": "Full day"}, {"name": "Whitsunday Islands", "description": "74 tropical islands with white sand beaches", "category": "Beach", "duration": "Multiple days"}, {"name": "Whitehaven Beach", "description": "Stunning 7km stretch of pure silica sand", "category": "Beach", "duration": "Half day"}, {"name": "Green Island", "description": "Rainforest-covered coral cay", "category": "Nature", "duration": "Full day"}]'::jsonb,
  activities = '[{"name": "Scuba Diving", "description": "Explore coral gardens and shipwrecks", "difficulty": "Moderate", "price_range": "$150-300"}, {"name": "Snorkeling Trip", "description": "Swim with tropical fish and turtles", "difficulty": "Easy", "price_range": "$80-150"}, {"name": "Scenic Helicopter Flight", "description": "Aerial views of reef formations", "difficulty": "Easy", "price_range": "$250-500"}, {"name": "Glass Bottom Boat Tour", "description": "View reef without getting wet", "difficulty": "Easy", "price_range": "$60-100"}]'::jsonb,
  local_tips = ARRAY['June to October has best visibility', 'Wear stinger suits during wet season', 'Reef-safe sunscreen only', 'Book outer reef trips for best coral', 'Cairns and Airlie Beach are main gateways'],
  travel_guide = '{"visa_info": "ETA or eVisitor visa required for most nationalities.", "getting_around": "Fly to Cairns, Townsville, or Hamilton Island. Boats to reef daily.", "best_areas": [{"name": "Cairns", "description": "Major gateway city to the reef", "vibe": "Tropical & Tourist-friendly"}, {"name": "Port Douglas", "description": "Upscale base near outer reef", "vibe": "Boutique & Relaxed"}, {"name": "Airlie Beach", "description": "Gateway to Whitsunday Islands", "vibe": "Backpacker & Beach"}], "packing_essentials": ["Reef-safe sunscreen", "Rash guard/stinger suit", "Underwater camera", "Sea sickness medication", "Comfortable boat shoes"], "health_safety": "Beware of stingers (jellyfish) Nov-May. Use reef-safe products. Stay hydrated."}'::jsonb,
  climate = 'Tropical climate. Dry season (May-Oct) is best for diving. Avg water temp 24-28°C.',
  currency = 'Australian Dollar (AUD)',
  language = 'English',
  timezone = 'AEST (UTC+10)',
  gallery = ARRAY['https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800', 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800', 'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=800'],
  latitude = -16.2864,
  longitude = 145.7001
WHERE name = 'Great Barrier Reef';

UPDATE public.destinations SET
  highlights = ARRAY['Iconic canal network', 'World-class museums', 'Vibrant cycling culture', 'Liberal and tolerant atmosphere', 'Historic architecture'],
  attractions = '[{"name": "Anne Frank House", "description": "Moving WWII hiding place museum", "category": "Museum", "duration": "2 hours"}, {"name": "Van Gogh Museum", "description": "World''s largest Van Gogh collection", "category": "Museum", "duration": "2-3 hours"}, {"name": "Rijksmuseum", "description": "Dutch masters and history museum", "category": "Museum", "duration": "3-4 hours"}, {"name": "Canal Ring", "description": "UNESCO World Heritage canal network", "category": "Cultural", "duration": "3-4 hours"}]'::jsonb,
  activities = '[{"name": "Canal Cruise", "description": "Sail past gabled houses and bridges", "difficulty": "Easy", "price_range": "$15-40"}, {"name": "Bicycle Tour", "description": "Experience the city like a local", "difficulty": "Easy", "price_range": "$30-50"}, {"name": "Cheese and Dutch Tasting", "description": "Sample Gouda and local treats", "difficulty": "Easy", "price_range": "$40-70"}, {"name": "Jordaan Walking Tour", "description": "Explore the bohemian neighborhood", "difficulty": "Easy", "price_range": "$20-40"}]'::jsonb,
  local_tips = ARRAY['Book Anne Frank House tickets online months ahead', 'Rent a bike to blend in with locals', 'Watch for bikes when crossing streets', 'Iamsterdam City Card saves money', 'Avoid the tourist trap pancake houses'],
  travel_guide = '{"visa_info": "Schengen visa rules apply. Many nationalities get 90 days visa-free.", "getting_around": "Walking and cycling are best. Trams cover main areas. Central Station is the hub.", "best_areas": [{"name": "Jordaan", "description": "Charming neighborhood with cafes", "vibe": "Bohemian & Romantic"}, {"name": "De Pijp", "description": "Hip area with Albert Cuyp market", "vibe": "Trendy & Multicultural"}, {"name": "Canal Ring", "description": "Historic center with canal houses", "vibe": "Classic & Scenic"}], "packing_essentials": ["Rain jacket", "Comfortable walking shoes", "Layers for weather", "Bike lock if renting", "EU power adapter"], "health_safety": "Very safe city. Watch for pickpockets near Central Station. Bike traffic can be dangerous."}'::jsonb,
  climate = 'Maritime climate with mild summers and cool winters. Rainy year-round. Avg temp 10°C.',
  currency = 'Euro (EUR)',
  language = 'Dutch, English widely spoken',
  timezone = 'CET (UTC+1)',
  gallery = ARRAY['https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800', 'https://images.unsplash.com/photo-1584003564911-a7dbb68e71a8?w=800', 'https://images.unsplash.com/photo-1576924542622-772281b13aa8?w=800'],
  latitude = 52.3676,
  longitude = 4.9041
WHERE name = 'Amsterdam';

UPDATE public.destinations SET
  highlights = ARRAY['Majestic Angkor Wat temple', 'Ancient Khmer civilization', 'Jungle-covered ruins', 'Spectacular sunrises', 'Rich Buddhist culture'],
  attractions = '[{"name": "Angkor Wat", "description": "World''s largest religious monument", "category": "Temple", "duration": "4-5 hours"}, {"name": "Bayon Temple", "description": "Mysterious smiling stone faces", "category": "Temple", "duration": "2-3 hours"}, {"name": "Ta Prohm", "description": "Jungle temple from Tomb Raider", "category": "Temple", "duration": "2 hours"}, {"name": "Angkor Thom", "description": "Ancient walled city complex", "category": "Historical", "duration": "3-4 hours"}]'::jsonb,
  activities = '[{"name": "Sunrise at Angkor Wat", "description": "Iconic dawn view of the temple", "difficulty": "Easy", "price_range": "$20-40"}, {"name": "Temple Circuit by Tuk-Tuk", "description": "Full day exploring major temples", "difficulty": "Easy", "price_range": "$15-25"}, {"name": "Floating Village Tour", "description": "Visit Tonle Sap lake communities", "difficulty": "Easy", "price_range": "$30-50"}, {"name": "Apsara Dance Show", "description": "Traditional Khmer dance with dinner", "difficulty": "Easy", "price_range": "$20-40"}]'::jsonb,
  local_tips = ARRAY['Buy multi-day temple passes', 'Hire a guide for temple history', 'Dress modestly - knees and shoulders covered', 'Bring water and sun protection', 'Visit smaller temples to escape crowds'],
  travel_guide = '{"visa_info": "E-visa or visa on arrival for most nationalities.", "getting_around": "Tuk-tuk is traditional. Rent e-bikes for independence. Taxis available.", "best_areas": [{"name": "Siem Reap Town", "description": "Main tourist hub with hotels", "vibe": "Convenient & Vibrant"}, {"name": "Pub Street Area", "description": "Nightlife and restaurant zone", "vibe": "Touristy & Lively"}, {"name": "Wat Bo", "description": "Quieter local neighborhood", "vibe": "Authentic & Peaceful"}], "packing_essentials": ["Modest temple clothing", "Comfortable walking shoes", "Sun hat and sunscreen", "Mosquito repellent", "Flashlight for dark temples"], "health_safety": "Generally safe. Watch for temple stairs. Stay hydrated. Watch for land mine awareness signs."}'::jsonb,
  climate = 'Tropical monsoon climate. Dry (Nov-Apr) and wet (May-Oct) seasons. Avg temp 28°C.',
  currency = 'US Dollar (USD) widely used, Cambodian Riel (KHR)',
  language = 'Khmer, English common in tourist areas',
  timezone = 'ICT (UTC+7)',
  gallery = ARRAY['https://images.unsplash.com/photo-1508159452718-d22d3d1a1d14?w=800', 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800', 'https://images.unsplash.com/photo-1600990205996-a4b0a7e8cc99?w=800'],
  latitude = 13.4125,
  longitude = 103.8670
WHERE name = 'Angkor Wat';

-- Set default content for any remaining destinations
UPDATE public.destinations SET
  highlights = COALESCE(highlights, ARRAY['Beautiful scenery', 'Rich culture', 'Local cuisine', 'Historic sites', 'Friendly locals']),
  attractions = COALESCE(attractions, '[{"name": "Main Attraction", "description": "Popular tourist destination", "category": "Landmark", "duration": "2-3 hours"}]'::jsonb),
  activities = COALESCE(activities, '[{"name": "Local Tour", "description": "Explore the area with a guide", "difficulty": "Easy", "price_range": "$30-60"}]'::jsonb),
  local_tips = COALESCE(local_tips, ARRAY['Respect local customs', 'Learn basic phrases', 'Stay hydrated', 'Keep valuables safe']),
  travel_guide = COALESCE(travel_guide, '{"visa_info": "Check requirements for your nationality", "getting_around": "Various transportation options available"}'::jsonb),
  latitude = COALESCE(latitude, 0),
  longitude = COALESCE(longitude, 0)
WHERE highlights IS NULL OR attractions IS NULL OR activities IS NULL;