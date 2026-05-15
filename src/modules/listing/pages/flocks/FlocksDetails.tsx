import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { flockActivities, flockDetail } from "../../../../constants/data";
import { Icons } from "../../../../constants/icons";
import DetailsTopNav from "../../components/DetailsTopNav";
import SidebarCalendar from "../../components/flocks/SidebarCalendar";
import { Link } from "react-router";

const FlocksDetails = () => {
  const [value] = useState<Dayjs | null>(dayjs());

  const filteredActivities = flockActivities.filter((activity) => {
    if (!value) return true;

    return (
      dayjs(activity.startDate).format("YYYY-MM-DD") ===
      value.format("YYYY-MM-DD")
    );
  });

  useEffect(() => {
    document.title = "Flock Details | Flockn Go";
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
                <h2 className="text-[28px] font-semibold">
                  {flockDetail?.name}
                </h2>

                <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-primary-dark/70">
                  {flockDetail?.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[15px] text-primary-dark/80">
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

                  <span className="text-xs text-primary-dark/70">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-6">
          <div className="flex gap-6">
            {/* SIDEBAR */}
            <aside className="hidden w-sm shrink-0 lg:block">
              <div className="sticky top-4 space-y-4">
                <SidebarCalendar />
              </div>
            </aside>

            {/* ACTIVITIES */}
            <main className="flex-1 rounded-xl bg-primary p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-base font-medium bg-linear-to-bl from-btn-light to-btn01 to-65% bg-clip-text text-transparent">MAY 2026</h2>

                <p className="text-sm text-primary-dark/60">
                  {filteredActivities.length} Activities Found
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                {Array.from({ length: 50 }).map((_, index) => {
                  const activity =
                    flockActivities[index % flockActivities.length];

                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-4 rounded-3xl hover:scale-105 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                    >

                      <div className="">
                      <p className="font-semibold text-base">
                        {dayjs(activity.endDate).format("ddd, MMM D")}
                      </p>
                      </div>
                      <div className="flex items-center gap-4">

                      {/* IMAGE */}
                      <img
                        src={activity.coverImage}
                        alt={activity.title}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />
                      <div className="">
                          <div className="flex flex-col items-start justify-between gap-2">
                            <h3 className="text-lg font-semibold">
                              {activity.title.slice(0, 12).trim() }{activity.title.toString().length > 12 && "..."}
                            </h3>

                            <span className={`rounded-full ${activity.status === "draft" ? "bg-btn-biget03/50 border-2 border-btn-biget03" : activity.status === "scheduled" ? "bg-btn-biget01/50 border-2 border-btn-biget01" : "bg-btn-biget02/50 border-2 border-btn-biget02" } px-3 py-1 text-xs font-medium text-secondary`}>
                              {activity.status}
                            </span>
                          </div>
                      </div>
                      </div>
                    </div>
                  );
                })}

                {filteredActivities.length === 0 && (
                  <div className="rounded-3xl border bg-primary p-10 text-center shadow-sm">
                    <p className="text-primary-dark/60">
                      No activities found for selected date.
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlocksDetails;
