import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const initialize = useBuilderStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
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
