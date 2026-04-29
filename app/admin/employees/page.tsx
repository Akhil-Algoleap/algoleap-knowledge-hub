import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { EmployeeTable } from '@/components/EmployeeTable';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Employee } from '@/lib/types';
import { Logo } from '@/components/Logo';

export default async function EmployeeAdminPage() {
  const supabase = await createServerSupabase();
  
  // Get real user session
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Check admin role in profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // List of hardcoded admin emails for safety/POC
  const hardcodedAdmins = ['akhil.bommera@algoleap.com'];
  const isHardcodedAdmin = user.email && hardcodedAdmins.includes(user.email);

  if (profile?.role !== 'admin' && !isHardcodedAdmin) {
    redirect('/');
  }

  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching employees:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6 mb-8 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col">
          <Link href="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-algoleap-green mb-4 transition-colors font-medium text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Admin Console
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Logo size="xl" />
              <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                  <ShieldCheck className="h-7 w-7 text-algoleap-green" /> Access Control
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">Manage the whitelist of employees who can access the Knowledge Hub.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <EmployeeTable initialEmployees={(employees as Employee[]) ?? []} />
      </div>
    </main>
  );
}
