import { useEffect } from "react";
import dayjs from "dayjs";
import { Icons } from "../../../../constants/icons";
import DetailsTopNav from "../../components/DetailsTopNav";
import SidebarCalendar from "../../components/flocks/SidebarCalendar";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getFlockDetails } from "../../../../store/slices/flockSlice";
import FlockDetailsLoader from "../../../../components/common/FlockDetailsLoader";
import { images } from "../../../../constants/images";
import ErrorState from "../../../../components/common/ErrorState";
import type { ActivityItem } from "../../../../store/slices/activitySlice";
import DetailBanner from "../../components/common/DetailBanner";
import { useSEO } from "../../../../hooks/useSEO";

const FlocksDetails = () => {
  const { id } = useParams();
  const flockId = Number(id);
  const { selected_flock, selected_flock_id, selected_flock_loading, error, errorStatus } = useAppSelector(
    (state) => state.flock
  );
  const dispatch = useAppDispatch();

  // DetailBanner handles cover image fallback state internally.

  useEffect(() => {
    if (selected_flock_id !== flockId) {
      dispatch(getFlockDetails(flockId));
    }
  }, [dispatch, flockId, selected_flock_id]);

  useSEO({
    title: selected_flock?.flock_details?.flock_name
      ? `${selected_flock.flock_details.flock_name} | FlocknGo`
      : "Flock Details | FlocknGo",
    description: selected_flock?.flock_details?.description
      ? selected_flock.flock_details.description.slice(0, 160)
      : "Discover local community groups and activities with FlocknGo.",
    keywords: selected_flock?.flock_details?.flock_name
      ? `${selected_flock.flock_details.flock_name}, social group, community meetup`
      : "social group, community meetup",
    ogImage: selected_flock?.flock_details?.cover_image_s3key || undefined,
  });

  if (selected_flock_loading) {
    return <FlockDetailsLoader />;
  }

  if (error && !selected_flock) {
    const isNotFound =
      errorStatus === 404 ||
      error.toLowerCase().includes("not found") ||
      error.toLowerCase().includes("does not exist");

    if (isNotFound) {
      return (
        <>
          <DetailsTopNav />
          <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F9F9F9] p-6">
            <div className="animate-fade-in mx-auto my-12 flex max-w-md flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xs">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <Icons.serarch1 size={32} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-800">Flock Not Found</h3>
              <p className="mb-8 max-w-xs text-sm leading-relaxed text-slate-500">
                This flock may have been deleted, or the URL link you followed might be incorrect.
              </p>
              <Link
                to="/flocks"
                className="from-btn02 to-btn01 flex cursor-pointer items-center gap-2 rounded-2xl bg-linear-to-tr px-6 py-3 font-semibold text-white shadow-md shadow-orange-500/10 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Go to Flocks
              </Link>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
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
        <DetailBanner
          coverImage={selected_flock?.flock_details?.cover_image_s3key}
          altText={selected_flock?.flock_details?.flock_name}
        />

        <div className="bg-primary px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-3">
              <div>
                <h1 className="text-[28px] font-semibold">{selected_flock?.flock_details?.flock_name}</h1>

                <p className="text-primary-dark/70 mt-1 max-w-2xl text-[15px] leading-relaxed">
                  {selected_flock?.flock_details?.description}
                </p>
              </div>

              <div className="text-primary-dark/80 flex items-center gap-2 text-[15px]">
                <Icons.users width={22} height={22} className="text-secondary" />

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
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <button className="hover:bg-secondary/10 flex size-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95">
                    {item.icon}
                  </button>

                  <span className="text-primary-dark/70 text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex gap-6">
            <aside className="hidden w-sm shrink-0 lg:block">
              <div className="sticky top-4 space-y-4">
                <SidebarCalendar />
              </div>
            </aside>

            <main className="bg-primary flex-1 rounded-xl p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="from-btn-light to-btn01 bg-linear-to-bl to-65% bg-clip-text text-base font-medium text-transparent">
                  MAY 2026
                </h2>

                <p className="text-primary-dark/60 text-sm">
                  {selected_flock?.public_activities?.length} Activities Found
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                {selected_flock?.public_activities?.map((activity: ActivityItem, index: number) => {
                  return (
                    <Link
                      to={`/flocks/${id}/activities/${activity?.id}/detail`}
                      key={index}
                      className="flex cursor-pointer flex-col gap-4 rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:scale-105 hover:p-2 hover:shadow-md"
                    >
                      <div className="">
                        <p className="text-base font-semibold">{dayjs(activity?.created_at).format("ddd, MMM D")}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <img
                          src={activity?.cover_image[0] || images.not_found}
                          alt={activity?.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = images.not_found;
                          }}
                          className="h-24 w-24 rounded-2xl object-cover"
                        />
                        <div className="">
                          <div className="flex flex-col items-start justify-between gap-2">
                            <h3 className="text-lg font-semibold text-nowrap">
                              {activity?.name.slice(0, 12).trim()}
                              {activity?.name.toString().length > 12 && "..."}
                            </h3>

                            <span
                              className={`rounded-full ${activity?.current_tab === "draft" ? "bg-btn-biget03/50 border-btn-biget03 border-2" : activity?.current_tab === "ONGOING" ? "bg-btn-biget01/50 border-btn-biget01 border-2" : "bg-btn-biget02/50 border-btn-biget02 border-2"} text-secondary px-3 py-1 text-xs font-medium`}
                            >
                              {activity?.current_tab}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}

                {selected_flock?.public_activities?.length === 0 && (
                  <div className="bg-primary rounded-3xl border p-10 text-center shadow-sm">
                    <p className="text-primary-dark/60">No activities found for selected date.</p>
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
