-- Create users table (if not using Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pitch_decks table
CREATE TABLE pitch_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(255) NOT NULL,
  target_audience VARCHAR(255) NOT NULL,
  funding_goal DECIMAL(15, 2),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create slides table
CREATE TABLE slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_deck_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  slide_type VARCHAR(100) NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (pitch_deck_id) REFERENCES pitch_decks(id) ON DELETE CASCADE
);

-- Create slide_versions table for version control
CREATE TABLE slide_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slide_id UUID NOT NULL,
  content JSONB NOT NULL,
  version_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (slide_id) REFERENCES slides(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_pitch_decks_user_id ON pitch_decks(user_id);
CREATE INDEX idx_slides_pitch_deck_id ON slides(pitch_deck_id);
CREATE INDEX idx_slides_position ON slides(position);
CREATE INDEX idx_slide_versions_slide_id ON slide_versions(slide_id);

-- Enable Row Level Security
ALTER TABLE pitch_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE slide_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own pitch decks" ON pitch_decks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pitch decks" ON pitch_decks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pitch decks" ON pitch_decks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pitch decks" ON pitch_decks
  FOR DELETE USING (auth.uid() = user_id);

-- Slides policies
CREATE POLICY "Users can view slides of their pitch decks" ON slides
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pitch_decks
      WHERE pitch_decks.id = slides.pitch_deck_id
      AND pitch_decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert slides to their pitch decks" ON slides
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pitch_decks
      WHERE pitch_decks.id = slides.pitch_deck_id
      AND pitch_decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update slides of their pitch decks" ON slides
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pitch_decks
      WHERE pitch_decks.id = slides.pitch_deck_id
      AND pitch_decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete slides of their pitch decks" ON slides
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM pitch_decks
      WHERE pitch_decks.id = slides.pitch_deck_id
      AND pitch_decks.user_id = auth.uid()
    )
  );

-- Slide versions policies
CREATE POLICY "Users can view slide versions of their slides" ON slide_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM slides
      JOIN pitch_decks ON pitch_decks.id = slides.pitch_deck_id
      WHERE slides.id = slide_versions.slide_id
      AND pitch_decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert slide versions to their slides" ON slide_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM slides
      JOIN pitch_decks ON pitch_decks.id = slides.pitch_deck_id
      WHERE slides.id = slide_versions.slide_id
      AND pitch_decks.user_id = auth.uid()
    )
  );