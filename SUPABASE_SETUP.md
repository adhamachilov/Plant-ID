# Supabase Setup Guide for Plant-ID Project

This guide walks you through setting up your Supabase project and database tables for the Plant-ID application. This design is focused on a simple plant database with like functionality, without requiring user registration or login.

## Step 1: Create a Supabase Account and Project

1. Visit [https://supabase.com](https://supabase.com) and sign up for an account
2. Create a new project, give it a name like "plant-id"
3. Note your project URL and anon key (public API key)
4. Create a `.env` file in the project root (copy from `.env.example`) and add these values:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 2: Set Up Database Tables

Execute the following SQL statements in the Supabase SQL Editor to create the necessary tables:

```sql
-- Plants table
CREATE TABLE IF NOT EXISTS plants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  watering_needs TEXT DEFAULT 'medium',
  sunlight TEXT DEFAULT 'medium',
  temperature TEXT DEFAULT '65-75°F',
  description TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Care Instructions table (one-to-one with plants)
CREATE TABLE IF NOT EXISTS plant_care_instructions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id TEXT REFERENCES plants(id) ON DELETE CASCADE,
  watering TEXT,
  light TEXT,
  soil TEXT,
  humidity TEXT,
  fertilizing TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_plant_care UNIQUE (plant_id)
);

-- Plant facts (one-to-many with plants)
CREATE TABLE IF NOT EXISTS plant_facts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id TEXT REFERENCES plants(id) ON DELETE CASCADE,
  fact TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plant likes tracking (for anonymous like feature)
CREATE TABLE IF NOT EXISTS plant_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id TEXT REFERENCES plants(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL, -- Use a UUID generated on the client to track unique devices
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_device_plant_like UNIQUE (device_id, plant_id)
);

-- Identification history
CREATE TABLE IF NOT EXISTS identification_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  identified_plant_id TEXT REFERENCES plants(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Helper functions for atomic like/unlike operations
CREATE OR REPLACE FUNCTION increment_likes(row_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE plants SET likes_count = likes_count + 1 WHERE id = row_id RETURNING likes_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes(row_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE plants SET likes_count = GREATEST(0, likes_count - 1) WHERE id = row_id RETURNING likes_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;
```

## Step 3: Storage Setup

1. In the Supabase dashboard, go to Storage
2. Create two public buckets:
   - `plant-images` - for reference images of plants
   - `user-uploads` - for user-uploaded images for identification

## Step 4: Update Your Application

1. Make sure you've created the `.env` file with your credentials
2. In your main App component, import the supabase client
3. Replace imports from `plantServiceUpdated.ts` with imports from `supabasePlantService.ts`
4. Generate a device ID on first app load and save it to localStorage to track likes

## Step 5: Test Your Setup

After completing these steps, your application should be connected to Supabase for data storage and retrieval. Plants will be automatically added to the database when analyzed, and users can like plants without having to create an account.
