import Skeleton from "@mui/material/Skeleton";

const ActivityDetailsLoader = () => {
  return (
    <section className="min-h-screen w-full bg-[#F9F9F9]">
      <div className="relative flex h-96 w-full items-center justify-center">
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
          <div className="flex w-full flex-col gap-3 lg:max-w-2xl">
            <div>
              <Skeleton variant="text" width="60%" height={40} />

              <div className="mt-2 space-y-1.5">
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="75%" height={20} />
              </div>
            </div>

            <div className="mt-2 flex items-center gap-4">
              <Skeleton variant="text" width={150} height={24} />
              <Skeleton variant="text" width={150} height={24} />
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
                <Skeleton variant="text" width={40} height={16} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex gap-6">
          <main className="flex flex-1 flex-col items-start justify-between gap-6 rounded-xl bg-white p-8 shadow-xs lg:flex-row lg:items-center">
            <div className="flex w-full flex-col items-start gap-8 sm:flex-row sm:items-center md:gap-12 lg:w-auto">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={24} height={24} />
                <div className="flex flex-col">
                  <Skeleton variant="text" width={110} height={18} />
                  <Skeleton variant="text" width={40} height={20} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={24} height={24} />
                <div className="flex flex-col">
                  <Skeleton variant="text" width={110} height={18} />
                  <Skeleton variant="text" width={100} height={20} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" width={90} height={20} />
              </div>
            </div>

            <div className="flex w-full justify-end lg:w-sm">
              <Skeleton variant="rectangular" width="100%" height={45} sx={{ borderRadius: "12px" }} />
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default ActivityDetailsLoader;
