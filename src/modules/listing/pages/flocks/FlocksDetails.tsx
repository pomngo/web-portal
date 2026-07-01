import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { Icons } from "../../../../constants/icons";
import DetailsTopNav from "../../components/DetailsTopNav";
import SidebarCalendar from "../../components/flocks/SidebarCalendar";
import { Link, useParams, useNavigate } from "react-router-dom";
import FlockDetailsLoader from "../../../../components/common/FlockDetailsLoader";
import { images } from "../../../../constants/images";
import ErrorState from "../../../../components/common/ErrorState";
import type { ActivityItem } from "../../../../types";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import DetailBanner from "../../components/common/DetailBanner";
import { useSEO } from "../../../../hooks/useSEO";
import { useFlockDetails } from "../../../../hooks/useFlocksQuery";
import JoinPromptPopup from "../../components/common/JoinPromptPopup";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ChevronLeft, MoreVertical, MessageSquare } from "lucide-react";

const FlocksDetails = () => {
  const { id } = useParams();
  const flockId = Number(id);
  const navigate = useNavigate();

  const [isJoinPopupOpen, setIsJoinPopupOpen] = useState(false);
  const [joinPopupMessage, setJoinPopupMessage] = useState("");
  const [activeDetailsTab, setActiveDetailsTab] = useState<"activities" | "calendar">("activities");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const handleActionClick = (label: string) => {
    setJoinPopupMessage(`Join us first then you can see ${label.toLowerCase()} and all things`);
    setIsJoinPopupOpen(true);
  };

  const {
    data: selected_flock,
    isLoading: selected_flock_loading,
    error,
    refetch,
  } = useFlockDetails(flockId);

  // Group activities by month-year for desktop side-by-side view
  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityItem[]> = {};
    selected_flock?.public_activities?.forEach((activity: ActivityItem) => {
      const monthYear = dayjs(activity.created_at).format("MMMM YYYY");
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(activity);
    });
    return groups;
  }, [selected_flock?.public_activities]);

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
          message={errorMsg}
          onRetry={refetch}
        />
      </div>
    );
  }

  // Activity tags generation
  const activityNames = selected_flock?.public_activities?.map((a: any) => a.name) || [];
  const displayTags = activityNames.slice(0, 3).join(", ");
  const remainingCount = activityNames.length - 3;

  // Flock interests tags generation
  const flockInterests = selected_flock?.flock_details?.interests || [];
  const interestTags = flockInterests.map((i: any) => i.name) || [];
  const displayInterestTags = interestTags.slice(0, 3).join(", ");
  const remainingInterestCount = interestTags.length - 3;

  return (
    <>
      {/* Desktop view (>= lg) */}
      <div className="hidden lg:block">
        <DetailsTopNav />

        <div className="min-h-screen bg-[#F9F9F9] pb-16">
          <DetailBanner
            coverImage={selected_flock?.flock_details?.cover_image_s3key}
            altText={selected_flock?.flock_details?.flock_name}
            defaultImage={images.default_flock_banner}
          />

          {/* Details Row */}
          <div className="bg-primary px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="max-w-[1440px] mx-auto flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs font-bold text-[#EF7F23] tracking-wide mb-1.5 uppercase">
                    {interestTags.length > 0 ? (
                      <>#{displayInterestTags} {remainingInterestCount > 0 && <span className="text-[#EF7F23] font-bold">+{remainingInterestCount}</span>}</>
                    ) : activityNames.length > 0 ? (
                      <>#{displayTags} {remainingCount > 0 && <span className="text-[#EF7F23] font-bold">+{remainingCount}</span>}</>
                    ) : (
                      `# Community, Social, Meetup`
                    )}
                  </p>
                  <h1 className="text-[28px] font-semibold text-slate-800">{selected_flock?.flock_details?.flock_name}</h1>
                  <p className="text-slate-600 mt-1 max-w-2xl text-[15px] leading-relaxed">
                    {selected_flock?.flock_details?.description}
                  </p>
                </div>

                <div className="text-slate-700 flex items-center gap-2 text-[15px] font-semibold">
                  <Icons.users width={20} height={20} className="text-[#EF7F23]" />
                  <span className="underline underline-offset-4 cursor-pointer" onClick={() => handleActionClick("Members")}>
                    {selected_flock?.flock_details?.participants_count || 0} Members
                  </span>
                </div>
              </div>

              {/* Actions Grid with Tooltips */}
              <Tooltip.Provider delayDuration={150}>
                <div className="flex items-center gap-5">
                  {[
                    {
                      icon: <Icons.update />,
                      label: "Updates",
                    },
                    {
                      icon: <Icons.polls />,
                      label: "Polls",
                    },
                    {
                      icon: <Icons.gallery />,
                      label: "Gallery",
                    },
                    {
                      icon: <Icons.file />,
                      label: "Files",
                    },
                  ].map((item) => (
                    <Tooltip.Root key={item.label}>
                      <Tooltip.Trigger asChild>
                        <div className="flex flex-col items-center gap-2">
                          <button
                            onClick={() => handleActionClick(item.label)}
                            className="hover:bg-secondary/10 flex size-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            {item.icon}
                          </button>
                          <span className="text-primary-dark/70 text-xs font-semibold">{item.label}</span>
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

          {/* Two Column Layout: Calendar Sidebar & Activities Grid */}
          <div className="max-w-[1500px] mx-auto px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-6">
            <div className="grid grid-cols-12 gap-8">
              {/* Left Column (Calendar Sidebar) */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-4 xl:p-6 border border-slate-100 shadow-xs">
                  <SidebarCalendar activities={selected_flock?.public_activities} />
                </div>
              </div>

              {/* Right Column (Activities Grid) */}
              <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-100 shadow-xs flex flex-col gap-10">
                {Object.keys(groupedActivities).length > 0 ? (
                  Object.entries(groupedActivities).map(([monthYear, activities]) => (
                    <div key={monthYear} className="flex flex-col gap-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-lg font-bold text-[#EF7F23] tracking-wide">
                          {monthYear.toUpperCase()}
                        </h3>
                        <p className="text-slate-400 text-xs font-semibold">
                          {activities.length} {activities.length === 1 ? "Activity" : "Activities"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {activities.map((activity: ActivityItem) => {
                          const status = (activity?.status || activity?.current_tab || "ONGOING").toUpperCase();
                          return (
                            <Link
                              to={`/flocks/${id}/activities/${activity?.id}/detail`}
                              key={activity.id}
                              className="flex cursor-pointer flex-col gap-4 rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:scale-105 hover:p-2 hover:shadow-md"
                            >
                              <div className="">
                                <p className="text-base font-semibold text-slate-800 whitespace-nowrap">{dayjs(activity?.created_at).format("ddd, MMM D")}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <img
                                  src={
                                    activity?.last_cover_image
                                      ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(activity.last_cover_image)
                                      : activity?.cover_image?.[0] || images.default_flock_banner
                                  }
                                  alt={activity?.name}
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    (e.target as HTMLImageElement).src = images.default_flock_banner;
                                  }}
                                  className="h-24 w-24 rounded-2xl object-cover flex-shrink-0"
                                />
                                <div className="">
                                  <div className="flex flex-col items-start justify-between gap-2">
                                    <h3 className="text-lg font-semibold text-nowrap">
                                      {activity?.name.slice(0, 12).trim()}
                                      {activity?.name.toString().length > 12 && "..."}
                                    </h3>

                                    <span
                                      className={`rounded-full ${status === "DRAFT" ? "bg-btn-biget03/50 border-btn-biget03 border-2" : status === "ONGOING" || status === "LIVE" ? "bg-btn-biget01/50 border-btn-biget01 border-2" : "bg-btn-biget02/50 border-btn-biget02 border-2"} text-secondary px-3 py-1 text-xs font-medium`}
                                    >
                                      {status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <p className="text-lg font-semibold">No activities found</p>
                    <p className="text-sm mt-1">This community flock has no public activities yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet view (< lg) */}
      <div className="block lg:hidden min-h-screen bg-white">
        {/* Header Section */}
        <div
          className={`${
            selected_flock?.flock_details?.cover_image_s3key
              ? "h-56 p-4 flex flex-col justify-between"
              : "p-4 pb-8 flex flex-col gap-6"
          } bg-[#0e52d6] text-white rounded-b-[2.5rem] relative shadow-md overflow-hidden`}
        >
          {/* Background image if available */}
          {selected_flock?.flock_details?.cover_image_s3key && (
            <>
              <img
                src={ENDPOINTS.BASE_URL.BASE_IMAGE_URL(selected_flock.flock_details.cover_image_s3key)}
                alt={selected_flock?.flock_details?.flock_name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  (e.target as HTMLImageElement).src = images.default_flock_banner;
                }}
              />
              <div className="absolute inset-0 bg-black/30" />
            </>
          )}

          {/* Top Bar */}
          <div className="flex items-center justify-between relative z-10">
            <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-white/10 rounded-full transition cursor-pointer">
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => handleActionClick("Chat")} className="p-1.5 hover:bg-white/10 rounded-full transition cursor-pointer">
                <MessageSquare className="h-6 w-6 text-white" />
              </button>
              <button onClick={() => handleActionClick("Options")} className="p-1.5 hover:bg-white/10 rounded-full transition cursor-pointer">
                <MoreVertical className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          {/* Center Portrait Image Card (only if cover image is NOT available) */}
          {!selected_flock?.flock_details?.cover_image_s3key && (
            <div className="flex justify-center">
              <div className="bg-white p-1.5 rounded-3xl shadow-xl w-[140px] h-[190px] overflow-hidden flex items-center justify-center">
                <img
                  src={images.default_flock_banner}
                  alt={selected_flock?.flock_details?.flock_name}
                  className="w-full h-full object-cover rounded-[20px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Details Section (Beige background) */}
        <div className="bg-[#FAF5EF] px-6 py-6 flex flex-col gap-4">
          {/* Tags */}
          <p className="text-sm font-semibold text-[#EF7F23] tracking-wide">
            {interestTags.length > 0 ? (
              <>#{displayInterestTags} {remainingInterestCount > 0 && <span className="text-[#EF7F23] font-bold">+{remainingInterestCount}</span>}</>
            ) : activityNames.length > 0 ? (
              <>#{displayTags} {remainingCount > 0 && <span className="text-[#EF7F23] font-bold">+{remainingCount}</span>}</>
            ) : (
              `# Community, Social, Meetup`
            )}
          </p>

          {/* Title */}
          <h1 className="text-[26px] font-bold text-slate-800 leading-tight">
            {selected_flock?.flock_details?.flock_name}
          </h1>

          {/* Description */}
          <div className="text-slate-600 text-sm leading-relaxed">
            {selected_flock?.flock_details?.description ? (
              <>
                {isDescriptionExpanded ? (
                  selected_flock.flock_details.description
                ) : (
                  `${selected_flock.flock_details.description.slice(0, 100)}${selected_flock.flock_details.description.length > 100 ? '...' : ''}`
                )}
                {selected_flock.flock_details.description.length > 100 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-[#EF7F23] font-semibold ml-1 cursor-pointer hover:underline"
                  >
                    {isDescriptionExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </>
            ) : (
              "No description available."
            )}
          </div>

          {/* Members */}
          <div className="flex items-center gap-2 mt-1">
            <Icons.users className="text-[#EF7F23] h-5 w-5" />
            <span className="text-slate-700 text-sm font-semibold underline underline-offset-4 cursor-pointer" onClick={() => handleActionClick("Members")}>
              {selected_flock?.flock_details?.participants_count || 0} Members
            </span>
            <button onClick={() => handleActionClick("Invite")} className="text-[#EF7F23] text-lg font-bold p-1 leading-none cursor-pointer">
              +
            </button>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-4 gap-2.5 mt-4">
            {[
              { icon: <Icons.update className="text-[#EF7F23] h-5 w-5" />, label: "Updates" },
              { icon: <Icons.polls className="text-[#EF7F23] h-5 w-5" />, label: "Polls" },
              { icon: <Icons.gallery className="text-[#EF7F23] h-5 w-5" />, label: "Gallery" },
              { icon: <Icons.file className="text-[#EF7F23] h-5 w-5" />, label: "Files" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleActionClick(item.label)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white shadow-xs active:scale-95 transition cursor-pointer gap-2"
              >
                <div className="bg-orange-50 p-2 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-[11px] font-semibold text-slate-700">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs & Content Area */}
        <div className="bg-white">
          {/* Tab bar */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setActiveDetailsTab("activities")}
              className={`flex-1 py-4 text-center text-sm font-bold border-b-2 transition cursor-pointer ${
                activeDetailsTab === "activities"
                  ? "border-[#EF7F23] text-slate-900"
                  : "border-transparent text-slate-400"
              }`}
            >
              Activities ({selected_flock?.public_activities?.length || 0})
            </button>
            <button
              onClick={() => setActiveDetailsTab("calendar")}
              className={`flex-1 py-4 text-center text-sm font-bold border-b-2 transition cursor-pointer ${
                activeDetailsTab === "calendar"
                  ? "border-[#EF7F23] text-slate-900"
                  : "border-transparent text-slate-400"
              }`}
            >
              Calendar
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-5">
            {activeDetailsTab === "activities" ? (
              <div className="flex flex-col gap-4">
                {selected_flock?.public_activities?.map((activity: ActivityItem, index: number) => {
                  const status = (activity?.status || activity?.current_tab || "ONGOING").toUpperCase();
                  return (
                    <Link
                      to={`/flocks/${id}/activities/${activity?.id}/detail`}
                      key={index}
                      className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 active:scale-98 transition"
                    >
                      <img
                        src={
                          activity?.last_cover_image
                            ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(activity.last_cover_image)
                            : activity?.cover_image?.[0] || images.default_flock_banner
                        }
                        alt={activity?.name}
                        className="h-16 w-16 rounded-xl object-cover flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          (e.target as HTMLImageElement).src = images.default_flock_banner;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#EF7F23] whitespace-nowrap">
                          {dayjs(activity?.created_at).format("ddd, MMM D")}
                        </p>
                        <h3 className="text-sm font-bold text-slate-800 truncate mt-0.5">
                          {activity?.name}
                        </h3>
                        <span className="inline-block bg-orange-100 text-[#EF7F23] text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 uppercase">
                          {status}
                        </span>
                      </div>
                    </Link>
                  );
                })}

                {selected_flock?.public_activities?.length === 0 && (
                  <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100 text-slate-400 text-sm">
                    No activities found.
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-2">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xs border border-slate-100">
                  <SidebarCalendar activities={selected_flock?.public_activities} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <JoinPromptPopup
        isOpen={isJoinPopupOpen}
        onClose={() => setIsJoinPopupOpen(false)}
        message={joinPopupMessage}
      />
    </>
  );
};

export default FlocksDetails;
