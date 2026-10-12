import { Suspense } from 'react';
import { HomeDashboard } from '@/components/home/HomeDashboard';
import { HomeSkeleton } from '@/components/home/HomeSkeleton';
import { readHomeDashboard } from '@/lib/home';
import { getSupabaseScope } from '@/lib/supabase/scope';

/** Reads on the server, then hands a plain view model to the dashboard (strings follow the viewer's locale). */
async function HomeContent() {
  const [data, scope] = await Promise.all([readHomeDashboard(), getSupabaseScope()]);
  // Creating an application needs an account: hidden on the read-only demo.
  return <HomeDashboard data={data} canCreate={scope !== null} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
