import Skeleton from "@mui/material/Skeleton";

const FlockDetailsLoader = () => {
  return (
    <section className="w-full">
      {/* Cover Image */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={260}
        sx={{ borderRadius: "0px" }}
      />

      {/* Flock Info */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-3">
            <Skeleton variant="text" width={280} height={45} />

            <Skeleton variant="text" width={180} height={24} />

            <Skeleton variant="text" width={120} height={24} />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2"
              >
                <Skeleton variant="circular" width={28} height={28} />

                <Skeleton variant="text" width={50} height={18} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-6">
              <Skeleton variant="text" width={100} height={30} />

              <div className="flex gap-2">
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="circular" width={28} height={28} />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: 35 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="circular"
                  width={28}
                  height={28}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="lg:col-span-9">
          <div className="rounded-3xl border border-gray-200 p-6 min-h-105">
            <div className="flex items-center justify-between mb-6">
              <Skeleton variant="text" width={140} height={35} />

              <Skeleton variant="text" width={120} height={24} />
            </div>

            <div className="flex flex-col gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 p-4"
                >
                  <div className="flex gap-4">
                    <Skeleton
                      variant="rounded"
                      width={120}
                      height={90}
                      sx={{ borderRadius: "14px" }}
                    />

                    <div className="flex-1 flex flex-col gap-2">
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={30}
                      />

                      <Skeleton
                        variant="text"
                        width="40%"
                        height={22}
                      />

                      <Skeleton
                        variant="text"
                        width="80%"
                        height={22}
                      />
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