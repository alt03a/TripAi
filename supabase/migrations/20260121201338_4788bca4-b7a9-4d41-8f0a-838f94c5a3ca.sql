-- Add new columns for enhanced destination details
ALTER TABLE destinations 
ADD COLUMN IF NOT EXISTS highlights text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS attractions jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS activities jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS local_tips text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS travel_guide jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS climate text,
ADD COLUMN IF NOT EXISTS currency text,
ADD COLUMN IF NOT EXISTS language text,
ADD COLUMN IF NOT EXISTS timezone text,
ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT '{}';

-- Update existing destinations with full features
UPDATE destinations SET
  highlights = ARRAY['Ubud Rice Terraces', 'Uluwatu Temple Sunset', 'Mount Batur Sunrise Trek', 'Tanah Lot Temple', 'Seminyak Beach Clubs'],
  attractions = '[
    {"name": "Uluwatu Temple", "description": "Ancient sea temple perched on a cliff with stunning sunset views and traditional Kecak fire dance performances.", "category": "Temple", "duration": "2-3 hours"},
    {"name": "Tegallalang Rice Terraces", "description": "Iconic rice paddies showcasing the Subak irrigation system, a UNESCO World Heritage site.", "category": "Nature", "duration": "2 hours"},
    {"name": "Sacred Monkey Forest", "description": "Ancient temple complex inhabited by hundreds of playful macaques in a lush jungle setting.", "category": "Nature", "duration": "2 hours"},
    {"name": "Tirta Empul Temple", "description": "Holy water temple where Balinese Hindus come for ritual purification in sacred spring pools.", "category": "Temple", "duration": "1-2 hours"}
  ]'::jsonb,
  activities = '[
    {"name": "Sunrise Trek at Mount Batur", "description": "Hike an active volcano to witness a breathtaking sunrise above the clouds.", "difficulty": "Moderate", "price_range": "$40-60"},
    {"name": "White Water Rafting", "description": "Navigate the Ayung River through jungle gorges and past waterfalls.", "difficulty": "Easy-Moderate", "price_range": "$30-50"},
    {"name": "Traditional Balinese Cooking Class", "description": "Learn to prepare authentic dishes at a local family compound with market visit.", "difficulty": "Easy", "price_range": "$35-55"},
    {"name": "Snorkeling at Nusa Penida", "description": "Swim with manta rays and explore colorful coral reefs.", "difficulty": "Easy", "price_range": "$60-80"}
  ]'::jsonb,
  local_tips = ARRAY[
    'Always carry small bills for temple donations and small purchases',
    'Dress modestly when visiting temples - sarongs are often provided',
    'Negotiate prices at local markets but do so respectfully',
    'Avoid touching people on the head as it is considered sacred',
    'Book sunrise treks through reputable agencies for safety'
  ],
  travel_guide = '{
    "visa_info": "Many nationalities get visa-free entry for 30 days",
    "getting_around": "Rent a scooter for flexibility or hire a private driver for day trips",
    "best_areas": [
      {"name": "Ubud", "description": "Cultural heart, art galleries, rice terraces", "vibe": "Peaceful & Spiritual"},
      {"name": "Seminyak", "description": "Upscale beach clubs, boutiques, dining", "vibe": "Trendy & Social"},
      {"name": "Canggu", "description": "Surfing, cafes, digital nomad hub", "vibe": "Laid-back & Hip"},
      {"name": "Uluwatu", "description": "Cliff-top temples, luxury resorts, surfing", "vibe": "Dramatic & Scenic"}
    ],
    "packing_essentials": ["Lightweight breathable clothing", "Reef-safe sunscreen", "Mosquito repellent", "Waterproof bag for beach days"],
    "health_safety": "Drink bottled water only, be cautious with street ice"
  }'::jsonb,
  climate = 'Tropical with dry season (April-October) and wet season (November-March)',
  currency = 'Indonesian Rupiah (IDR)',
  language = 'Indonesian, Balinese, English widely spoken',
  timezone = 'WITA (UTC+8)',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
    'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800'
  ]
