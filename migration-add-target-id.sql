-- Migration: Update comments table to support Phase 2 commenting
-- Run this in your Supabase SQL editor

-- Step 1: Rename component_id to target_id if it exists, otherwise add target_id
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'comments' 
        AND column_name = 'component_id'
    ) THEN
        -- Rename existing column
        ALTER TABLE comments RENAME COLUMN component_id TO target_id;
    ELSIF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'comments' 
        AND column_name = 'target_id'
    ) THEN
        -- Add new column
        ALTER TABLE comments ADD COLUMN target_id TEXT;
    END IF;
END $$;

-- Step 2: Add x_pct column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'comments' 
        AND column_name = 'x_pct'
    ) THEN
        ALTER TABLE comments ADD COLUMN x_pct NUMERIC;
    END IF;
END $$;

-- Step 3: Add y_pct column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'comments' 
        AND column_name = 'y_pct'
    ) THEN
        ALTER TABLE comments ADD COLUMN y_pct NUMERIC;
    END IF;
END $$;

-- Step 4: Make author_email nullable if it's currently NOT NULL
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'comments' 
        AND column_name = 'author_email'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE comments ALTER COLUMN author_email DROP NOT NULL;
    END IF;
END $$;

