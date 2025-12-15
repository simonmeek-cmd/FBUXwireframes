-- Wireframe Builder Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  navigation_config JSONB,
  footer_config JSONB,
  welcome_page_config JSONB,
  active_components TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Pages table
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  components JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_index INTEGER DEFAULT 0
);

-- Comments table (public commenting on published wireframes)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  target_id TEXT, -- e.g., component id
  x_pct NUMERIC,  -- 0..1 relative x within target box
  y_pct NUMERIC,  -- 0..1 relative y within target box
  comment_text TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'resolved', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_pages_project_id ON pages(project_id);
CREATE INDEX idx_comments_project_id ON comments(project_id);
CREATE INDEX idx_comments_page_id ON comments(page_id);
CREATE INDEX idx_comments_status ON comments(status);

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Clients: Authenticated users can read/write
CREATE POLICY "Users can view clients" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create clients" ON clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update clients" ON clients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete clients" ON clients
  FOR DELETE USING (auth.role() = 'authenticated');

-- Projects: Authenticated users can read/write
CREATE POLICY "Users can view projects" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update projects" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete projects" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- Pages: Authenticated users can read/write
CREATE POLICY "Users can view pages" ON pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create pages" ON pages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update pages" ON pages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete pages" ON pages
  FOR DELETE USING (auth.role() = 'authenticated');

-- Comments: anyone can create; anyone can view (publish); updates restricted
CREATE POLICY "Anyone can create comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can update comments" ON comments
  FOR UPDATE USING (auth.role() = 'authenticated');