WHERE name = 'Bali';

UPDATE destinations SET
  highlights = ARRAY['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree', 'Tsukiji Outer Market', 'Harajuku Fashion District'],
  attractions = '[
    {"name": "Senso-ji Temple", "description": "Tokyo oldest and most significant Buddhist temple with iconic Kaminarimon Gate.", "category": "Temple", "duration": "2 hours"},
    {"name": "Tokyo Skytree", "description": "634m broadcasting tower with observation decks offering panoramic city views.", "category": "Landmark", "duration": "2-3 hours"},
    {"name": "Meiji Shrine", "description": "Serene Shinto shrine surrounded by a forest in the heart of the city.", "category": "Temple", "duration": "1-2 hours"},
    {"name": "teamLab Borderless", "description": "Immersive digital art museum with interactive installations.", "category": "Museum", "duration": "3-4 hours"}
  ]'::jsonb,
  activities = '[
    {"name": "Sushi-Making Class", "description": "Learn the art of making sushi from a professional chef at Tsukiji.", "difficulty": "Easy", "price_range": "$80-120"},
    {"name": "Sumo Morning Practice", "description": "Watch sumo wrestlers train at a traditional stable.", "difficulty": "Easy", "price_range": "$0-20"},
    {"name": "Day Trip to Mount Fuji", "description": "Visit the iconic mountain and surrounding lakes for spectacular views.", "difficulty": "Easy", "price_range": "$100-150"},
    {"name": "Robot Restaurant Show", "description": "Experience Tokyo wild side with this neon-lit robot cabaret.", "difficulty": "Easy", "price_range": "$80-100"}
  ]'::jsonb,
  local_tips = ARRAY[
    'Get a Suica or Pasmo card for easy public transport',
    'Tipping is not customary and can be considered rude',
    'Many restaurants have plastic food displays - point to order',
    'Cash is still king - many places do not accept cards',
    'Learn basic Japanese phrases - locals appreciate the effort'
  ],
  travel_guide = '{
    "visa_info": "Many Western countries can enter visa-free for 90 days",
    "getting_around": "JR Rail Pass is excellent value for tourists exploring beyond Tokyo",
    "best_areas": [
      {"name": "Shinjuku", "description": "Skyscrapers, nightlife, entertainment hub", "vibe": "Electric & Bustling"},
      {"name": "Shibuya", "description": "Youth culture, shopping, famous crossing", "vibe": "Trendy & Energetic"},
      {"name": "Asakusa", "description": "Traditional temples, old Tokyo charm", "vibe": "Historic & Cultural"},
      {"name": "Harajuku", "description": "Fashion district, quirky cafes, street style", "vibe": "Creative & Colorful"}
    ],
    "packing_essentials": ["Comfortable walking shoes", "Pocket WiFi or SIM card", "Small towel (for onsen)", "Collapsible umbrella"],
    "health_safety": "One of the safest cities in the world, tap water is drinkable"
  }'::jsonb,
  climate = 'Humid subtropical with hot summers and mild winters',
  currency = 'Japanese Yen (JPY)',
  language = 'Japanese, limited English in tourist areas',
  timezone = 'JST (UTC+9)',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800',
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800'
  ]
WHERE name = 'Tokyo';

