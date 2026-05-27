import Skeleton from "@mui/material/Skeleton";

const FlockDetailsLoader = () => {
  return (
    <section className="w-full">
      <div className="relative flex h-96 w-full items-center justify-center bg-[#F9F9F9]">
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          className="lg:w-[90%] lg:rounded-b-xl"
          sx={{ bgcolor: "rgba(0, 0, 0, 0.06)", height: "100%" }}
        />
      </div>

      <div className="border-b border-gray-100 bg-white px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-3">
            <Skeleton variant="text" width={280} height={40} />

            <div className="mt-1 space-y-1.5">
              <Skeleton variant="text" width={480} height={20} />
              <Skeleton variant="text" width={320} height={20} />
            </div>

            <div className="mt-1 flex items-center gap-2">
              <Skeleton variant="circular" width={22} height={22} />
              <Skeleton variant="text" width={100} height={24} />
            </div>
          </div>

          <div className="flex items-center gap-5 self-start lg:self-center">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="text" width={50} height={16} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12">
        <div className="hidden lg:col-span-3 lg:block">
          <div className="rounded-3xl border border-gray-200 p-5">
            <div className="mb-6 flex items-center justify-between">
              <Skeleton variant="text" width={100} height={30} />

              <div className="flex gap-2">
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="circular" width={28} height={28} />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: 35 }).map((_, index) => (
                <Skeleton key={index} variant="circular" width={28} height={28} />
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-9">
          <div className="min-h-105 rounded-3xl border border-gray-200 p-6">
            <div className="mb-6 flex items-center justify-between">
              <Skeleton variant="text" width={140} height={35} />

              <Skeleton variant="text" width={120} height={24} />
            </div>

            <div className="flex flex-col gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-gray-200 p-4">
                  <div className="flex gap-4">
                    <Skeleton variant="rounded" width={120} height={90} sx={{ borderRadius: "14px" }} />

                    <div className="flex flex-1 flex-col gap-2">
                      <Skeleton variant="text" width="60%" height={30} />

                      <Skeleton variant="text" width="40%" height={22} />

                      <Skeleton variant="text" width="80%" height={22} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlockDetailsLoader;
