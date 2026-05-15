import { useEffect } from "react";
import { flockDetail } from "../../../../constants/data";
import { Icons } from "../../../../constants/icons";
import DetailsTopNav from "../../components/DetailsTopNav";

const ActivitiesDetails = () => {
  useEffect(() => {
    document.title = "Activities Details | Flockn Go";
  }, []);
  return (
    <>
      <DetailsTopNav />

      <div className="min-h-screen bg-[#F9F9F9]">
        {/* COVER IMAGE */}
        <div
          className="relative h-[300px] overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `url(${flockDetail.coverImage})`,
            backgroundPosition: "center",
            backgroundPositionY: "center",
          }}
        >
          {/* <img src={flockDetail.coverImage} alt="" className="h-full w-full" /> */}
          <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/60 to-transparent" />
        </div>

        {/* FLOCK INFO */}
        <div className="bg-primary px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            {/* LEFT */}
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-[24px] font-bold text-primary-dark/80">
                  {flockDetail?.name}
                </h2>

                <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-black/70">
                  {flockDetail?.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-4 text-base font-medium">
                  <div className="flex items-center gap-1">
                    {" "}
                    <Icons.map size={17} />{" "}
                    <span className="">Pawana lake, Pune</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {" "}
                    <Icons.watch size={17} />{" "}
                    <span className="">13 May, 2026 6AM</span>
                  </div>
                </div>
                <div className=""></div>
              </div>

              <div className="flex items-center gap-2 text-base font-normal text-black/80">
                <Icons.users
                  width={22}
                  height={22}
                  className="text-secondary"
                />

                <span className="underline underline-offset-4">
                  {flockDetail.membersCount} Members
                </span>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-5">
              {[
                {
                  icon: <Icons.flag />,
                  label: "Updates",
                },
                {
                  icon: <Icons.film />,
                  label: "Polls",
                },
                {
                  icon: <Icons.camera />,
                  label: "Gallery",
                },
                {
                  icon: <Icons.heartHandshake />,
                  label: "Files",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2"
                >
                  <button className="flex size-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 hover:bg-secondary/10 active:scale-95">
                    {item.icon}
                  </button>

                  <span className="text-xs text-black/70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className=" py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-2">
          <div className="flex gap-6">
            {/* ACTIVITIES */}
            <main className="flex-1 rounded-xl bg-primary p-8 flex flex-col lg:flex-row justify-between">
              <div className="mb-6 flex items-center text-md gap-8 justify-between">
                <div className="flex flex-col lg:flex-row items-center gap-8 text-base font-normal text-black/80">
                  <div className="flex flex-col lg:flex-row text-center gap-2 items-center">
                    <Icons.users
                      width={22}
                      height={22}
                      className="text-secondary"
                    />

                    <span className=" text-secondary/80">Max Participants</span>
                  </div>
                  <p className=" font-medium">Unlimited</p>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-8 text-base font-normal text-black/80">
                  <div className="flex flex-col lg:flex-row text-center items-center gap-2">
                    <Icons.calendar
                      width={22}
                      height={22}
                      className="text-secondary"
                    />

                    <span className=" text-secondary/80">
                      Last Date to Join
                    </span>
                  </div>
                  <p className="font-medium text-nowrap">10 May, 2025</p>
                </div>
                <div className="flex flex-col lg:flex-row text-center items-center gap-2 text-base font-normal text-black/80">
                  <Icons.link size={17} className="text-secondary" />

                  <span className="underline underline-offset-4 text-nowrap">
                    Social Links
                  </span>
                </div>
              </div>
              <div className="mb-6 flex items-center justify-between">
                <button className="bg-linear-to-tl from-btn01 to-btn02 to-75% rounded-xl p-2.5 w-full lg:w-sm text-white text-md font-medium">
                  Join
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivitiesDetails;
