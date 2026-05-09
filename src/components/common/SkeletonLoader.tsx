import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const SkeletonLoader = () => {
  return (
    <main className="min-h-screen px-16 py-10 flex flex-col gap-20">
      {/* Filter Buttons */}
      <section className="flex justify-center gap-4 flex-wrap">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            width={140}
            height={48}
            sx={{
              borderRadius: "999px",
            }}
          />
        ))}
      </section>

      {/* Community Flocks */}
      <section>
        {/* Heading */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" width={280} height={45} />

            <Skeleton variant="text" width={380} height={28} />
          </div>

          <Skeleton variant="text" width={90} height={35} />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Large Left Card */}
          <div className="md:col-span-4">
            <Skeleton
              variant="rounded"
              width="100%"
              height={365}
              sx={{ borderRadius: "28px" }}
            />
          </div>

          {/* Middle Cards */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton
                variant="rounded"
                width="100%"
                height={170}
                sx={{ borderRadius: "28px" }}
              />

              <Skeleton
                variant="rounded"
                width="100%"
                height={170}
                sx={{ borderRadius: "28px" }}
              />
            </div>

            <Skeleton
              variant="rounded"
              width="100%"
              height={180}
              sx={{ borderRadius: "28px" }}
            />
          </div>

          {/* Right Card */}
          <div className="md:col-span-2">
            <Skeleton
              variant="rounded"
              width="100%"
              height={365}
              sx={{ borderRadius: "28px" }}
            />
          </div>
        </div>
      </section>

      {/* Explore Activities */}
      <section>
        {/* Heading */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" width={260} height={45} />

            <Skeleton variant="text" width={400} height={28} />
          </div>

          <Skeleton variant="text" width={90} height={35} />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="
                flex flex-col gap-4
                rounded-3xl border border-slate-200
                bg-white p-4
              "
            >
              <Skeleton
                variant="rounded"
                width="100%"
                height={220}
                sx={{ borderRadius: "20px" }}
              />

              <div className="flex flex-col gap-2">
                <Skeleton variant="text" width="80%" height={32} />

                <Skeleton variant="text" width="60%" height={20} />

                <Skeleton variant="text" width="70%" height={20} />
              </div>

              <Skeleton
                variant="rounded"
                width="100%"
                height={44}
                sx={{ borderRadius: "14px" }}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default SkeletonLoader;
