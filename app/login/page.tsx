'use client';

import { supabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'employee' | 'admin'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = '/';
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (authMode === 'admin') {
        const ADMIN_PASSWORD = '@Algoleap54321';
        const EMPLOYEE_PASSWORD = '@AlgoleapEmployee2026';
        const hardcodedAdmins = ['akhil.bommera@algoleap.com'];
        const isHardcodedAdmin = hardcodedAdmins.includes(email);

        if (password !== ADMIN_PASSWORD) throw new Error('Incorrect Admin Password');
        
        // Set perspective cookie
        document.cookie = `preferred_role=admin; path=/; max-age=3600; SameSite=Lax`;
        
        // 1. Try to Sign In with Admin Password
        let { error: signInError } = await supabase.auth.signInWithPassword({ 
          email, 
          password: ADMIN_PASSWORD 
        });

        // 2. If it fails, try auto-signup or employee password fallback
        if (signInError && signInError.message.includes('Invalid login credentials')) {
          // Try to sign up if account doesn't exist
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password: ADMIN_PASSWORD
          });

          if (signUpError) {
            // If user already exists (likely as employee), try to login with employee password
            const { error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password: EMPLOYEE_PASSWORD
            });
            if (retryError) throw retryError;
          } else {
            // SignUp successful, now sign in
            const { error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password: ADMIN_PASSWORD
            });
            if (retryError) throw retryError;
          }
        } else if (signInError) {
          throw signInError;
        }

        // 3. Ensure profile exists and has admin role
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            role: 'admin'
          }, { onConflict: 'id' });
        }
        
        window.location.href = '/';
      } else {
        // --- NEW SEAMLESS EMPLOYEE LOGIC ---
        // 1. Verify if the email is in our whitelist table
        const { data: whitelist, error: whitelistError } = await supabase
          .from('employees')
          .select('email')
          .eq('email', email)
          .single();

        if (whitelistError || !whitelist) {
          throw new Error('Access Denied. Your email is not in the authorized employee directory.');
        }

        // 2. Set perspective cookie
        document.cookie = `preferred_role=viewer; path=/; max-age=3600; SameSite=Lax`;

        const SHARED_PASSWORD = '@AlgoleapEmployee2026';

        // 3. Try to Sign In with the shared password
        let { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: SHARED_PASSWORD
        });

        // 4. If user doesn't exist yet, Auto-Sign Up (this works because "Confirm Email" is OFF in Supabase)
        if (signInError && signInError.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password: SHARED_PASSWORD
          });
          
          if (signUpError) throw signUpError;
          
          // Try signing in again after signup
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password: SHARED_PASSWORD
          });
          if (retryError) throw retryError;
        } else if (signInError) {
          throw signInError;
        }

        // 5. Ensure profile exists
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
          }, { onConflict: 'id' });
        }
        
        window.location.href = '/';
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      {/* Dynamic Background (Soft) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-green-50 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 -right-1/4 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-[160px]" />
      </div>
      
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white p-10 border border-gray-100 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-center mb-10">
            <Logo />
          </div>

          {/* Perspective Toggle (Hidden when OTP field is visible to avoid confusion) */}
          {!showOtp && (
            <div className="bg-gray-100 p-1.5 rounded-2xl flex mb-10 border border-gray-200 animate-in fade-in duration-500">
              <button 
                onClick={() => { setAuthMode('employee'); setMessage(null); }}
                className={cn(
                  "flex-1 py-3 text-[13px] font-bold rounded-xl transition-all",
                  authMode === 'employee' ? "bg-white text-[#3A7D44] shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                Employee Access
              </button>
              <button 
                onClick={() => { setAuthMode('admin'); setMessage(null); }}
                className={cn(
                  "flex-1 py-3 text-[13px] font-bold rounded-xl transition-all",
                  authMode === 'admin' ? "bg-[#3A7D44] text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
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
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A7D44]/10 focus:border-[#3A7D44] transition-all"
                  />
                </div>

                {authMode === 'admin' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-400">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1 blur-[0.2px]">
                      Password
                    </label>
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A7D44]/10 focus:border-[#3A7D44] transition-all"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4 animate-in zoom-in-95 duration-500">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#3A7D44] uppercase tracking-[0.2em] px-1">
                    Verification Code
                  </label>
                  <input 
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-6 text-center text-3xl font-black tracking-[0.5em] text-[#3A7D44] placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[#3A7D44]/5 focus:border-[#3A7D44] transition-all"
                  />
                  <p className="text-[10px] text-gray-500 text-center mt-3 px-4 italic leading-relaxed">
                    Type the verification code found in your email. <br/>
                    <span className="text-[#3A7D44]/70">Do not click the link</span> if you are on a different device.
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
                  ? "bg-[#3A7D44] text-white hover:bg-[#2E6336]" 
                  : "bg-[#3A7D44] text-white hover:bg-[#2E6336]"
              )}
            >
              {isLoading ? 'Processing...' : (
                showOtp ? 'Verify Identity' : (authMode === 'admin' ? 'Enter Console' : 'Login to Portal')
              )}
            </button>
          </form>

          {message && (
            <div className={cn(
              "mt-8 p-4 rounded-2xl text-[13px] font-semibold border animate-in zoom-in-95 duration-300 text-center",
              message.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-[#3A7D44]/10 border-[#3A7D44]/20 text-[#3A7D44]"
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
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              Algoleap Central Identity<br/>
              Encrypted Session v2.4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
