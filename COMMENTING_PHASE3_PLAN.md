# Commenting Feature - Phase 3 Plan

## Overview
Phase 3 adds admin/management tools for handling comments across projects. This phase should be implemented when there's a need for centralized comment management and moderation.

## Current Status
- ✅ **Phase 1**: Read-only comment display (completed)
- ✅ **Phase 2**: Click-to-add comments + general comments sidebar (completed)
- ⏸️ **Phase 3**: Comment management dashboard (on hold)

---

## Phase 3 Features

### 1. Comments Dashboard
**Location**: New page at `/comments` or `/admin/comments`

**Features**:
- List all comments across all projects
- Filter by:
  - Project
  - Page
  - Status (new/resolved/archived)
  - Author
  - Date range
- Sort by:
  - Date (newest/oldest)
  - Author name
  - Status
  - Project name
- Search comments by text content
- Pagination for large comment lists

**UI Components**:
- Table/list view of comments
- Filter sidebar or dropdowns
- Quick action buttons (resolve, archive, view)
- Link to view comment in context on the wireframe

### 2. Comment Status Management
**Actions**:
- **Resolve**: Mark comment as resolved (changes status from 'new' to 'resolved')
- **Archive**: Move comment to archived status (for cleanup)
- **Reopen**: Change resolved comment back to 'new' status
- **Delete**: Permanently remove comment (optional - may want to keep for audit trail)

**Implementation**:
- Add `PATCH` endpoint to `netlify/functions/comments.ts` for updating comment status
- Update Supabase `comments` table (status field already exists)
- Add action buttons in dashboard and comment popup (for authenticated users)

### 3. Comment Context View
**Features**:
- Click comment in dashboard → navigate to publish view with comment highlighted
- Scroll to comment location on page
- Auto-open comment popup when navigating from dashboard
- Show breadcrumb: Project > Page > Component (if applicable)

### 4. Email Notifications (Optional)
**When to implement**: If clients need to be notified of new comments

**Features**:
- Send email when new comment is added
- Include:
  - Comment text
  - Author name
  - Link to view comment in context
  - Project/page information
- Configure notification preferences (per project or global)

**Implementation Options**:
- Use Netlify Functions to send emails (via SendGrid, Mailgun, etc.)
- Or use Supabase Edge Functions for email sending
- Store email preferences in database

### 5. Comment Replies/Threading (Optional)
**When to implement**: If back-and-forth discussion is needed

**Features**:
- Reply to existing comments
- Thread view showing comment + replies
- Notify original commenter when reply is added

**Database Changes**:
- Add `parent_comment_id` field to `comments` table
- Or create separate `comment_replies` table

---

## Technical Implementation Notes

### Database Schema
The `comments` table already has:
- `status` field (new/resolved/archived) ✅
- `resolved_at` timestamp ✅
- `resolved_by` user ID ✅

**No schema changes needed** for basic status management.

### API Endpoints Needed
1. `PATCH /comments/:commentId` - Update comment status
   ```json
   {
     "status": "resolved" | "archived" | "new",
     "resolved_by": "user-id" // optional, for tracking
   }
   ```

2. `GET /comments/all?projectId=...&status=...` - Get all comments with filters
   - Should only be accessible to authenticated users
   - Add RLS policy in Supabase

### Files to Create/Modify
- `src/pages/CommentsDashboard.tsx` - New dashboard page
- `netlify/functions/comments.ts` - Add PATCH endpoint
- `src/App.tsx` - Add route for `/comments` (protected)
- `src/components/comments/CommentTable.tsx` - Table component
- `src/components/comments/CommentFilters.tsx` - Filter component

### Authentication
- Comments dashboard should be **protected route** (AuthGuard)
- Only authenticated users can manage comments
- Public users can still add comments (Phase 2)

---

## When to Implement Phase 3

**Signs you need Phase 3**:
- Multiple projects with many comments
- Need to track which comments have been addressed
- Want to see all feedback in one place
- Need to close/resolve comments after fixes are made
- Clients asking for comment management features

**Can wait if**:
- Only a few projects
- Comments are infrequent
- Manual tracking is sufficient
- No need for status tracking

---

## Future Enhancements (Post-Phase 3)

- Comment export (CSV/PDF)
- Comment analytics (most commented pages, response times)
- Bulk actions (resolve multiple at once)
- Comment templates/quick replies
- Integration with project management tools


