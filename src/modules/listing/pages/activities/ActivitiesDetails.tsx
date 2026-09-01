import { useState } from "react";
import dayjs from "dayjs";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Search,
  Users,
  MapPin,
  Clock,
  Megaphone,
  BarChart3,
  Plus,
  Link as LinkIcon,
} from "lucide-react";
import DetailsTopNav from "../../components/DetailsTopNav";
import ActivityDetailsLoader from "../../../../components/common/ActivityDetailsLoader";
import ErrorState from "../../../../components/common/ErrorState";
import { useSEO } from "../../../../hooks/useSEO";
import { useActivityDetails } from "../../../../hooks/useActivitiesQuery";
import JoinPromptPopup from "../../components/common/JoinPromptPopup";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import { images } from "../../../../constants/images";
import { handleExternalRedirect } from "../../../../constants/urls";

const ActivitiesDetails = () => {
  const { id } = useParams();
  const activityId = Number(id);
  const navigate = useNavigate();

  const [isJoinPopupOpen, setIsJoinPopupOpen] = useState(false);
  const [joinPopupMessage, setJoinPopupMessage] = useState("");

  const handleActionClick = (label: string) => {
    setJoinPopupMessage(`Join us first then you can see ${label.toLowerCase()} and all things`);
    setIsJoinPopupOpen(true);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/activities");
    }
  };

  const {
    data: selected_activities,
    isLoading: selected_activities_loading,
    error,
    refetch,
  } = useActivityDetails(activityId);

  const actName = selected_activities?.name || "Community Activity";
  const actDesc =
    selected_activities?.description ||
    "Join us for an exciting local community activity. Connect with members and enjoy the experience!";
  const actLocation = selected_activities?.campaign_location || "Location N/A";
  const actJoinedCount =
    selected_activities?.joined_member_count ?? selected_activities?.flock_members_count ?? 0;

  const coverImageUrl =
    selected_activities?.cover_image?.[0] ||
    (selected_activities?.last_cover_image
      ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(selected_activities.last_cover_image)
      : undefined);

  useSEO({
    title: actName ? `${actName} | Activity Details - FlocknGo` : "Activity Details | FlocknGo",
    description: actDesc.slice(0, 160),
    keywords: `${actName}, local activity, community events, FlocknGo`,
    ogImage: coverImageUrl,
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
          <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FFF6EE] p-6">
            <div className="animate-fade-in mx-auto my-12 flex max-w-md flex-col items-center justify-center rounded-3xl border border-[#FEEBD9] bg-white p-8 text-center shadow-xs">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#E75B28]">
                <Search size={32} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-800">Activity Not Found</h3>
              <p className="mb-8 max-w-xs text-sm leading-relaxed text-slate-500">
                This activity may have been deleted, or the URL link you followed might be incorrect.
              </p>
              <Link
                to="/activities"
                className="from-btn02 to-btn01 flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-tr px-6 py-3 font-semibold text-white shadow-md shadow-orange-500/10 transition-all duration-300 hover:scale-105 active:scale-95"
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
        <ErrorState title="Activity Details Unavailable" message={errorMsg} onRetry={refetch} />
      </div>
    );
  }

  // Quick Action Buttons for Activity Details (Updates, Polls, Chat)
  const activityQuickActions = [
    {
      icon: <Megaphone className="h-5 w-5" />,
      label: "Updates",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Polls",
    }
  ];

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans pb-24 bg-[#F8FAFC]">
      {/* Top Header Navbar */}
      <DetailsTopNav />

      {/* MOBILE FULL WIDTH COVER BANNER WITH INSIDE OVERLAY BACK BUTTON (< lg) */}
      <div className="relative w-full h-56 sm:h-72 overflow-hidden lg:hidden">
        <img
          src={coverImageUrl || images.default_flock_banner}
          alt={actName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            (e.target as HTMLImageElement).src = images.default_flock_banner;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/20" />

        {/* Back Arrow Overlay inside banner */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleBack}
            className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full transition cursor-pointer text-white shadow-md"
            title="Back"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Hero Section Container for DESKTOP (Soft warm peach background #FFF6EE) */}
      <div className="hidden lg:block bg-[#FFF6EE] border-b border-[#FEEBD9] py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1440px] mx-auto space-y-6">
          {/* Desktop Back Action Row */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="h-10 w-10 rounded-full bg-[#EFECE8] hover:bg-[#E2DFDA] flex items-center justify-center text-slate-700 transition cursor-pointer"
              title="Back"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Desktop Hero Grid (Left Cover Image, Right Info Details) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Cover Image */}
            <div className="lg:col-span-6 xl:col-span-6">
              <div className="relative rounded-[28px] overflow-hidden shadow-sm aspect-[1.4] sm:aspect-[1.5] w-full bg-orange-100">
                <img
                  src={coverImageUrl || images.default_flock_banner}
                  alt={actName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    (e.target as HTMLImageElement).src = images.default_flock_banner;
                  }}
                />
              </div>
            </div>

            {/* Right Info Details */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-4">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-[#222222] tracking-tight leading-tight">
                {actName}
              </h1>

              {/* Description */}
              <p className="text-[#555555] text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                {actDesc}
              </p>

              {/* Activity Metadata Rows */}
              <div className="space-y-3 pt-3 text-sm font-semibold text-[#444444] border-t border-slate-100/60">
                {/* Location */}
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="h-4.5 w-4.5 text-[#E75B28] shrink-0" />
                  <span>{actLocation}</span>
                </div>

                {/* Timing */}
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="h-4.5 w-4.5 text-[#E75B28] shrink-0" />
                  <span>
                    {selected_activities?.end_date_time
                      ? dayjs(selected_activities.end_date_time).format("D ddd, MMM YYYY • h:mm A")
                      : selected_activities?.end_date
                      ? dayjs(selected_activities.end_date).format("D ddd, MMM YYYY")
                      : dayjs(selected_activities?.created_at).format("D ddd, MMM YYYY")}
                  </span>
                </div>

                {/* Members */}
                <div className="flex items-center gap-2 text-slate-700">
                  <Users className="h-4.5 w-4.5 text-[#E75B28] shrink-0" />
                  <button
                    onClick={() => handleActionClick("Members")}
                    className="underline underline-offset-4 cursor-pointer hover:text-[#E75B28] transition"
                  >
                    {actJoinedCount} Members Joined
                  </button>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex justify-between items-center gap-4 pt-4">
                <button
                  onClick={() => handleActionClick("Join Activity")}
                  className="from-btn01 to-btn02 bg-gradient-to-r text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md shadow-orange-500/10 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>Join Activity</span>
                </button>

                <div className="flex items-center gap-3">
                  {activityQuickActions.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleActionClick(item.label)}
                      className="transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      title={item.label}
                    >
                      <div className="flex flex-col justify-center items-center gap-1 px-2 py-1">
                        {item.icon}
                        <span className="text-xs font-medium text-[#555555]">
                          {item?.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE INFO & METADATA SECTION (< lg) */}
      <div className="lg:hidden px-4 py-5 space-y-4 bg-white border-b border-slate-100">
        <h1 className="text-2xl font-bold text-[#222222] tracking-tight">{actName}</h1>

        <p className="text-slate-600 text-xs leading-relaxed">{actDesc}</p>

        <div className="space-y-2 pt-2 text-xs font-semibold text-slate-700 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#E75B28] shrink-0" />
            <span>{actLocation}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#E75B28] shrink-0" />
            <span>
              {selected_activities?.end_date_time
                ? dayjs(selected_activities.end_date_time).format("D ddd, MMM YYYY")
                : dayjs(selected_activities?.created_at).format("D ddd, MMM YYYY")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#E75B28] shrink-0" />
            <button onClick={() => handleActionClick("Members")} className="underline">
              {actJoinedCount} Members Joined
            </button>
          </div>
        </div>

        {/* Action Buttons for Mobile (< lg) */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => handleActionClick("Join Activity")}
            className="from-btn01 to-btn02 bg-gradient-to-r text-white font-bold text-xs flex-1 py-3 rounded-2xl shadow-md cursor-pointer text-center"
          >
            Join Activity
          </button>
          {activityQuickActions.map((item) => (
            <button
              key={item.label}
              onClick={() => handleActionClick(item.label)}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 shadow-2xs active:scale-95 transition cursor-pointer border border-[#FEEBD9]"
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Highlights / Metrics Section */}
      <div className="max-w-[1440px] mx-auto px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16 w-full space-y-6">
        <h3 className="text-base font-bold text-[#E75B28] tracking-wide uppercase">
          Activity Highlights
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-50 text-[#E75B28]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">Max Participants</span>
              <p className="font-bold text-slate-800 text-sm sm:text-base mt-0.5">
                {selected_activities?.max_participants || selected_activities?.max_size || "Open to all"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-50 text-[#E75B28]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">Last Date to Join</span>
              <p className="font-bold text-slate-800 text-sm sm:text-base mt-0.5">
                {selected_activities?.ebd_date
                  ? dayjs(selected_activities.ebd_date).format("D MMM YYYY")
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-50 text-[#E75B28]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">Activity Timing</span>
              <p className="font-bold text-slate-800 text-sm sm:text-base mt-0.5">
                {selected_activities?.end_date_time
                  ? dayjs(selected_activities.end_date_time).format("D MMM, h:mm A")
                  : selected_activities?.end_date
                  ? dayjs(selected_activities.end_date).format("D MMM YYYY")
                  : "TBD"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-50 text-[#E75B28]">
              <LinkIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">Community Links</span>
              <button
                onClick={() => handleActionClick("Social Links")}
                className="font-bold text-xs sm:text-sm text-slate-800 underline underline-offset-2 hover:text-[#E75B28] transition mt-0.5 cursor-pointer block"
              >
                Social Links
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Join Prompt Popup */}
      <JoinPromptPopup
        isOpen={isJoinPopupOpen}
        onClose={() => setIsJoinPopupOpen(false)}
        message={joinPopupMessage}
        onJoin={handleExternalRedirect}
      />
    </div>
  );
};

export default ActivitiesDetails;
