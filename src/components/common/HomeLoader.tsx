import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const HomeLoader = () => {
  return (
    <section>
      {/* Heading Skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton variant="text" width={220} height={40} />

          <Skeleton variant="text" width={320} height={24} />
        </div>

        <Skeleton variant="rounded" width={90} height={36} />
      </div>

      {/* Activities Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="
              flex flex-col gap-3
              rounded-3xl border border-slate-200
              bg-white p-4 shadow-sm
            "
          >
            <Skeleton
              variant="rounded"
              width="100%"
              height={220}
              sx={{ borderRadius: "16px" }}
            />

            <Stack spacing={1}>
              <Skeleton variant="text" width="80%" height={32} />

              <Skeleton variant="text" width="60%" height={20} />

              <Skeleton variant="text" width="70%" height={20} />
            </Stack>

            <Skeleton
              variant="rounded"
              width="100%"
              height={42}
              sx={{ borderRadius: "12px" }}
            />
          </div>
        ))}
      </div>


      {/* Filter Buttons Skeleton */}
      <div className="mt-16 flex flex-wrap justify-center gap-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            width={110}
            height={42}
            sx={{ borderRadius: "999px" }}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeLoader;
