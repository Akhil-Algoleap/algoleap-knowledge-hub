'use client';

import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'employee' | 'admin'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (authMode === 'admin') {
        if (password !== '@Algoleap54321') throw new Error('Incorrect Admin Password');
        
        // Set perspective cookie
        document.cookie = `preferred_role=admin; path=/; max-age=3600; SameSite=Lax`;
        
        const { error } = await supabase.auth.signInWithPassword({ email, password: '@Algoleap54321' });
        if (error) throw error;
        window.location.href = '/';
      } else {
        // Employee logic
        if (!showOtp) {
          // Stage 1: Send Code
          if (!email.endsWith('@algoleap.com')) throw new Error('Only @algoleap.com emails are authorized.');
          
          const { error } = await supabase.auth.signInWithOtp({ email });
          if (error) throw error;
          
          setShowOtp(true);
          setMessage({ type: 'success', text: '6-digit code sent to your email.' });
        } else {
          // Stage 2: Verify Code
          
          // Set perspective cookie
          document.cookie = `preferred_role=viewer; path=/; max-age=3600; SameSite=Lax`;
          
          const { error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email'
          });
          if (error) throw error;
          window.location.href = '/';
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0F0D]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-algoleap-green/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 -right-1/4 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[160px]" />
      </div>
      
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-[#0A0F0D]/80 backdrop-blur-3xl p-10 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="bg-[#00FF88] p-3 rounded-2xl text-[#19593A] flex items-center justify-center shadow-lg shadow-[#00FF88]/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <span className="font-black tracking-tighter text-4xl text-white">algoleap</span>
          </div>

          {/* Perspective Toggle (Hidden when OTP field is visible to avoid confusion) */}
          {!showOtp && (
            <div className="bg-white/5 p-1.5 rounded-2xl flex mb-10 border border-white/5 animate-in fade-in duration-500">
              <button 
                onClick={() => { setAuthMode('employee'); setMessage(null); }}
                className={cn(
                  "flex-1 py-3 text-[13px] font-bold rounded-xl transition-all",
                  authMode === 'employee' ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "text-gray-500 hover:text-white"
                )}
              >
                Employee Access
              </button>
              <button 
                onClick={() => { setAuthMode('admin'); setMessage(null); }}
                className={cn(
                  "flex-1 py-3 text-[13px] font-bold rounded-xl transition-all",
                  authMode === 'admin' ? "bg-[#00FF88] text-[#19593A] shadow-[0_0_20px_rgba(0,255,136,0.2)]" : "text-gray-500 hover:text-white"
                )}
              >
                Admin Console
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {!showOtp ? (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1 blur-[0.2px]">
                    {authMode === 'admin' ? 'Admin Credential' : 'Work Identity'}
                  </label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={authMode === 'admin' ? 'admin@algoleap.com' : 'name@algoleap.com'}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/20 focus:border-[#00FF88] transition-all"
                  />
                </div>

                {authMode === 'admin' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-400">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1 blur-[0.2px]">
                      Secret Code
                    </label>
                    <input 
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="@Algoleap54321"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/20 focus:border-[#00FF88] transition-all"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4 animate-in zoom-in-95 duration-500">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#00FF88] uppercase tracking-[0.2em] px-1">
                    Verification Code
                  </label>
                  <input 
                    type="text"
                    required
                    maxLength={8}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="00000000"
                    className="w-full bg-black/40 border border-[#00FF88]/20 rounded-2xl px-5 py-6 text-center text-3xl font-black tracking-[0.5em] text-[#00FF88] placeholder:text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#00FF88]/10 focus:border-[#00FF88] transition-all"
                  />
                  <p className="text-[10px] text-gray-500 text-center mt-3 px-4 italic leading-relaxed">
                    Type the verification code found in your email. <br/>
                    <span className="text-[#00FF88]/70">Do not click the link</span> if you are on a different device.
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowOtp(false)}
                  className="w-full text-center text-xs text-gray-500 hover:text-white transition-colors mt-2"
                >
                  &larr; Use different email
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-4.5 rounded-2xl font-black text-[14px] uppercase tracking-wider transition-all disabled:opacity-50",
                authMode === 'admin' 
                  ? "bg-[#00FF88] text-[#19593A] hover:bg-[#00e57a]" 
                  : "bg-white text-[#0A0F0D] hover:bg-gray-100"
              )}
            >
              {isLoading ? 'Processing...' : (
                showOtp ? 'Verify Identity' : (authMode === 'admin' ? 'Enter Console' : 'Send Code')
              )}
            </button>
          </form>

          {message && (
            <div className={cn(
              "mt-8 p-4 rounded-2xl text-[13px] font-semibold border animate-in zoom-in-95 duration-300 text-center",
              message.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-[#00FF88]/10 border-[#00FF88]/20 text-[#00FF88]"
            )}>
              {message.type === 'error' && authMode === 'admin' && message.text === 'Invalid login credentials' ? (
                <>
                  <p className="mb-2">Account not found in Supabase.</p>
                  <p className="text-[11px] opacity-80 font-normal">Go to Supabase Dashboard &gt; Auth &gt; Users and create an account with this email and the password <strong>@Algoleap54321</strong></p>
                </>
              ) : message.text}
            </div>
          )}

          <div className="mt-12 text-center opacity-40">
            <p className="text-gray-100 text-[10px] font-bold uppercase tracking-[0.3em]">
              Algoleap Central Identity<br/>
              Encrypted Session v2.4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