UPDATE destinations SET
  highlights = ARRAY['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Champs-Élysées', 'Montmartre'],
  attractions = '[
    {"name": "Eiffel Tower", "description": "The iconic iron lattice tower offering stunning views of Paris from three observation levels.", "category": "Landmark", "duration": "2-3 hours"},
    {"name": "Louvre Museum", "description": "World largest art museum, home to the Mona Lisa and thousands of masterpieces.", "category": "Museum", "duration": "4-6 hours"},
    {"name": "Palace of Versailles", "description": "Opulent royal residence with stunning gardens and the Hall of Mirrors.", "category": "Palace", "duration": "Half day"},
    {"name": "Arc de Triomphe", "description": "Monumental arch with panoramic rooftop views of the city grand boulevards.", "category": "Landmark", "duration": "1 hour"}
  ]'::jsonb,
  activities = '[
    {"name": "Seine River Cruise", "description": "Glide past illuminated monuments on an evening dinner cruise.", "difficulty": "Easy", "price_range": "$60-150"},
    {"name": "French Pastry Class", "description": "Master croissants and macarons with a Parisian chef.", "difficulty": "Moderate", "price_range": "$100-180"},
    {"name": "Wine Tasting in Le Marais", "description": "Sample French wines in historic cellars with expert sommeliers.", "difficulty": "Easy", "price_range": "$50-80"},
    {"name": "Bike Tour of Hidden Paris", "description": "Discover secret passages and local neighborhoods by bicycle.", "difficulty": "Easy", "price_range": "$40-60"}
  ]'::jsonb,
  local_tips = ARRAY[
    'Learn basic French greetings - always say Bonjour when entering shops',
    'Most museums are free on the first Sunday of each month',
    'Book Eiffel Tower tickets online to skip long queues',
    'Metro is the fastest way around - get a carnet of 10 tickets',
    'Dinner is typically served after 8pm - restaurants open late'
  ],
  travel_guide = '{
    "visa_info": "Schengen visa for most non-EU travelers, 90 days visa-free for many",
    "getting_around": "Metro and bus network is excellent, consider Paris Visite pass",
    "best_areas": [
      {"name": "Le Marais", "description": "Historic Jewish quarter, trendy boutiques, cafes", "vibe": "Bohemian & Chic"},
      {"name": "Saint-Germain", "description": "Literary cafes, art galleries, elegant shops", "vibe": "Intellectual & Refined"},
      {"name": "Montmartre", "description": "Artistic village, Sacré-Cœur, street artists", "vibe": "Romantic & Artistic"},
      {"name": "Latin Quarter", "description": "Student area, bookshops, affordable dining", "vibe": "Young & Vibrant"}
    ],
    "packing_essentials": ["Stylish but comfortable shoes", "Light scarf", "Reusable water bottle", "Universal adapter"],
    "health_safety": "Safe city but watch for pickpockets in tourist areas"
  }'::jsonb,
  climate = 'Oceanic with mild, damp winters and warm summers',
  currency = 'Euro (EUR)',
  language = 'French, English in tourist areas',
  timezone = 'CET (UTC+1)',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=800',
    'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800'
  ]
WHERE name = 'Paris';

