import Skeleton from "@mui/material/Skeleton";

type HomeLoaderProps = {
  type?: "home" | "flocks" | "activities" | "all-flocks" | "all-activities";
};

const CardSkeleton = () => (
  <div className="flex w-full flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xs">
    <Skeleton variant="rounded" width="100%" height={208} sx={{ borderRadius: "16px" }} />

    <div className="mt-1 flex flex-col gap-2">
      <Skeleton variant="text" width="80%" height={24} />
      <div className="flex items-center gap-1.5">
        <Skeleton variant="circular" width={14} height={14} />
        <Skeleton variant="text" width="50%" height={16} />
      </div>
      <div className="flex items-center gap-1.5">
        <Skeleton variant="circular" width={14} height={14} />
        <Skeleton variant="text" width="40%" height={16} />
      </div>
    </div>

    <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: "12px" }} />
  </div>
);

const BentoFlockCardSkeleton = ({ index }: { index: number }) => {
  const cardClasses = {
    1: "col-span-1 sm:col-span-2 lg:col-span-4 lg:row-span-2 h-[370px]",
    2: "col-span-1 lg:col-span-3 h-[370px] lg:h-[170px]",
    3: "col-span-1 lg:col-span-3 h-[370px] lg:h-[170px]",
    4: "col-span-1 sm:col-span-1 lg:col-span-2 lg:row-span-2 h-[370px]",
    5: "col-span-1 sm:col-span-2 lg:col-span-6 h-[370px] lg:h-[170px]",
  };
  const classKey = ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5;
  const classes = cardClasses[classKey] ?? "";

  return (
    <div className={`relative overflow-hidden rounded-3xl ${classes}`}>
      <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: "24px" }} />
    </div>
  );
};

const CategoryFiltersSkeleton = () => (
  <div className="scrollbar-hide flex gap-4 overflow-x-auto py-2">
    {Array.from({ length: 7 }).map((_, index) => (
      <Skeleton
        key={index}
        variant="rounded"
        width={110}
        height={42}
        sx={{ borderRadius: "999px" }}
        className="flex-shrink-0"
      />
    ))}
  </div>
);

const SectionHeaderSkeleton = ({ hasSubtitle = true }: { hasSubtitle?: boolean }) => (
  <div className="mb-4 flex items-center justify-between">
    <div className="flex w-2/3 flex-col gap-1.5">
      <Skeleton variant="text" width="40%" height={32} />
      {hasSubtitle && <Skeleton variant="text" width="65%" height={20} />}
    </div>
    <Skeleton variant="rounded" width={120} height={36} sx={{ borderRadius: "12px" }} />
  </div>
);

const ResponsiveCardListSkeleton = () => (
  <>
    <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="min-w-[85%] flex-shrink-0 snap-center sm:min-w-[65%] md:min-w-[45%]">
          <CardSkeleton />
        </div>
      ))}
    </div>

    <div className="hidden gap-4 lg:grid lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  </>
);

const ResponsiveBentoFlockListSkeleton = () => (
  <>
    <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-[370px] min-w-[90%] flex-shrink-0 snap-center sm:min-w-[70%]">
          <BentoFlockCardSkeleton index={index} />
        </div>
      ))}
    </div>

    <div className="hidden auto-rows-auto grid-cols-1 gap-4 lg:grid lg:grid-cols-12">
      {Array.from({ length: 5 }).map((_, index) => (
        <BentoFlockCardSkeleton key={index} index={index} />
      ))}
    </div>
  </>
);

const HomeLoader = ({ type = "home" }: HomeLoaderProps) => {
  if (type === "all-activities" || type === "all-flocks") {
    return (
      <section className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton variant="text" width={220} height={40} />
          <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: "12px" }} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (type === "flocks") {
    return (
      <div className="flex w-full flex-col gap-16">
        <section>
          <SectionHeaderSkeleton />
          <ResponsiveCardListSkeleton />
          <div className="mt-16">
            <CategoryFiltersSkeleton />
          </div>
        </section>

        <section>
          <SectionHeaderSkeleton hasSubtitle={false} />
          <ResponsiveBentoFlockListSkeleton />
        </section>
      </div>
    );
  }

  if (type === "activities") {
    return (
      <div className="flex w-full flex-col gap-16">
        <section>
          <SectionHeaderSkeleton />
          <ResponsiveCardListSkeleton />
          <div className="mt-16">
            <CategoryFiltersSkeleton />
          </div>
        </section>

        <section>
          <SectionHeaderSkeleton />
          <ResponsiveCardListSkeleton />
        </section>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-16">
      <section>
        <SectionHeaderSkeleton />
        <ResponsiveCardListSkeleton />
        <div className="mt-16">
          <CategoryFiltersSkeleton />
        </div>
      </section>

      <section>
        <SectionHeaderSkeleton hasSubtitle={false} />
        <ResponsiveBentoFlockListSkeleton />
      </section>

      <section>
        <SectionHeaderSkeleton />
        <ResponsiveCardListSkeleton />
      </section>
    </div>
  );
};

export default HomeLoader;
