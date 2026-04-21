'use client';

import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';
import { Search } from 'lucide-react'; // Placeholder for logo

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async () => {
    setIsLoading(true);
    document.cookie = "mock_auth=admin; path=/; max-age=86400";
    window.location.href = "/";
  };

  const handleViewerLogin = async () => {
    setIsLoading(true);
    document.cookie = "mock_auth=viewer; path=/; max-age=86400";
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-algoleap-dark">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-algoleap-green/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>
      
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="glass-panel p-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-[#00E576] p-2.5 rounded-xl text-black flex items-center justify-center shadow-lg shadow-[#00E576]/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <span className="font-extrabold tracking-tight text-4xl text-gray-900">algoleap</span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">Knowledge Hub</h2>
          <p className="text-gray-500 mb-8">
            Test the portal using mock authentication roles
          </p>

          <div className="space-y-4">
            <button
              onClick={handleAdminLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-algoleap-green hover:bg-emerald-500 text-black font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(var(--algoleap-green-rgb),0.3)] hover:shadow-[0_0_25px_rgba(var(--algoleap-green-rgb),0.5)]"
            >
              {isLoading ? (
                <span className="animate-pulse">Connecting...</span>
              ) : (
                "Login as Administrator"
              )}
            </button>

            <button
              onClick={handleViewerLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl transition-all border border-gray-200"
            >
              {isLoading ? (
                <span className="animate-pulse">Connecting...</span>
              ) : (
                "Login as Viewer"
              )}
            </button>
          </div>
          
          
          {error && (
            <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
