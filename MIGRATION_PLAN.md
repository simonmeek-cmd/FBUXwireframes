# Migration Plan: LocalStorage → Supabase + Netlify

## Overview
Migrating from localStorage-based persistence to Supabase (PostgreSQL) with Netlify Functions API layer.

## Phase 1: Setup & Infrastructure

### 1.1 Supabase Setup

**Steps:**
1. Go to https://supabase.com
2. Sign up/login with GitHub (work account)
3. Create new project:
   - Name: `wireframe-builder` (or your preference)
   - Database password: (save this securely)
   - Region: Choose closest to you
4. Wait for project to provision (~2 minutes)

**Get API Credentials:**
- Go to Project Settings → API
- Copy:
  - `Project URL` (e.g., `https://xxxxx.supabase.co`)
  - `anon` public key
  - `service_role` key (keep secret - only for server-side)

### 1.2 Database Schema

Run this SQL in Supabase SQL Editor:

```sql
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

-- Comments table (for Phase 2 - annotations)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  component_id TEXT,
  comment_text TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
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
```

### 1.3 Row Level Security (RLS) Policies

```sql
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

-- Comments: Anyone can create, authenticated users can read/update
CREATE POLICY "Anyone can create comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view comments" ON comments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update comments" ON comments
  FOR UPDATE USING (auth.role() = 'authenticated');
```

### 1.4 Netlify Setup

**Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

**Login to Netlify:**
```bash
netlify login
```

**Link project:**
```bash
netlify init
```

**Create `netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[plugins]]
  package = "@netlify/plugin-functions"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

## Phase 2: Backend API (Netlify Functions)

### 2.1 Install Dependencies

```bash
npm install @supabase/supabase-js
npm install -D @netlify/plugin-functions
```

### 2.2 Function Structure

Create `netlify/functions/` directory with:

- `clients.ts` - Client CRUD operations
- `projects.ts` - Project CRUD operations  
- `pages.ts` - Page CRUD operations
- `auth.ts` - Authentication helpers

### 2.3 Environment Variables

Create `.env.local` (for development):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Add to Netlify dashboard:
- Site Settings → Environment Variables
- Add the same variables (without VITE_ prefix for functions)

## Phase 3: Frontend Integration

### 3.1 Supabase Client Setup

Create `src/lib/supabase.ts`:
- Initialize Supabase client
- Export auth helpers

### 3.2 API Client

Create `src/api/client.ts`:
- Wrapper functions for API calls
- Error handling
- TypeScript types

### 3.3 Update Zustand Store

Modify `src/stores/useBuilderStore.ts`:
- Replace localStorage calls with API calls
- Add loading/error states
- Keep optimistic updates for UX

### 3.4 Authentication UI

Create:
- `src/pages/Login.tsx` - Login form
- `src/components/auth/AuthGuard.tsx` - Route protection
- Update `App.tsx` to protect routes

## Phase 4: Migration

### 4.1 Export Script

Create `scripts/export-localStorage.ts`:
- Reads localStorage
- Exports to JSON file
- Preserves all data structure

### 4.2 Import Script

Create `scripts/import-to-supabase.ts`:
- Reads JSON export
- Creates clients, projects, pages via API
- Maps IDs correctly
- Handles relationships

## Phase 5: Deployment

### 5.1 Netlify Deployment

1. Push to Git repository
2. Connect to Netlify
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables
5. Deploy

### 5.2 Post-Deployment

1. Test authentication
2. Verify data migration
3. Test CRUD operations
4. Check RLS policies

## File Structure After Migration

```
wireframes/
├── netlify/
│   ├── functions/
│   │   ├── clients.ts
│   │   ├── projects.ts
│   │   ├── pages.ts
│   │   └── auth.ts
│   └── netlify.toml
├── scripts/
│   ├── export-localStorage.ts
│   └── import-to-supabase.ts
├── src/
│   ├── lib/
│   │   └── supabase.ts
│   ├── api/
│   │   └── client.ts
│   ├── components/
│   │   └── auth/
│   │       └── AuthGuard.tsx
│   ├── pages/
│   │   └── Login.tsx
│   └── stores/
│       └── useBuilderStore.ts (updated)
└── .env.local
```

## Testing Checklist

- [ ] Supabase project created
- [ ] Database schema created
- [ ] RLS policies applied
- [ ] Netlify Functions working
- [ ] Authentication working
- [ ] Data migration successful
- [ ] CRUD operations working
- [ ] Deployment successful

## Next Steps (Phase 2 - Annotations)

After Phase 1 is complete:
1. Add annotation UI to preview pages
2. Create comment endpoints
3. Build admin comment management UI
4. Add email notifications (optional)

