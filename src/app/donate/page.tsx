import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DonateFormWrapper from './donate-form-wrapper';

function DonatePageSkeleton() {
  return (
    <div className="overflow-x-hidden pt-28 md:pt-32">
      <div className="py-12 md:py-20 container mx-auto text-center">
        <Skeleton className="h-10 w-3/4 sm:h-12 mx-auto" />
        <Skeleton className="h-4 w-full max-w-2xl mx-auto mt-4" />
      </div>
      <div className="pb-12 md:pb-24 container mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-[350px] w-full rounded-2xl" />
        <Skeleton className="h-[300px] w-full rounded-2xl" />
        <Skeleton className="h-[250px] w-full rounded-2xl" />
      </div>
    </div>
  );
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DonatePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const cause = typeof params.cause === 'string' ? params.cause : undefined;

  return (
    <Suspense fallback={<DonatePageSkeleton />}>
      <DonateFormWrapper cause={cause} />
    </Suspense>
  );
}