-- Update more destinations with rich content
UPDATE destinations SET
  highlights = ARRAY['Oia Sunset Views', 'Red Beach', 'Akrotiri Archaeological Site', 'Wine Tasting Tours', 'Caldera Sailing'],
  attractions = '[
    {"name": "Oia Village", "description": "Famous for its whitewashed buildings and the most photographed sunset in the world.", "category": "Village", "duration": "3-4 hours"},
    {"name": "Akrotiri Archaeological Site", "description": "Ancient Minoan city preserved under volcanic ash, the Pompeii of Greece.", "category": "Historical", "duration": "2 hours"},
    {"name": "Red Beach", "description": "Unique beach with dramatic red volcanic cliffs and clear waters.", "category": "Beach", "duration": "2-3 hours"},
    {"name": "Ancient Thera", "description": "Ruins of an ancient city on a mountain ridge with panoramic views.", "category": "Historical", "duration": "2-3 hours"}
  ]'::jsonb,
  activities = '[
    {"name": "Catamaran Sunset Cruise", "description": "Sail around the caldera, swim in hot springs, and watch the sunset.", "difficulty": "Easy", "price_range": "$100-180"},
    {"name": "Wine Tasting Tour", "description": "Sample unique Assyrtiko wines at traditional wineries.", "difficulty": "Easy", "price_range": "$60-100"},
    {"name": "Volcano Hiking", "description": "Walk on the active volcano crater and soak in hot springs.", "difficulty": "Moderate", "price_range": "$40-60"},
    {"name": "Cooking Class with Local Chef", "description": "Learn to prepare traditional Greek dishes with local ingredients.", "difficulty": "Easy", "price_range": "$80-120"}
  ]'::jsonb,
  local_tips = ARRAY[
    'Book sunset dinner reservations weeks in advance for Oia',
    'Rent an ATV to explore the island - roads are narrow for cars',
    'Visit beaches early morning to avoid crowds and heat',
    'Wear comfortable shoes - many staircases throughout villages',
    'Ferry from Athens takes 5-8 hours, consider flying instead'
  ],
  travel_guide = '{
    "visa_info": "Schengen area - 90 day visa-free for most nationalities",
    "getting_around": "Rent ATV or car, buses available but infrequent",
    "best_areas": [
      {"name": "Oia", "description": "Iconic sunsets, luxury hotels, art galleries", "vibe": "Romantic & Upscale"},
      {"name": "Fira", "description": "Main town, nightlife, shopping, caldera views", "vibe": "Lively & Central"},
      {"name": "Imerovigli", "description": "Highest point, quiet luxury, best caldera views", "vibe": "Peaceful & Exclusive"},
      {"name": "Perissa", "description": "Black sand beach, budget-friendly, water sports", "vibe": "Relaxed & Casual"}
    ],
    "packing_essentials": ["Sunscreen SPF50+", "Comfortable sandals", "White or light clothing", "Camera for sunset shots"],
    "health_safety": "Very safe, pharmacies available in main towns"
  }'::jsonb,
  climate = 'Mediterranean with hot, dry summers and mild winters',
  currency = 'Euro (EUR)',
  language = 'Greek, English widely spoken',
  timezone = 'EET (UTC+2)',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
    'https://images.unsplash.com/photo-1507501336603-6e31db2be093?w=800'
  ]
WHERE name = 'Santorini';

UPDATE destinations SET
  highlights = ARRAY['Statue of Liberty', 'Central Park', 'Empire State Building', 'Times Square', 'Brooklyn Bridge'],
  attractions = '[
    {"name": "Statue of Liberty & Ellis Island", "description": "Iconic symbol of freedom with museum exploring immigration history.", "category": "Landmark", "duration": "4-5 hours"},
    {"name": "Metropolitan Museum of Art", "description": "World-class art museum with 2 million works spanning 5,000 years.", "category": "Museum", "duration": "4-6 hours"},
    {"name": "Central Park", "description": "843-acre urban oasis with gardens, lakes, and iconic landmarks.", "category": "Park", "duration": "3-4 hours"},
    {"name": "Top of the Rock", "description": "Observation deck offering unobstructed views of the Manhattan skyline.", "category": "Landmark", "duration": "1-2 hours"}
  ]'::jsonb,
  activities = '[
    {"name": "Broadway Show", "description": "Experience world-class theater in the heart of Times Square.", "difficulty": "Easy", "price_range": "$80-300"},
    {"name": "Food Tour of Little Italy & Chinatown", "description": "Taste authentic cuisines while learning neighborhood history.", "difficulty": "Easy", "price_range": "$60-90"},
    {"name": "Helicopter Tour", "description": "See Manhattan stunning skyline from above.", "difficulty": "Easy", "price_range": "$200-350"},
    {"name": "Jazz Night in Harlem", "description": "Experience live jazz at historic clubs where legends performed.", "difficulty": "Easy", "price_range": "$30-80"}
  ]'::jsonb,
  local_tips = ARRAY[
    'Walk - it is often faster than taxi in Manhattan traffic',
    'Get a MetroCard for unlimited subway and bus rides',
    'Many museums have pay-what-you-wish hours',
    'Make restaurant reservations, especially for trendy spots',
    'Times Square is best experienced once, then avoided'
  ],
  travel_guide = '{
    "visa_info": "ESTA required for Visa Waiver Program countries, otherwise B1/B2 visa",
    "getting_around": "Subway is 24/7 and covers most areas, Uber/Lyft widely available",
    "best_areas": [
      {"name": "Manhattan", "description": "Iconic sights, Broadway, world-class dining", "vibe": "Electric & Fast-paced"},
      {"name": "Brooklyn", "description": "Hip neighborhoods, artisanal food, waterfront views", "vibe": "Trendy & Creative"},
      {"name": "Greenwich Village", "description": "Historic charm, jazz clubs, NYU area", "vibe": "Bohemian & Artistic"},
      {"name": "Upper East Side", "description": "Museum Mile, elegant architecture, upscale", "vibe": "Refined & Cultural"}
    ],
    "packing_essentials": ["Comfortable walking shoes", "Layers for AC indoors", "Subway map app", "Portable phone charger"],
    "health_safety": "Generally safe, be aware in subway late at night"
  }'::jsonb,
  climate = 'Humid subtropical with hot summers and cold, snowy winters',
  currency = 'US Dollar (USD)',
  language = 'English, Spanish widely spoken',
  timezone = 'EST (UTC-5)',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800',
    'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800',
    'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800'
  ]
