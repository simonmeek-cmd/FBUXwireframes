import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useBuilderStore } from './stores/useBuilderStore';
import { AuthGuard } from './components/auth/AuthGuard';
import { Dashboard } from './pages/Dashboard';
import { ClientView } from './pages/ClientView';
import { ProjectView } from './pages/ProjectView';
import { PageBuilder } from './pages/PageBuilder';
import { Preview } from './pages/Preview';
import { WireframeShowcase } from './pages/WireframeShowcase';
import { Login } from './pages/Login';
import { Debug } from './pages/Debug';
import { MigrateData } from './pages/MigrateData';
import { Publish } from './pages/Publish';
import { getCurrentSession } from './lib/supabase';

function AppContent() {
  const initialize = useBuilderStore((state) => state.initialize);
  const location = useLocation();

  useEffect(() => {
    // Only initialize if user is authenticated and not on login page
    const initIfAuthenticated = async () => {
      if (location.pathname === '/login' || location.pathname.startsWith('/publish')) {
        return; // Don't initialize on login page
      }
      
      const session = await getCurrentSession();
      if (session) {
        initialize();
      }
    };
    initIfAuthenticated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // Only depend on location.pathname, not initialize

  return null; // This component just handles initialization
}

// Temporary publish diagnostic component (no hooks)
const PublishDiag: React.FC = () => (
  <div className="min-h-screen bg-wire-50 flex items-center justify-center">
    <div className="text-center space-y-2">
      <p className="text-wire-700 font-semibold">Publish diagnostic route</p>
      <p className="text-wire-500 text-sm">Rendering is temporarily replaced to isolate a render loop.</p>
    </div>
  </div>
);

function App() {
  const PUBLISH_ROUTE_DIAG = true; // set false to restore normal publish routes
  return (
    <BrowserRouter>
      <AppContent />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/publish/:projectId" element={PUBLISH_ROUTE_DIAG ? <PublishDiag /> : <Publish />} />
        <Route path="/publish/:projectId/:pageId" element={PUBLISH_ROUTE_DIAG ? <PublishDiag /> : <Publish />} />
        
        {/* Migration tool (protected) */}
        <Route
          path="/migrate"
          element={
            <AuthGuard>
              <MigrateData />
            </AuthGuard>
          }
        />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/client/:clientId"
          element={
            <AuthGuard>
              <ClientView />
            </AuthGuard>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <AuthGuard>
              <ProjectView />
            </AuthGuard>
          }
        />
        <Route
          path="/project/:projectId/page/:pageId"
          element={
            <AuthGuard>
              <PageBuilder />
            </AuthGuard>
          }
        />
        <Route
          path="/preview/:projectId"
          element={
            <AuthGuard>
              <Preview />
            </AuthGuard>
          }
        />
        <Route
          path="/preview/:projectId/:pageId"
          element={
            <AuthGuard>
              <Preview />
            </AuthGuard>
          }
        />
        
        {/* Component showcase (for reference) */}
        <Route
          path="/showcase"
          element={
            <AuthGuard>
              <WireframeShowcase />
            </AuthGuard>
          }
        />
        
        {/* Debug tool */}
        <Route
          path="/debug"
          element={
            <AuthGuard>
              <Debug />
            </AuthGuard>
          }
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
