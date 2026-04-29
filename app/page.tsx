import { createServerSupabase } from '@/lib/supabase/server';
import { CatalogClient } from './CatalogClient';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CatalogPage() {
  const supabase = await createServerSupabase();
  
  // Get real user session
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null; // Middleware handles the actual redirect
  }

  // Get user role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Get employee role and practice
  const { data: employee } = await supabase
    .from('employees')
    .select('role, practice')
    .eq('email', user.email)
    .single();

  const cookieStore = await cookies();
  const preferredRole = cookieStore.get('preferred_role')?.value;

  // List of hardcoded admin emails for safety/POC
  const hardcodedAdmins = ['akhil.bommera@algoleap.com'];
  const isHardcodedAdmin = !!(user.email && hardcodedAdmins.includes(user.email));
  const isEmployeeAdmin = employee?.role === 'Administrator';

  // isAdmin is true if they are an admin in DB OR hardcoded, AND haven't requested 'viewer' perspective
  const isAdmin = !!((profile?.role === 'admin' || isHardcodedAdmin || isEmployeeAdmin) && preferredRole !== 'viewer');

  // Fetch all artifacts from real backend, excluding archived ones
  const { data: artifacts, error } = await supabase
    .from('artifacts')
    .select('*')
    .neq('status', 'archived')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching artifacts:", error);
  }

  let finalArtifacts = artifacts ?? [];

  // Filter artifacts by practice if the user is not an admin and has a specific practice assigned
  if (!isAdmin && employee?.practice && employee.practice !== '---') {
    finalArtifacts = finalArtifacts.filter(a => 
      a.service_line && a.service_line.includes(employee.practice)
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <CatalogClient initialArtifacts={finalArtifacts} isAdmin={isAdmin} />
    </main>
  );
}