WHERE name = 'New York City';

-- Update remaining destinations with full features
UPDATE destinations SET
  highlights = ARRAY['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Desert Safari', 'Dubai Marina'],
  attractions = '[
    {"name": "Burj Khalifa", "description": "World tallest building with observation decks on floors 124, 125, and 148.", "category": "Landmark", "duration": "2-3 hours"},
    {"name": "Dubai Mall", "description": "One of the world largest malls with aquarium, ice rink, and fountains.", "category": "Shopping", "duration": "4-6 hours"},
    {"name": "Palm Jumeirah", "description": "Man-made island featuring luxury resorts and Atlantis The Palm.", "category": "Island", "duration": "Half day"},
    {"name": "Dubai Frame", "description": "Picture frame-shaped building with views of old and new Dubai.", "category": "Landmark", "duration": "1-2 hours"}
  ]'::jsonb,
  activities = '[
    {"name": "Desert Safari with BBQ Dinner", "description": "Dune bashing, camel rides, and traditional entertainment under the stars.", "difficulty": "Easy", "price_range": "$60-120"},
    {"name": "Dhow Cruise", "description": "Traditional wooden boat dinner cruise along Dubai Creek or Marina.", "difficulty": "Easy", "price_range": "$50-90"},
    {"name": "Skydiving over Palm Jumeirah", "description": "Tandem jump with views of the iconic palm-shaped island.", "difficulty": "Moderate", "price_range": "$500-700"},
    {"name": "Hot Air Balloon Ride", "description": "Sunrise flight over the desert with falconry experience.", "difficulty": "Easy", "price_range": "$300-400"}
  ]'::jsonb,
  local_tips = ARRAY[
    'Dress modestly in public areas, especially malls and markets',
    'Friday is the holy day - some businesses close or have limited hours',
    'Alcohol is only served in licensed hotels and restaurants',
    'Metro is cheap and efficient for getting around main areas',
    'Best time to visit outdoor attractions is early morning or after sunset'
  ],
  travel_guide = '{
    "visa_info": "Visa on arrival for many nationalities for 30-90 days",
    "getting_around": "Metro covers main tourist areas, Uber and taxis widely available",
    "best_areas": [
      {"name": "Downtown Dubai", "description": "Burj Khalifa, Dubai Mall, Dubai Fountain", "vibe": "Iconic & Modern"},
      {"name": "Dubai Marina", "description": "Waterfront dining, nightlife, beach access", "vibe": "Trendy & Social"},
      {"name": "Old Dubai (Deira/Bur Dubai)", "description": "Traditional souks, creek, cultural sites", "vibe": "Historic & Authentic"},
      {"name": "JBR (Jumeirah Beach Residence)", "description": "Beachfront promenade, family-friendly", "vibe": "Relaxed & Coastal"}
    ],
    "packing_essentials": ["Modest clothing", "Strong sunscreen", "Sunglasses", "Light layers for AC indoors"],
    "health_safety": "Very safe city with low crime rates"
  }'::jsonb,
  climate = 'Hot desert climate with very hot summers (40°C+) and mild winters',
  currency = 'UAE Dirham (AED)',
  language = 'Arabic, English widely spoken',
  timezone = 'GST (UTC+4)',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
    'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800',
    'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800'
  ]
