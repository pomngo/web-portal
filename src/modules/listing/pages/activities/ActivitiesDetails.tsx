import { useEffect } from "react";
import { Icons } from "../../../../constants/icons";
import DetailsTopNav from "../../components/DetailsTopNav";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getActivitiesDetails } from "../../../../store/slices/activitySlice";
import dayjs from "dayjs";
import { useParams, Link } from "react-router-dom";
import ActivityDetailsLoader from "../../../../components/common/ActivityDetailsLoader";
import ErrorState from "../../../../components/common/ErrorState";
import DetailBanner from "../../components/common/DetailBanner";

const ActivitiesDetails = () => {
  const { id } = useParams();
  const activityId = Number(id);
  const { selected_activities, selected_activities_id, selected_activities_loading, error, errorStatus } = useAppSelector((state) => state.activities);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selected_activities_id !== activityId) {
      dispatch(getActivitiesDetails(activityId));
    }
  }, [dispatch, activityId, selected_activities_id]);

  useEffect(() => {
    document.title = "Activities Details | Flockn Go";
  }, []);

  if (selected_activities_loading) {
    return <ActivityDetailsLoader />;
  }

  if (error && !selected_activities) {
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
              <h3 className="text-xl font-bold text-slate-800 mb-2">Activity Not Found</h3>
              <p className="text-slate-500 text-sm mb-8 max-w-xs leading-relaxed">
                This activity may have been deleted, or the URL link you followed might be incorrect.
              </p>
              <Link
                to="/activities"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold bg-linear-to-tr from-btn02 to-btn01 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-orange-500/10 cursor-pointer"
              >
                Go to Activities
              </Link>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <ErrorState
          title="Activity Details Unavailable"
          message={error}
          onRetry={() => dispatch(getActivitiesDetails(activityId))}
        />
      </div>
    );
  }
  return (
    <>
      <DetailsTopNav />

      <div className="min-h-screen bg-[#F9F9F9]">
        <DetailBanner
          coverImage={selected_activities?.cover_image?.[0]}
          altText={selected_activities?.name}
        />
        <div className="bg-primary px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-[24px] font-bold text-primary-dark/80">
                  {selected_activities?.name}
                </h2>

                <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-black/70">
                  {selected_activities?.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-4 text-base font-medium">
                  <div className="flex items-center gap-1">
                    {" "}
                    <Icons.map size={17} />{" "}
                    <span className="">{selected_activities?.campaign_location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {" "}
                    <Icons.watch size={17} />{" "}
                    <span className="">{dayjs(selected_activities?.created_at).format("D ddd, MMM YYYY")}</span>
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
                  {selected_activities?.flock_members_count || 0} Members
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

                  <span className="text-xs text-black/70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-2">
          <div className="flex gap-6">
            <main className="flex-1 rounded-xl bg-primary p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-xs">
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center text-md gap-6 sm:gap-8 md:gap-12 w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-base font-normal text-black/80">
                  <div className="flex items-center gap-2">
                    <Icons.users
                      width={22}
                      height={22}
                      className="text-secondary"
                    />
                    <span className="text-secondary/80">Max Participants</span>
                  </div>
                  <p className="font-medium pl-8 sm:pl-0">
                    {selected_activities?.max_participants || selected_activities?.max_size || "N/A"}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-base font-normal text-black/80">
                  <div className="flex items-center gap-2">
                    <Icons.calendar
                      width={22}
                      height={22}
                      className="text-secondary"
                    />
                    <span className="text-secondary/80">Last Date to Join</span>
                  </div>
                  <p className="font-medium pl-8 sm:pl-0 text-nowrap">
                    {selected_activities?.end_date_time
                      ? dayjs(selected_activities.end_date_time).format("D ddd, MMM YYYY")
                      : "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-base font-normal text-black/80">
                  <Icons.link size={17} className="text-secondary" />
                  <span className="underline underline-offset-4 text-nowrap cursor-pointer hover:text-btn01 transition-colors">
                    Social Links
                  </span>
                </div>
              </div>

              <div className="w-full lg:w-sm flex justify-end">
                <button className="bg-linear-to-tl from-btn01 to-btn02 to-75% rounded-xl py-3 px-6 w-full text-white text-md font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs">
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
