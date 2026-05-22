import Skeleton from "@mui/material/Skeleton";

const ActivityDetailsLoader = () => {
  return (
    <section className="w-full min-h-screen bg-[#F9F9F9]">
      <div className="relative h-96 w-full flex justify-center items-center">
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          className="lg:w-[90%] lg:rounded-b-xl"
          sx={{ bgcolor: "rgba(0, 0, 0, 0.06)", height: "100%" }}
        />
      </div>

      <div className="bg-white px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16 border-b border-gray-100">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-3 w-full lg:max-w-2xl">
            <div>
              <Skeleton variant="text" width="60%" height={40} />
              
              <div className="mt-2 space-y-1.5">
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="75%" height={20} />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <Skeleton variant="text" width={150} height={24} />
              <Skeleton variant="text" width={150} height={24} />
            </div>

            <div className="flex items-center gap-2 mt-1">
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

      <div className="py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-2">
        <div className="flex gap-6">
          <main className="flex-1 rounded-xl bg-white p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 md:gap-12 w-full lg:w-auto">
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

            <div className="w-full lg:w-sm flex justify-end">
              <Skeleton
                variant="rectangular"
                width="100%"
                height={45}
                sx={{ borderRadius: "12px" }}
              />
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default ActivityDetailsLoader;
