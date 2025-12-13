import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useBuilderStore } from './stores/useBuilderStore';
import { Dashboard } from './pages/Dashboard';
import { ClientView } from './pages/ClientView';
import { ProjectView } from './pages/ProjectView';
import { PageBuilder } from './pages/PageBuilder';
import { Preview } from './pages/Preview';
import { WireframeShowcase } from './pages/WireframeShowcase';
import { Debug } from './pages/Debug';

function App() {
  const initialize = useBuilderStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Main builder routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/client/:clientId" element={<ClientView />} />
        <Route path="/project/:projectId" element={<ProjectView />} />
        <Route path="/project/:projectId/page/:pageId" element={<PageBuilder />} />
        <Route path="/preview/:projectId" element={<Preview />} />
        <Route path="/preview/:projectId/:pageId" element={<Preview />} />
        
        {/* Component showcase (for reference) */}
        <Route path="/showcase" element={<WireframeShowcase />} />
        
        {/* Debug tool */}
        <Route path="/debug" element={<Debug />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
