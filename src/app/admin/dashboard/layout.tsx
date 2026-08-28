// This route was getting stuck on a stale prerendered build across deploys —
// Firebase Hosting's Next.js integration cached it with an effectively
// infinite stale-time (x-nextjs-stale-time header) and a redeploy alone
// didn't invalidate it. The page is entirely client-gated (Firebase Auth +
// admin email check) with no SEO/caching benefit from static generation, so
// forcing it dynamic is the actual fix, not a workaround around it.
export const dynamic = 'force-dynamic';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
