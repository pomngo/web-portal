import { Icons } from "../../../../constants/icons";
import DetailsTopNav from "../../components/DetailsTopNav";
import dayjs from "dayjs";
import { useParams, Link } from "react-router-dom";
import ActivityDetailsLoader from "../../../../components/common/ActivityDetailsLoader";
import ErrorState from "../../../../components/common/ErrorState";
import DetailBanner from "../../components/common/DetailBanner";
import { useSEO } from "../../../../hooks/useSEO";
import { useActivityDetails } from "../../../../hooks/useActivitiesQuery";

const ActivitiesDetails = () => {
  const { id } = useParams();
  const activityId = Number(id);

  const {
    data: selected_activities,
    isLoading: selected_activities_loading,
    error,
    refetch,
  } = useActivityDetails(activityId);

  useSEO({
    title: selected_activities?.name
      ? `${selected_activities.name} | FlocknGo`
      : "Activity Details | FlocknGo",
    description: selected_activities?.description
      ? selected_activities.description.slice(0, 160)
      : "Discover local community activities and events with FlocknGo.",
    keywords: selected_activities?.name
      ? `${selected_activities.name}, local activity, community events`
      : "local activity, community events",
    ogImage: selected_activities?.cover_image?.[0] || undefined,
  });

  if (selected_activities_loading) {
    return <ActivityDetailsLoader />;
  }

  if (error && !selected_activities) {
    const axiosError = error as any;
    const errorStatus = axiosError?.response?.status;
    const errorMsg = axiosError?.response?.data?.message || axiosError?.message || "";

    const isNotFound =
      errorStatus === 404 ||
      errorMsg.toLowerCase().includes("not found") ||
      errorMsg.toLowerCase().includes("does not exist");

    if (isNotFound) {
      return (
        <>
          <DetailsTopNav />
          <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F9F9F9] p-6">
            <div className="animate-fade-in mx-auto my-12 flex max-w-md flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xs">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <Icons.serarch1 size={32} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-800">Activity Not Found</h3>
              <p className="mb-8 max-w-xs text-sm leading-relaxed text-slate-500">
                This activity may have been deleted, or the URL link you followed might be incorrect.
              </p>
              <Link
                to="/activities"
                className="from-btn02 to-btn01 flex cursor-pointer items-center gap-2 rounded-2xl bg-linear-to-tr px-6 py-3 font-semibold text-white shadow-md shadow-orange-500/10 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Go to Activities
              </Link>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <ErrorState
          title="Activity Details Unavailable"
          message={errorMsg}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <>
      <DetailsTopNav />

      <div className="min-h-screen bg-[#F9F9F9]">
        <DetailBanner coverImage={selected_activities?.cover_image?.[0]} altText={selected_activities?.name} />
        <div className="bg-primary px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-3">
              <div>
                <h1 className="text-primary-dark/80 text-[24px] font-bold">{selected_activities?.name}</h1>

                <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-black/70">
                  {selected_activities?.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-4 text-base font-medium">
                  <div className="flex items-center gap-1">
                    {" "}
                    <Icons.map size={17} /> <span className="">{selected_activities?.campaign_location}</span>
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
                <Icons.users width={22} height={22} className="text-secondary" />

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
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <button className="hover:bg-secondary/10 flex size-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95">
                    {item.icon}
                  </button>

                  <span className="text-xs text-black/70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex gap-6">
            <main className="bg-primary flex flex-1 flex-col items-start justify-between gap-6 rounded-xl p-6 shadow-xs md:p-8 lg:flex-row lg:items-center">
              <div className="text-md flex w-full flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center sm:gap-8 md:gap-12 lg:w-auto">
                <div className="flex flex-col items-start gap-2 text-base font-normal text-black/80 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-2">
                    <Icons.users width={22} height={22} className="text-secondary" />
                    <span className="text-secondary/80">Max Participants</span>
                  </div>
                  <p className="pl-8 font-medium sm:pl-0">
                    {selected_activities?.max_participants || selected_activities?.max_size || "N/A"}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-2 text-base font-normal text-black/80 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-2">
                    <Icons.calendar width={22} height={22} className="text-secondary" />
                    <span className="text-secondary/80">Last Date to Join</span>
                  </div>
                  <p className="pl-8 font-medium text-nowrap sm:pl-0">
                    {selected_activities?.end_date_time
                      ? dayjs(selected_activities.end_date_time).format("D ddd, MMM YYYY")
                      : "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-base font-normal text-black/80">
                  <Icons.link size={17} className="text-secondary" />
                  <span className="hover:text-btn01 cursor-pointer text-nowrap underline underline-offset-4 transition-colors">
                    Social Links
                  </span>
                </div>
              </div>

              <div className="flex w-full justify-end lg:w-sm">
                <button className="from-btn01 to-btn02 text-md w-full cursor-pointer rounded-xl bg-linear-to-tl to-75% px-6 py-3 font-semibold text-white shadow-xs transition-all duration-300 hover:scale-[1.02] active:scale-95">
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
