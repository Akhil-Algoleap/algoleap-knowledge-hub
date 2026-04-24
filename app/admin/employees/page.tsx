import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { EmployeeTable } from '@/components/EmployeeTable';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Employee } from '@/lib/types';

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
    <main className="min-h-screen bg-algoleap-dark pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-8 border-b border-white/10 pb-6">
          <Link href="/admin" className="inline-flex items-center gap-2 text-algoleap-green hover:text-algoleap-green-hover mb-4 transition-colors font-medium text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Admin Console
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-algoleap-green" /> Access Control
              </h1>
              <p className="text-algoleap-muted mt-1">Manage the whitelist of employees who can access the Knowledge Hub.</p>
            </div>
          </div>
        </header>

        <EmployeeTable initialEmployees={(employees as Employee[]) ?? []} />

      </div>
    </main>
  );
}
