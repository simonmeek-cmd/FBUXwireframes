import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Auth check timeout - redirecting to login');
        setLoading(false);
        setAuthenticated(false);
      }
    }, 5000); // 5 second timeout

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (mounted) {
          if (error) {
            console.error('Auth check error:', error);
            setAuthenticated(false);
          } else {
            setAuthenticated(!!session);
          }
          setLoading(false);
          clearTimeout(timeoutId);
        }
      } catch (err) {
        console.error('Auth check exception:', err);
        if (mounted) {
          setAuthenticated(false);
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setAuthenticated(!!session);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-wire-100 flex items-center justify-center">
        <div className="text-wire-600">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};


