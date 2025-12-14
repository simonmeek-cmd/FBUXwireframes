# Setup Instructions: Supabase + Netlify Migration

## Step 1: Set Up Your Database (Supabase)

1. Go to your Supabase project: https://supabase.com/dashboard/project/yoryxisriiohgegjitad
2. Click **SQL Editor** in the left sidebar
3. Click **New Query** button
4. Open the file `supabase-schema.sql` in this project folder
5. Copy ALL the text from that file
6. Paste it into the SQL Editor
7. Click **Run** (or press Cmd+Enter / Ctrl+Enter)
8. You should see "Success" - this created all the database tables you need

## Step 2: Get Your API Keys

1. In Supabase, click **Settings** (gear icon) in the left sidebar
2. Click **API**
3. You'll see two sections:

   **For your local development:**
   - Copy the **Project URL** (looks like `https://yoryxisriiohgegjitad.supabase.co`)
   - Copy the **Publishable key** (from the "Publishable key" section - click the copy icon)

   **For Netlify (you'll need this later):**
   - Copy the **Secret key** (from the "Secret keys" section - click the eye icon to see it, then copy)
   - ⚠️ **Keep this secret** - don't share it!

## Step 3: Set Up Local Development

1. In your project folder, create a file called `.env.local` (it should be in the same folder as `package.json`)
2. Open `.env.local` in a text editor
3. Paste these two lines (replace with YOUR values from Step 2):
   ```
   VITE_SUPABASE_URL=https://yoryxisriiohgegjitad.supabase.co
   VITE_SUPABASE_ANON_KEY=paste-your-publishable-key-here
   ```
4. Save the file

## Step 4: Create User Accounts

1. In Supabase, click **Authentication** in the left sidebar
2. Click **Users**
3. Click **Add user** → **Create new user**
4. Enter:
   - Email: `your.email@fatbeehive.com`
   - Password: (choose a secure password)
   - ✅ Check "Auto Confirm User"
5. Click **Create user**
6. Repeat for each team member (3-4 users total)

## Step 5: Test Locally

1. Open Terminal (or Command Prompt)
2. Navigate to your project folder:
   ```bash
   cd /Users/simonmeek/Documents/Cursor/wireframes
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to: `http://localhost:5173/login`
5. Log in with one of the user accounts you created in Step 4
6. You should see the dashboard!

## Step 6: Set Up Netlify (For Deployment)

### 6.1 Login to Netlify

1. In Terminal, run:
   ```bash
   npm run netlify login
   ```
2. This will open your browser - log in with: `simon.meek@fatbeehive.com`
3. Authorize Netlify to access your account

### 6.2 Connect Your Project to Netlify

1. In Terminal, run:
   ```bash
   npm run netlify init
   ```
2. It will ask you questions - answer:
   - **Create & configure a new site** (press Enter)
   - **Team:** Choose your team (or press Enter for default)
   - **Site name:** Press Enter to use the default, or type a name
   - **Build command:** Type `npm run build` (then press Enter)
   - **Directory to deploy:** Type `dist` (then press Enter)

### 6.3 Add Environment Variables to Netlify

1. Go to https://app.netlify.com
2. Click on your site (or find it in the list)
3. Click **Site settings** (in the top menu)
4. Click **Environment variables** (in the left sidebar)
5. Click **Add a variable** and add these 4 variables one by one:

   **Variable 1:**
   - Key: `SUPABASE_URL`
   - Value: Your Supabase Project URL (from Step 2)

   **Variable 2:**
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your Secret key (from Step 2)

   **Variable 3:**
   - Key: `VITE_SUPABASE_URL`
   - Value: Your Supabase Project URL (same as Variable 1)

   **Variable 4:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: Your Publishable key (from Step 2)

6. Click **Save** after each one

### 6.4 Deploy to Netlify

1. In Terminal, run:
   ```bash
   npm run build
   ```
   (This creates the files to deploy)

2. Then run:
   ```bash
   npm run netlify deploy --prod
   ```
   (This uploads your site to Netlify)

3. Wait for it to finish - you'll get a URL like `https://your-site-name.netlify.app`

4. Visit that URL and test that everything works!

## Step 7: Test with Local Functions (Optional)

If you want to test the API functions locally before deploying:

1. Stop your current dev server (press Ctrl+C in Terminal)
2. Run:
   ```bash
   npm run dev:netlify
   ```
3. This starts both the app AND the API functions locally
4. The app will be at a different URL (usually `http://localhost:8888` - check what Terminal says)
5. Test that creating clients/projects works

**Note:** You can skip this step and just deploy - everything will work once it's on Netlify!

## Troubleshooting

### "Unauthorized" errors
- Make sure you're logged in
- Check that your `.env.local` file has the correct values
- Make sure you restarted the dev server after creating `.env.local`

### Functions not working locally
- Use `npm run dev:netlify` instead of `npm run dev`
- Or just deploy to Netlify - functions work there automatically

### Can't see any data
- Make sure you ran the SQL in Step 1
- Check the browser console (F12) for error messages
- Make sure you created user accounts in Step 4

## What's Next?

After everything is set up:
1. ✅ Test creating a client
2. ✅ Test creating a project
3. ✅ Test adding pages
4. ⏳ Migrate your existing data (we'll create a script for this)
5. ⏳ Add annotation system (Phase 2)
