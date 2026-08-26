import { useState } from "react";
import { Icons } from "../../../../constants/icons";
import DetailsTopNav from "../../components/DetailsTopNav";
import dayjs from "dayjs";
import { useParams, Link } from "react-router-dom";
import ActivityDetailsLoader from "../../../../components/common/ActivityDetailsLoader";
import ErrorState from "../../../../components/common/ErrorState";
import DetailBanner from "../../components/common/DetailBanner";
import { useSEO } from "../../../../hooks/useSEO";
import { useActivityDetails } from "../../../../hooks/useActivitiesQuery";
import JoinPromptPopup from "../../components/common/JoinPromptPopup";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import * as Tooltip from "@radix-ui/react-tooltip";
import { handleExternalRedirect } from "../../../../constants/urls";

const ActivitiesDetails = () => {
  const { id } = useParams();
  const activityId = Number(id);

  const [isJoinPopupOpen, setIsJoinPopupOpen] = useState(false);
  const [joinPopupMessage, setJoinPopupMessage] = useState("");

  const handleActionClick = (label: string) => {
    setJoinPopupMessage(`Join us first then you can see ${label.toLowerCase()} and all things`);
    setIsJoinPopupOpen(true);
  };

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
    ogImage:
      selected_activities?.cover_image?.[0] ||
      (selected_activities?.last_cover_image
        ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(selected_activities.last_cover_image)
        : undefined),
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
        <DetailBanner
          coverImage={
            selected_activities?.cover_image?.[0] ||
            (selected_activities?.last_cover_image
              ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(selected_activities.last_cover_image)
              : undefined)
          }
          altText={selected_activities?.name}
        />
        <div className="bg-primary px-4 py-6 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center max-w-7xl mx-auto">
            <div className="flex flex-col gap-3">
              <div>
                <h1 className="text-primary-dark/90 text-xl sm:text-2xl lg:text-3xl font-bold">{selected_activities?.name}</h1>

                <p className="mt-1.5 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-black/70">
                  {selected_activities?.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm md:text-base font-medium text-black/80">
                <div className="flex items-center gap-1.5">
                  <Icons.map size={16} className="text-[#EF7F23] flex-shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{selected_activities?.campaign_location || "Location N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icons.watch size={16} className="text-[#EF7F23] flex-shrink-0" />
                  <span>
                    {selected_activities?.end_date_time
                      ? dayjs(selected_activities.end_date_time).format("D ddd, MMM YYYY")
                      : selected_activities?.end_date
                      ? dayjs(selected_activities.end_date).format("D ddd, MMM YYYY")
                      : dayjs(selected_activities?.created_at).format("D ddd, MMM YYYY")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base font-semibold text-slate-700">
                <Icons.users width={20} height={20} className="text-[#EF7F23]" />
                <span className="underline underline-offset-4 cursor-pointer" onClick={() => handleActionClick("Members")}>
                  {selected_activities?.joined_member_count ?? selected_activities?.flock_members_count ?? 0} Members Joined
                </span>
              </div>
            </div>

            <Tooltip.Provider delayDuration={150}>
              <div className="flex items-center gap-3 sm:gap-5 self-start lg:self-center">
                {[
                  {
                    icon: <Icons.update className="h-5 w-5 text-[#EF7F23]" />,
                    label: "Updates",
                  },
                  {
                    icon: <Icons.polls className="h-5 w-5 text-[#EF7F23]" />,
                    label: "Polls",
                  },
                  {
                    icon: <Icons.chat className="h-5 w-5 text-[#EF7F23]" />,
                    label: "Chat",
                  },
                ].map((item) => (
                  <Tooltip.Root key={item.label}>
                    <Tooltip.Trigger asChild>
                      <div className="flex flex-col items-center gap-1.5">
                        <button
                          onClick={() => handleActionClick(item.label)}
                          className="bg-white hover:bg-orange-50 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl shadow-xs border border-slate-100 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          {item.icon}
                        </button>
                        <span className="text-[11px] font-semibold text-slate-700">{item.label}</span>
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        sideOffset={5}
                        className="rt-TooltipContent z-50 max-w-48 text-center bg-slate-900/95 text-white text-[11px] rounded-lg py-2 px-3 shadow-lg font-medium leading-normal border border-slate-700/30 backdrop-blur-xs select-none"
                      >
                        Join us first then you can see {item.label.toLowerCase()} and all things
                        <Tooltip.Arrow className="fill-slate-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                ))}
              </div>
            </Tooltip.Provider>
          </div>
        </div>

        {/* Activity Highlights Bar */}
        <div className="mt-4 px-4 py-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-20 sm:pb-8">
          <div className="max-w-7xl mx-auto">
            <main className="bg-white flex flex-col items-start justify-between gap-6 rounded-3xl p-5 sm:p-6 md:p-8 shadow-xs border border-slate-100 lg:flex-row lg:items-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full lg:w-auto">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Icons.users width={20} height={20} className="text-[#EF7F23] flex-shrink-0" />
                  <div>
                    <span className="text-secondary/70 text-[11px] font-medium block">Max Participants</span>
                    <p className="font-bold text-slate-800 text-xs sm:text-sm">
                      {selected_activities?.max_participants || selected_activities?.max_size || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Icons.calendar width={20} height={20} className="text-[#EF7F23] flex-shrink-0" />
                  <div>
                    <span className="text-secondary/70 text-[11px] font-medium block">Last Date to Join</span>
                    <p className="font-bold text-slate-800 text-xs sm:text-sm">
                      {selected_activities?.ebd_date
                        ? dayjs(selected_activities.ebd_date).format("D MMM YYYY")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Icons.watch width={20} height={20} className="text-[#EF7F23] flex-shrink-0" />
                  <div>
                    <span className="text-secondary/70 text-[11px] font-medium block">Activity Timing</span>
                    <p className="font-bold text-slate-800 text-xs sm:text-sm">
                      {selected_activities?.end_date_time
                        ? dayjs(selected_activities.end_date_time).format("D MMM, h:mm A")
                        : selected_activities?.end_date
                        ? dayjs(selected_activities.end_date).format("D MMM YYYY")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Icons.link size={18} className="text-[#EF7F23] flex-shrink-0" />
                  <div>
                    <span className="text-secondary/70 text-[11px] font-medium block">Community Links</span>
                    <span className="hover:text-btn01 cursor-pointer font-bold text-xs sm:text-sm text-slate-800 underline underline-offset-2 transition-colors">
                      Social Links
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex w-full lg:w-48">
                <button
                  onClick={() => handleActionClick("Join Activity")}
                  className="from-btn01 to-btn02 text-sm sm:text-base w-full cursor-pointer rounded-2xl bg-linear-to-tl to-75% px-6 py-3.5 font-bold text-white shadow-md shadow-orange-500/10 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  Join Activity
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>

      <JoinPromptPopup
        isOpen={isJoinPopupOpen}
        onClose={() => setIsJoinPopupOpen(false)}
        message={joinPopupMessage}
        onJoin={handleExternalRedirect}
      />
    </>
  );
};

export default ActivitiesDetails;
