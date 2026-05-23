import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const ScrollLoader = () => {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
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
    </section>
  )
}

export default ScrollLoader
