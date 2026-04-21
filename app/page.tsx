import { createServerSupabase } from '@/lib/supabase/server';
import { CatalogClient } from './CatalogClient';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CatalogPage() {
  const supabase = await createServerSupabase();
  const cookieStore = await cookies();
  const mockAuth = cookieStore.get('mock_auth');
  const isAdmin = mockAuth?.value === 'admin';

  // Fetch all artifacts from real backend, excluding archived ones
  const { data: artifacts, error } = await supabase
    .from('artifacts')
    .select('*')
    .neq('status', 'archived')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching artifacts:", error);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <CatalogClient initialArtifacts={artifacts ?? []} isAdmin={isAdmin} />
    </main>
  );
}
