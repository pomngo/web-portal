import Skeleton from "@mui/material/Skeleton";

type HomeLoaderProps = {
  type?: "home" | "flocks" | "activities" | "all-flocks" | "all-activities";
};

const CardSkeleton = () => (
  <div className="w-full rounded-2xl bg-white p-3 flex flex-col gap-3 border border-slate-100 shadow-xs">
    <Skeleton
      variant="rounded"
      width="100%"
      height={208}
      sx={{ borderRadius: "16px" }}
    />
    
    <div className="flex flex-col gap-2 mt-1">
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

    <Skeleton
      variant="rounded"
      width="100%"
      height={40}
      sx={{ borderRadius: "12px" }}
    />
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
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        sx={{ borderRadius: "24px" }}
      />
    </div>
  );
};

const CategoryFiltersSkeleton = () => (
  <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
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

const SectionHeaderSkeleton = ({
  hasSubtitle = true,
}: {
  hasSubtitle?: boolean;
}) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex flex-col gap-1.5 w-2/3">
      <Skeleton variant="text" width="40%" height={32} />
      {hasSubtitle && <Skeleton variant="text" width="65%" height={20} />}
    </div>
    <Skeleton
      variant="rounded"
      width={120}
      height={36}
      sx={{ borderRadius: "12px" }}
    />
  </div>
);

const ResponsiveCardListSkeleton = () => (
  <>
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:hidden pb-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="min-w-[85%] sm:min-w-[65%] md:min-w-[45%] snap-center flex-shrink-0"
        >
          <CardSkeleton />
        </div>
      ))}
    </div>

    <div className="hidden lg:grid lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  </>
);

const ResponsiveBentoFlockListSkeleton = () => (
  <>
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:hidden pb-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="min-w-[90%] sm:min-w-[70%] snap-center flex-shrink-0 h-[370px]"
        >
          <BentoFlockCardSkeleton index={index} />
        </div>
      ))}
    </div>

    <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-auto">
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
        <div className="flex justify-between items-center mb-6">
          <Skeleton variant="text" width={220} height={40} />
          <Skeleton
            variant="rounded"
            width={100}
            height={36}
            sx={{ borderRadius: "12px" }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (type === "flocks") {
    return (
      <div className="flex flex-col gap-16 w-full">
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
      <div className="flex flex-col gap-16 w-full">
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
    <div className="flex flex-col gap-16 w-full">
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
