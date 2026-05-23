import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Icons } from "../../../../constants/icons";
import DetailsTopNav from "../../components/DetailsTopNav";
import SidebarCalendar from "../../components/flocks/SidebarCalendar";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getFlockDetails } from "../../../../store/slices/flockSlice";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import FlockDetailsLoader from "../../../../components/common/FlockDetailsLoader";
import { images } from "../../../../constants/images";
import ErrorState from "../../../../components/common/ErrorState";

const FlocksDetails = () => {
  const { id } = useParams();
  const flockId = Number(id);
  const { selected_flock, selected_flock_id, selected_flock_loading, error, errorStatus } = useAppSelector((state) => state.flock);
  const dispatch = useAppDispatch();

  const [isCoverFallback, setIsCoverFallback] = useState(false);
  const isFallback = !selected_flock?.flock_details?.cover_image_s3key || isCoverFallback;

  useEffect(() => {
    if (selected_flock_id !== flockId) {
      dispatch(getFlockDetails(flockId));
    }
  }, [dispatch, flockId, selected_flock_id]);

  useEffect(() => {
    document.title = "Flock Details | Flockn Go";
  }, []);

  if (selected_flock_loading) {
    return <FlockDetailsLoader />;
  }

  if (error && !selected_flock) {
    const isNotFound = errorStatus === 404 || error.toLowerCase().includes("not found") || error.toLowerCase().includes("does not exist");
    
    if (isNotFound) {
      return (
        <>
          <DetailsTopNav />
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#F9F9F9]">
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-100 rounded-3xl shadow-xs max-w-md mx-auto my-12 animate-fade-in">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-6">
                <Icons.serarch1 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Flock Not Found</h3>
              <p className="text-slate-500 text-sm mb-8 max-w-xs leading-relaxed">
                This flock may have been deleted, or the URL link you followed might be incorrect.
              </p>
              <Link
                to="/flocks"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold bg-linear-to-tr from-btn02 to-btn01 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-orange-500/10 cursor-pointer"
              >
                Go to Flocks
              </Link>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <ErrorState
          title="Flock Details Unavailable"
          message={error}
          onRetry={() => dispatch(getFlockDetails(flockId))}
        />
      </div>
    );
  }

  return (
    <>
      <DetailsTopNav />

      <div className="min-h-screen bg-[#F9F9F9]">
        <div
          className="relative h-96 overflow-hidden bg-cover bg-center flex justify-center items-center bg-linear-to-b from-[10%_15%] via-nav02 to-nav01"
        >
          <img
            src={selected_flock?.flock_details?.cover_image_s3key ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(selected_flock?.flock_details?.cover_image_s3key) : images.not_found}
            alt={selected_flock?.flock_details?.flock_name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = images.not_found;
              setIsCoverFallback(true);
            }}
            className={`h-full w-full lg:w-[90%] lg:rounded-b-xl ${isFallback ? "object-contain bg-slate-50 p-6" : "object-cover"}`}
          />
          {
            selected_flock?.flock_details?.cover_image_s3key && <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/60 to-transparent lg:w-[90%]  lg:left-[5%] lg:rounded-b-xl" />
          }

        </div>

        <div className="bg-primary px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-[28px] font-semibold">
                  {selected_flock?.flock_details?.flock_name}
                </h2>

                <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-primary-dark/70">
                  {selected_flock?.flock_details?.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[15px] text-primary-dark/80">
                <Icons.users
                  width={22}
                  height={22}
                  className="text-secondary"
                />

                <span className="underline underline-offset-4">
                  {selected_flock?.flock_details?.participants_count || 0} Members
                </span>
              </div>
            </div>

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

        <div className="px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-6">
          <div className="flex gap-6">
            <aside className="hidden w-sm shrink-0 lg:block">
              <div className="sticky top-4 space-y-4">
                <SidebarCalendar />
              </div>
            </aside>

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

                        <img
                          src={activity?.cover_image[0] || images.not_found}
                          alt={activity?.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = images.not_found;
                          }}
                          className="h-24 w-24 rounded-2xl object-cover"
                        />
                        <div className="">
                          <div className="flex flex-col items-start justify-between gap-2">
                            <h3 className="text-lg text-nowrap font-semibold">
                              {activity?.name.slice(0, 12).trim()}{activity?.name.toString().length > 12 && "..."}
                            </h3>

                            <span className={`rounded-full ${activity?.current_tab === "draft" ? "bg-btn-biget03/50 border-2 border-btn-biget03" : activity?.current_tab === "ONGOING" ? "bg-btn-biget01/50 border-2 border-btn-biget01" : "bg-btn-biget02/50 border-2 border-btn-biget02"} px-3 py-1 text-xs font-medium text-secondary`}>
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