WHERE name = 'Dubai';

-- Update more destinations
UPDATE destinations SET
  highlights = ARRAY['Colosseum', 'Vatican City', 'Trevi Fountain', 'Pantheon', 'Roman Forum'],
  attractions = '[
    {"name": "Colosseum", "description": "Ancient amphitheater that once hosted gladiatorial contests for 80,000 spectators.", "category": "Historical", "duration": "2-3 hours"},
    {"name": "Vatican Museums & Sistine Chapel", "description": "Treasure trove of art including Michelangelo famous ceiling frescoes.", "category": "Museum", "duration": "4-5 hours"},
    {"name": "St. Peter Basilica", "description": "World largest church with Michelangelo Pieta and stunning architecture.", "category": "Religious", "duration": "2 hours"},
    {"name": "Trevi Fountain", "description": "Baroque masterpiece where visitors throw coins to ensure return to Rome.", "category": "Landmark", "duration": "30 minutes"}
  ]'::jsonb,
  activities = '[
    {"name": "Pasta Making Class", "description": "Learn to make fresh pasta from scratch with a Roman nonna.", "difficulty": "Easy", "price_range": "$70-120"},
    {"name": "Underground Rome Tour", "description": "Explore ancient catacombs and hidden archaeological sites.", "difficulty": "Easy", "price_range": "$50-80"},
    {"name": "Vespa Tour", "description": "Zip through Rome historic streets on an iconic Italian scooter.", "difficulty": "Moderate", "price_range": "$100-150"},
    {"name": "Wine Tasting in Trastevere", "description": "Sample regional wines in Rome charming bohemian neighborhood.", "difficulty": "Easy", "price_range": "$40-70"}
  ]'::jsonb,
  local_tips = ARRAY[
    'Book Vatican and Colosseum tickets online to skip 2+ hour queues',
    'Cover shoulders and knees when entering churches',
    'Avoid eating near major tourist sites - walk a few blocks for better value',
    'Aperitivo hour (6-8pm) often includes free buffet with drinks',
    'Water from public fountains (nasoni) is safe and refreshing'
  ],
  travel_guide = '{
    "visa_info": "Schengen area - 90 day visa-free for most nationalities",
    "getting_around": "Historic center is walkable, metro for longer distances",
    "best_areas": [
      {"name": "Centro Storico", "description": "Historic center with Pantheon, Piazza Navona", "vibe": "Classic & Touristic"},
      {"name": "Trastevere", "description": "Cobblestone streets, trattorias, nightlife", "vibe": "Bohemian & Local"},
      {"name": "Testaccio", "description": "Authentic food scene, locals neighborhood", "vibe": "Foodie & Authentic"},
      {"name": "Monti", "description": "Hip boutiques, vintage shops, aperitivo spots", "vibe": "Trendy & Artsy"}
    ],
    "packing_essentials": ["Comfortable walking shoes", "Modest clothing for churches", "Power adapter", "Refillable water bottle"],
    "health_safety": "Watch for pickpockets around tourist sites and on transit"
  }'::jsonb,
  climate = 'Mediterranean with hot, dry summers and mild, wet winters',
  currency = 'Euro (EUR)',
  language = 'Italian, English in tourist areas',
  timezone = 'CET (UTC+1)',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=800',
    'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800',
    'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800'
  ]
WHERE name = 'Rome';

