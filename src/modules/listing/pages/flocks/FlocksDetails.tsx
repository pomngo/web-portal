import { useEffect } from "react";
import dayjs from "dayjs";
import { Icons } from "../../../../constants/icons";
import DetailsTopNav from "../../components/DetailsTopNav";
import SidebarCalendar from "../../components/flocks/SidebarCalendar";
import { Link, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getFlockDetails } from "../../../../store/slices/flockSlice";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import FlockDetailsLoader from "../../../../components/common/FlockDetailsLoader";

const FlocksDetails = () => {
  const { id } = useParams();
  const { selected_flock, selected_flock_loading } = useAppSelector((state) => state.flock);
  const dispatch = useAppDispatch();
  
    useEffect(() => {
      dispatch(getFlockDetails(Number(id)));
    }, [dispatch]);

  useEffect(() => {
    document.title = "Flock Details | Flockn Go";
  }, []);

  if(selected_flock_loading){
    return <FlockDetailsLoader />
  }

  return (
    <>
      <DetailsTopNav />

      <div className="min-h-screen bg-[#F9F9F9]">
        {/* COVER IMAGE */}
        <div
          className="relative h-[300px] overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `url(${selected_flock?.cover_image_s3key ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(selected_flock?.cover_image_s3key) : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Objeomz7IceAvda_z3fdIwZo7_WiG_eHfg&s"})`,
            backgroundPosition: "center",
            backgroundPositionY: "center",
          }}
        >
          {/* <img src={selected_flock.coverImage} alt="" className="h-full w-full" /> */}
          <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/60 to-transparent" />
        </div>

        {/* FLOCK INFO */}
        <div className="bg-primary px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            {/* LEFT */}
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-[28px] font-semibold">
                  {selected_flock?.flock_name}
                </h2>

                <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-primary-dark/70">
                  {selected_flock?.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[15px] text-primary-dark/80">
                <Icons.users
                  width={22}
                  height={22}
                  className="text-secondary"
                />

                <span className="underline underline-offset-4">
                  {selected_flock?.participants_count} Members
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
                  {selected_flock?.public_activities?.length} Activities Found
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                {selected_flock?.public_activities?.map((activity: any, index: number) => {
                  return (
                    <Link to={`/flocks/${id}/activities/${activity?.id}/detail`}
                      key={index}
                      className="flex flex-col gap-4 rounded-3xl hover:scale-105 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:p-2"
                    >

                      <div className="">
                      <p className="font-semibold text-base">
                        {dayjs(activity?.created_at).format("ddd, MMM D")}
                      </p>
                      </div>
                      <div className="flex items-center gap-4">

                      {/* IMAGE */}
                      <img
                        src={activity?.cover_image[0] || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Objeomz7IceAvda_z3fdIwZo7_WiG_eHfg&s"}
                        alt={activity?.name}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />
                      <div className="">
                          <div className="flex flex-col items-start justify-between gap-2">
                            <h3 className="text-lg font-semibold">
                              {activity?.name.slice(0, 12).trim() }{activity?.name.toString().length > 12 && "..."}
                            </h3>

                            <span className={`rounded-full ${activity?.current_tab === "draft" ? "bg-btn-biget03/50 border-2 border-btn-biget03" : activity?.current_tab === "ONGOING" ? "bg-btn-biget01/50 border-2 border-btn-biget01" : "bg-btn-biget02/50 border-2 border-btn-biget02" } px-3 py-1 text-xs font-medium text-secondary`}>
                              {activity?.current_tab}
                            </span>
                          </div>
                      </div>
                      </div>
                    </Link>
                  );
                })}

                {selected_flock?.public_activities?.length === 0 && (
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
