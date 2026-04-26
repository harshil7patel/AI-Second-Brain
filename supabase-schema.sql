-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Notes table
CREATE TABLE notes (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL DEFAULT 'Untitled Note',
  content     TEXT NOT NULL DEFAULT '',
  tags        TEXT[] DEFAULT '{}',
  is_pinned   BOOLEAN DEFAULT false,
  word_count  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notes_user_id   ON notes(user_id);
CREATE INDEX idx_notes_updated   ON notes(updated_at DESC);
CREATE INDEX idx_notes_is_pinned ON notes(is_pinned);

-- Full text search index
CREATE INDEX idx_notes_fts ON notes
  USING GIN(to_tsvector('english', title || ' ' || content));

-- Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
  ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