-- Update Machu Picchu
UPDATE destinations SET
  highlights = ARRAY['Intihuatana Stone', 'Temple of the Sun', 'Huayna Picchu Hike', 'Inca Trail', 'Sacred Valley'],
  attractions = '[
    {"name": "Machu Picchu Citadel", "description": "15th-century Inca citadel perched high in the Andes mountains.", "category": "Historical", "duration": "4-6 hours"},
    {"name": "Huayna Picchu", "description": "Steep mountain hike offering bird eye views of the ruins.", "category": "Hiking", "duration": "2-3 hours"},
    {"name": "Sun Gate (Inti Punku)", "description": "Ancient entrance used by Inca Trail hikers with panoramic views.", "category": "Historical", "duration": "2-3 hours"},
    {"name": "Sacred Valley", "description": "Ancient Inca heartland with terraces, markets, and ruins.", "category": "Nature", "duration": "Full day"}
  ]'::jsonb,
  activities = '[
    {"name": "Classic Inca Trail (4 days)", "description": "Trek the ancient path through cloud forests to the Sun Gate.", "difficulty": "Challenging", "price_range": "$600-1000"},
    {"name": "Sunrise at Machu Picchu", "description": "Be among the first to enter and watch mist lift from the ruins.", "difficulty": "Easy", "price_range": "$50-80"},
    {"name": "Moray & Salt Mines Tour", "description": "Visit ancient agricultural terraces and centuries-old salt pools.", "difficulty": "Easy", "price_range": "$40-60"},
    {"name": "Rainbow Mountain Hike", "description": "Trek to the colorful Vinicunca mountain at 5,200m elevation.", "difficulty": "Challenging", "price_range": "$80-150"}
  ]'::jsonb,
  local_tips = ARRAY[
    'Book entry tickets and Huayna Picchu permits months in advance',
    'Acclimatize in Cusco for 2-3 days before high-altitude activities',
    'Bring layers - weather changes rapidly in the mountains',
    'Hire a guide to fully understand the historical significance',
    'Take the early bus from Aguas Calientes to avoid crowds'
  ],
  travel_guide = '{
    "visa_info": "Most nationalities get 90 days visa-free on arrival",
    "getting_around": "Train from Cusco to Aguas Calientes, then bus to site",
    "best_areas": [
      {"name": "Cusco", "description": "Historic Inca capital, colonial architecture, base for trips", "vibe": "Historic & Vibrant"},
      {"name": "Aguas Calientes", "description": "Gateway town, hot springs, Machu Picchu access", "vibe": "Tourist & Convenient"},
      {"name": "Sacred Valley", "description": "Lower altitude, Inca ruins, traditional markets", "vibe": "Rural & Authentic"},
      {"name": "Ollantaytambo", "description": "Living Inca town, impressive fortress, train station", "vibe": "Ancient & Charming"}
    ],
    "packing_essentials": ["Rain jacket", "Altitude sickness medication", "Hiking boots", "Sun protection", "Layers for changing weather"],
    "health_safety": "Take altitude seriously - drink coca tea and acclimatize properly"
  }'::jsonb,
  climate = 'Subtropical highland with dry season (May-October) and wet season (November-April)',
  currency = 'Peruvian Sol (PEN)',
  language = 'Spanish, Quechua, English at tourist sites',
  timezone = 'PET (UTC-5)',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
    'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=800',
    'https://images.unsplash.com/photo-1415889455891-23bbfcef5fc0?w=800'
  ]
WHERE name = 'Machu Picchu';

-- Update more destinations with default values for those without full data
UPDATE destinations SET
  highlights = CASE 
    WHEN highlights IS NULL OR highlights = '{}' THEN ARRAY['Iconic Landmarks', 'Local Cuisine', 'Cultural Sites', 'Nature Spots', 'Shopping Districts']
    ELSE highlights
  END,
  climate = COALESCE(climate, 'Varies by season - check before traveling'),
  currency = COALESCE(currency, 'Local currency - check exchange rates'),
  language = COALESCE(language, 'Local language with English in tourist areas'),
  timezone = COALESCE(timezone, 'Check local timezone before travel')
WHERE highlights IS NULL OR highlights = '{}';