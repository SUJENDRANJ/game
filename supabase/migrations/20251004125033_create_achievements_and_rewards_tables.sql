/*
  # Create Achievements and Rewards Tables

  ## Overview
  This migration creates the database schema for a dynamic gamification system where admins
  can create achievements and rewards that are visible to all users in real-time.

  ## New Tables

  ### `achievements`
  Stores achievement definitions that users can unlock
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Achievement name
  - `description` (text) - What the achievement is for
  - `icon` (text) - Icon identifier
  - `points_reward` (integer) - Points awarded when unlocked
  - `category` (text) - Category: milestone, social, performance, special
  - `rarity` (text) - Rarity level: common, rare, epic, legendary
  - `created_at` (timestamptz) - When achievement was created
  - `created_by` (uuid) - Admin who created it

  ### `rewards`
  Stores reward items that users can purchase with points
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Reward name
  - `description` (text) - What the reward is
  - `points_cost` (integer) - Points required to redeem
  - `category` (text) - Category: time_off, perks, swag, experiences
  - `image_url` (text, optional) - Image for the reward
  - `stock_quantity` (integer, optional) - Available quantity
  - `is_active` (boolean) - Whether reward is available
  - `created_at` (timestamptz) - When reward was created
  - `created_by` (uuid) - Admin who created it

  ### `user_achievements`
  Tracks which users have unlocked which achievements
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - Reference to auth.users
  - `achievement_id` (uuid) - Reference to achievements
  - `unlocked_at` (timestamptz) - When unlocked
  - `awarded_by` (uuid, optional) - Admin who awarded it

  ### `reward_redemptions`
  Tracks reward redemptions by users
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - Reference to auth.users
  - `reward_id` (uuid) - Reference to rewards
  - `points_spent` (integer) - Points used
  - `status` (text) - Status: pending, approved, fulfilled, rejected
  - `redeemed_at` (timestamptz) - When redeemed
  - `fulfilled_at` (timestamptz, optional) - When fulfilled
  - `fulfilled_by` (uuid, optional) - Admin who fulfilled it
  - `notes` (text, optional) - Admin notes

  ## Security
  - Enable RLS on all tables
  - All users can read achievements and rewards
  - Only admins can create/update achievements and rewards
  - Users can read their own achievement unlocks and redemptions
  - Admins can manage all data

  ## Indexes
  - Index on user_id for user_achievements and reward_redemptions for fast user queries
  - Index on achievement_id and reward_id for filtering
*/

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'star',
  points_reward integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'milestone',
  rarity text NOT NULL DEFAULT 'common',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  points_cost integer NOT NULL,
  category text NOT NULL DEFAULT 'perks',
  image_url text,
  stock_quantity integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  awarded_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id, achievement_id)
);

-- Create reward_redemptions table
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  points_spent integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  redeemed_at timestamptz DEFAULT now(),
  fulfilled_at timestamptz,
  fulfilled_by uuid REFERENCES auth.users(id),
  notes text
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_user_id ON reward_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_reward_id ON reward_redemptions(reward_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_status ON reward_redemptions(status);

-- Enable Row Level Security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements table
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can update achievements"
  ON achievements FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can delete achievements"
  ON achievements FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for rewards table
CREATE POLICY "Anyone can view active rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  ));

CREATE POLICY "Admins can create rewards"
  ON rewards FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can update rewards"
  ON rewards FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can delete rewards"
  ON rewards FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for user_achievements table
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can award achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can delete achievement awards"
  ON user_achievements FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for reward_redemptions table
CREATE POLICY "Users can view their own redemptions"
  ON reward_redemptions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can create redemptions"
  ON reward_redemptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update redemptions"
  ON reward_redemptions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );