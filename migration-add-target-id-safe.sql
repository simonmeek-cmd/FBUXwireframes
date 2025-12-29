-- ============================================
-- SAFE MIGRATION: Update comments table
-- This script is idempotent - safe to run multiple times
-- ============================================

-- First, let's check what columns currently exist
-- (This is just for your reference - you can run this separately)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;

-- ============================================
-- STEP 1: Handle target_id column
-- ============================================
-- If component_id exists, rename it to target_id
-- If neither exists, add target_id
DO $$ 
BEGIN
    -- Check if component_id exists and rename it
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'comments' 
        AND column_name = 'component_id'
    ) THEN
        RAISE NOTICE 'Renaming component_id to target_id...';
        ALTER TABLE comments RENAME COLUMN component_id TO target_id;
        RAISE NOTICE '✓ Renamed component_id to target_id';
    -- Otherwise, if target_id doesn't exist, add it
    ELSIF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'comments' 
        AND column_name = 'target_id'
    ) THEN
        RAISE NOTICE 'Adding target_id column...';
        ALTER TABLE comments ADD COLUMN target_id TEXT;
        RAISE NOTICE '✓ Added target_id column';
    ELSE
        RAISE NOTICE '✓ target_id column already exists';
    END IF;
END $$;

-- ============================================
-- STEP 2: Add x_pct column (if missing)
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'comments' 
        AND column_name = 'x_pct'
    ) THEN
        RAISE NOTICE 'Adding x_pct column...';
        ALTER TABLE comments ADD COLUMN x_pct NUMERIC;
        RAISE NOTICE '✓ Added x_pct column';
    ELSE
        RAISE NOTICE '✓ x_pct column already exists';
    END IF;
END $$;

-- ============================================
-- STEP 3: Add y_pct column (if missing)
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'comments' 
        AND column_name = 'y_pct'
    ) THEN
        RAISE NOTICE 'Adding y_pct column...';
        ALTER TABLE comments ADD COLUMN y_pct NUMERIC;
        RAISE NOTICE '✓ Added y_pct column';
    ELSE
        RAISE NOTICE '✓ y_pct column already exists';
    END IF;
END $$;

-- ============================================
-- STEP 4: Make author_email nullable (if needed)
-- ============================================
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'comments' 
        AND column_name = 'author_email'
        AND is_nullable = 'NO'
    ) THEN
        RAISE NOTICE 'Making author_email nullable...';
        ALTER TABLE comments ALTER COLUMN author_email DROP NOT NULL;
        RAISE NOTICE '✓ Made author_email nullable';
    ELSE
        RAISE NOTICE '✓ author_email is already nullable';
    END IF;
END $$;

-- ============================================
-- VERIFICATION: Check final structure
-- ============================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;

-- Final success message
DO $$ 
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Migration complete! All columns are ready.';
    RAISE NOTICE '============================================';
END $$;

