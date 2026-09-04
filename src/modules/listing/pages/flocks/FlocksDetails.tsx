import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Search,
  Users,
  Megaphone,
  BarChart3,
  Image as ImageIcon,
  FolderClosed,
  MapPin,
  Link as LinkIcon,
  ChevronRight,
  MoreVertical,
  Pencil,
  Plus,
  SlidersHorizontal,
  X,
  Calendar as CalendarIcon,
  PartyPopper,
} from "lucide-react";
import DetailsTopNav from "../../components/DetailsTopNav";
import SidebarCalendar from "../../components/flocks/SidebarCalendar";
import FlockDetailsLoader from "../../../../components/common/FlockDetailsLoader";
import ErrorState from "../../../../components/common/ErrorState";
import { images } from "../../../../constants/images";
import type { ActivityItem } from "../../../../types";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import SEOHead from "../../../../components/common/SEOHead";
import { useFlockDetails } from "../../../../hooks/useFlocksQuery";
import JoinPromptPopup from "../../components/common/JoinPromptPopup";
import { handleExternalRedirect } from "../../../../constants/urls";
import { encodeId, decodeId } from "../../../../utils/idEncoder";

const FlocksDetails = () => {
  const { id } = useParams();
  const flockId = decodeId(id);
  const navigate = useNavigate();

  // State management
  const [isJoinPopupOpen, setIsJoinPopupOpen] = useState(false);
  const [joinPopupMessage, setJoinPopupMessage] = useState("");
  const [activeMobileTab, setActiveMobileTab] = useState<"activities" | "calendar">("activities");

  // Professional Filter Modal & Search Controls
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activitySearchQuery, setActivitySearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"ALL" | "ONGOING" | "COMPLETED" | "DRAFT">("ALL");

  // Show join prompt popup before any external redirect
  const handleActionClick = (label: string) => {
    setJoinPopupMessage(`Join us first then you can see ${label.toLowerCase()} and all things`);
    setIsJoinPopupOpen(true);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/flocks");
    }
  };

  const {
    data: selected_flock,
    isLoading: selected_flock_loading,
    error,
    refetch,
  } = useFlockDetails(flockId);

  // Real flock data from backend API
  const flockData = selected_flock?.flock_details || selected_flock;
  const flockName = flockData?.flock_name || flockData?.name || flockData?.title || "Community Flock";
  const flockDescription = flockData?.description || "Welcome to our community flock! Connect with members and explore our activities.";
  const flockLocation = flockData?.location || "Pune";
  const memberCount = flockData?.participants_count || flockData?.members_count || 0;

  // Derive Interests Hashtags from real backend data
  const flockInterests = useMemo(() => {
    const raw = flockData?.interests;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item: any) => (typeof item === "object" ? item.name || "" : String(item))).filter(Boolean);
    }
    return ["Community", "Meetup", "Events"];
  }, [flockData]);

  // Quick Action Links list (Updates, Polls, Gallery, Files)
  const quickLinks = [
    {
      icon: <Megaphone className="h-5 w-5 text-[#222222] stroke-[1.8]" />,
      label: "Updates",
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-[#222222] stroke-[1.8]" />,
      label: "Polls",
    },
    {
      icon: <ImageIcon className="h-5 w-5 text-[#222222] stroke-[1.8]" />,
      label: "Gallery",
    },
    {
      icon: <FolderClosed className="h-5 w-5 text-[#222222] stroke-[1.8]" />,
      label: "Files",
    },
  ];

  // Real backend public activities filtered dynamically in state
  const realActivities: ActivityItem[] = selected_flock?.public_activities || [];

  const filteredRealActivities = useMemo(() => {
    return realActivities.filter((act: ActivityItem) => {
      const title = (act.name || act.title || "").toLowerCase();
      const matchesSearch = !activitySearchQuery.trim() || title.includes(activitySearchQuery.toLowerCase());
      const status = (act.status || act.current_tab || "ONGOING").toUpperCase();

      if (selectedStatusFilter === "ALL") return matchesSearch;
      return matchesSearch && status === selectedStatusFilter;
    });
  }, [realActivities, activitySearchQuery, selectedStatusFilter]);

  // Group real activities by Month & Year
  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityItem[]> = {};
    filteredRealActivities.forEach((act: ActivityItem) => {
      const dateStr = act.start_date_time || act.created_at;
      const monthYear = dateStr ? dayjs(dateStr).format("MMMM YYYY").toUpperCase() : "UPCOMING ACTIVITIES";
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(act);
    });
    return groups;
  }, [filteredRealActivities]);

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
          <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FFF6EE] p-6">
            <div className="animate-fade-in mx-auto my-12 flex max-w-md flex-col items-center justify-center rounded-3xl border border-[#FEEBD9] bg-white p-8 text-center shadow-xs">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#E75B28]">
                <Search size={32} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-800">Flock Not Found</h3>
              <p className="mb-8 max-w-xs text-sm leading-relaxed text-slate-500">
                This flock may have been deleted, or the URL link you followed might be incorrect.
              </p>
              <Link
                to="/flocks"
                className="from-btn02 to-btn01 flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-tr px-6 py-3 font-semibold text-white shadow-md shadow-orange-500/10 transition-all duration-300 hover:scale-105 active:scale-95"
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
        <ErrorState title="Flock Details Unavailable" message={errorMsg} onRetry={refetch} />
      </div>
    );
  }

  const coverImageUrl = flockData?.cover_image_s3key
    ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(flockData.cover_image_s3key)
    : undefined;

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans pb-24 bg-[#F8FAFC]">
      <SEOHead
        title={`${flockName} - Join Local Community Flock in ${flockLocation} | FlocknGo`}
        description={flockDescription.slice(0, 160)}
        keywords={`${flockName}, ${flockInterests.join(", ")}, social group ${flockLocation}, community flock, FlocknGo`}
        canonicalPath={`/flocks/${encodeId(flockId)}/detail`}
        domain="main"
        ogImage={coverImageUrl}
        schemaType="SocialGroup"
        schemaData={{
          name: flockName,
          url: `https://flockngo.com/flocks/${encodeId(flockId)}/detail`,
          location: flockLocation,
        }}
      />
      {/* Top Header Navbar */}
      <DetailsTopNav />

      {/* MOBILE FULL WIDTH COVER BANNER WITH INSIDE OVERLAY ICONS (< lg) */}
      <div className="relative flex justify-center items-center w-full h-56 sm:h-72 overflow-hidden lg:hidden">
        <img
          src={
            flockData?.cover_image_s3key
              ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(flockData.cover_image_s3key)
              : images.default_flock_banner
          }
          alt={flockName}
          className="h-full object-cover object-center"
          onError={(e) => {
            e.currentTarget.onerror = null;
            (e.target as HTMLImageElement).src = images.default_flock_banner;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/20" />

        {/* Back and 3-Dot Options Overlay inside banner (Chat icon removed) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={handleBack}
            className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full transition cursor-pointer text-white shadow-md"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>
          <button
            onClick={() => handleActionClick("Options")}
            className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full transition cursor-pointer text-white shadow-md"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Hero Section Container for DESKTOP (Soft warm peach background #FFF6EE) */}
      <div className="hidden lg:block bg-[#FFF6EE] border-b border-[#FEEBD9] py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1440px] mx-auto space-y-6">
          {/* Desktop Action Row (Chat icon removed) */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="h-10 w-10 rounded-full bg-[#EFECE8] hover:bg-[#E2DFDA] flex items-center justify-center text-slate-700 transition cursor-pointer"
              title="Back to Flocks"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
            </button>

            <button
              onClick={() => handleActionClick("Options")}
              className="h-10 w-10 rounded-full bg-[#EFECE8] hover:bg-[#E2DFDA] flex items-center justify-center text-slate-700 transition cursor-pointer"
              title="Options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop Hero Grid (Left Cover Image, Right Info Details) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Cover Image */}
            <div className="lg:col-span-6 xl:col-span-6">
              <div className="relative rounded-[28px] overflow-hidden shadow-sm aspect-[16/9] w-full bg-slate-100 flex items-center justify-center">
                <img
                  src={
                    flockData?.cover_image_s3key
                      ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(flockData.cover_image_s3key)
                      : images.default_flock_banner
                  }
                  alt={flockName}
                  className=" h-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    (e.target as HTMLImageElement).src = images.default_flock_banner;
                  }}
                />
              </div>
            </div>

            {/* Right Info Details */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-4">
              {/* Hashtag List */}
              <div className="flex flex-wrap items-center gap-1 text-sm font-semibold text-[#555555]">
                <span># {flockInterests.slice(0, 3).join(", ")}</span>
                {flockInterests.length > 3 && (
                  <button
                    onClick={() => handleActionClick("Interests")}
                    className="text-[#E75B28] font-bold cursor-pointer hover:underline ml-1"
                  >
                    +{flockInterests.length - 3}
                  </button>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-[#222222] tracking-tight leading-tight">
                {flockName}
              </h1>

              {/* Description */}
              <p className="text-[#555555] text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                {flockDescription}
              </p>

              {/* Metadata List */}
              <div className="space-y-3 pt-3 text-sm font-semibold text-[#444444]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4.5 w-4.5 text-[#555555] shrink-0" />
                    <button
                      onClick={() => handleActionClick("Members")}
                      className="underline underline-offset-4 cursor-pointer hover:text-[#E75B28] transition text-slate-800"
                    >
                      {memberCount} Members
                    </button>
                  </div>
                  <button
                    onClick={() => handleActionClick("Add Member")}
                    className="text-[#E75B28] hover:text-orange-700 transition cursor-pointer p-0.5"
                    title="Add Member"
                  >
                    <Plus className="h-4.5 w-4.5 stroke-[3]" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4.5 w-4.5 text-[#555555] shrink-0" />
                    <span>{flockLocation}</span>
                  </div>
                  <button
                    onClick={() => handleActionClick("Edit Location")}
                    className="text-[#E75B28] hover:text-orange-700 transition cursor-pointer p-0.5"
                    title="Edit Location"
                  >
                    <Pencil className="h-4 w-4 stroke-[2]" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4.5 w-4.5 text-[#555555] shrink-0" />
                  <button
                    onClick={() => handleActionClick("Social Links")}
                    className="underline underline-offset-4 cursor-pointer hover:text-[#E75B28] transition text-slate-800"
                  >
                    Social Links
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE INFO & METADATA SECTION (< lg) */}
      <div className="lg:hidden px-4 py-5 space-y-4 bg-white border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-1 text-xs font-bold text-[#E75B28]">
          <span># {flockInterests.slice(0, 3).join(", ")}</span>
          {flockInterests.length > 3 && (
            <button onClick={() => handleActionClick("Interests")} className="ml-1 underline">
              +{flockInterests.length - 3}
            </button>
          )}
        </div>

        <h1 className="text-2xl font-bold text-[#222222] tracking-tight">{flockName}</h1>

        <p className="text-slate-600 text-xs leading-relaxed">{flockDescription}</p>

        <div className="space-y-2 pt-2 text-xs font-semibold text-slate-700 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#E75B28] shrink-0" />
              <button onClick={() => handleActionClick("Members")} className="underline">
                {memberCount} Members
              </button>
            </div>
            <button onClick={() => handleActionClick("Add Member")} className="text-[#E75B28] font-bold">
              +
            </button>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#E75B28] shrink-0" />
            <span>{flockLocation}</span>
          </div>

          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-[#E75B28] shrink-0" />
            <button onClick={() => handleActionClick("Social Links")} className="underline">
              Social Links
            </button>
          </div>
        </div>

        {/* 4 Quick Action Buttons for Mobile (< lg) directly below Social Links */}
        <div className="grid grid-cols-4 gap-2.5 pt-3 border-t border-slate-100">
          {quickLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleActionClick(item.label)}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 shadow-2xs active:scale-95 transition cursor-pointer gap-1.5 border border-[#FEEBD9] hover:border-[#E75B28]"
            >
              <div className="bg-orange-50 p-2 rounded-full flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16 w-full space-y-8">
        {/* Quick Action 4 Cards Grid - Visible ONLY on Large Screens (lg:grid) */}
        <div className="hidden lg:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {quickLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleActionClick(item.label)}
              className="bg-[#FFF] hover:border-[#E75B28]/40 hover:bg-[#FFF0E6] rounded-[20px] p-5 flex items-center justify-between cursor-pointer shadow-2xs hover:shadow-xs transition-all duration-200 group text-left border border-slate-100"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <span className="text-base font-semibold text-[#222222] group-hover:text-[#E75B28] transition-colors">
                  {item.label}
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-[#222222] group-hover:text-[#E75B28] transition-colors" />
            </button>
          ))}
        </div>

        {/* Mobile Tab Switcher (< lg) with Smooth Sliding Bottom Line */}
        <div className="lg:hidden w-full border-b border-slate-200 mb-6 bg-white sticky top-0 z-20">
          <div className="relative flex">
            <button
              onClick={() => setActiveMobileTab("activities")}
              className={`flex-1 py-3 text-center text-xs sm:text-sm font-bold transition-colors duration-300 cursor-pointer ${
                activeMobileTab === "activities" ? "text-[#E75B28]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Activities ({filteredRealActivities.length})
            </button>
            <button
              onClick={() => setActiveMobileTab("calendar")}
              className={`flex-1 py-3 text-center text-xs sm:text-sm font-bold transition-colors duration-300 cursor-pointer ${
                activeMobileTab === "calendar" ? "text-[#E75B28]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Calendar
            </button>

            {/* Smooth Sliding Underline Indicator Bar */}
            <div
              className="absolute bottom-0 h-0.5 bg-[#E75B28] rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: "50%",
                transform: activeMobileTab === "activities" ? "translateX(0%)" : "translateX(100%)",
              }}
            />
          </div>
        </div>

        {/* Two-Column Main Layout: DESKTOP has Calendar on Left (4 cols) & Activities on Right (8 cols) */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column on Desktop (> lg): Calendar Sidebar (4 cols on lg) */}
          <div
            className={`col-span-12 lg:col-span-4 ${
              activeMobileTab === "calendar" ? "block" : "hidden lg:block"
            } flex flex-col gap-6`}
          >
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-2xs space-y-4">
              <SidebarCalendar
                activities={selected_flock?.public_activities}
                onActionClick={handleActionClick}
              />
            </div>
          </div>

          {/* Right Column on Desktop (> lg): Activities Grid (8 cols on lg) */}
          <div
            className={`col-span-12 lg:col-span-8 ${
              activeMobileTab === "activities" ? "block" : "hidden lg:block"
            } bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 shadow-2xs flex flex-col gap-6`}
          >
            {/* Top Bar: Search Input Box + Filter Button */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-3">
              {/* Search Box instead of plain text header */}
              <div className="relative bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 flex items-center shadow-2xs focus-within:border-[#E75B28] transition-colors flex-1 max-w-xs sm:max-w-sm">
                <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search activity..."
                  value={activitySearchQuery}
                  onChange={(e) => setActivitySearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none placeholder-slate-400"
                />
                {activitySearchQuery && (
                  <button
                    onClick={() => setActivitySearchQuery("")}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Button (Opens Professional Modal) */}
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className={`relative h-9 px-3.5 rounded-full border transition cursor-pointer flex items-center gap-2 text-xs font-bold shadow-2xs ${
                  selectedStatusFilter !== "ALL" || activitySearchQuery
                    ? "bg-[#E75B28] border-[#E75B28] text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
                title="Filter Activities"
              >
                <SlidersHorizontal className="h-4 w-4 stroke-[2]" />
                <span>Filter</span>
                {(selectedStatusFilter !== "ALL" || activitySearchQuery) && (
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                )}
              </button>
            </div>

            {/* Grouped Real Activity Cards */}
            {Object.keys(groupedActivities).length > 0 ? (
              Object.entries(groupedActivities).map(([monthYear, activities]) => (
                <div key={monthYear} className="space-y-4">
                  {/* Month Section Header */}
                  <h4 className="text-sm font-bold text-[#E75B28] tracking-wide uppercase border-b border-slate-100 pb-1">
                    {monthYear}
                  </h4>

                  {/* Activity Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {activities.map((act: ActivityItem) => {
                      const status = (act.status || act.current_tab || "ONGOING").toUpperCase();
                      const actDateStr = act.start_date_time || act.created_at;
                      const formattedDate = actDateStr
                        ? dayjs(actDateStr).format("ddd, MMM D")
                        : "TBD";
                      const joinedCount = act.joined_member_count ?? act.flock_members_count ?? 0;

                      return (
                        <div key={act.id} className="flex flex-col">
                          {/* Date label header above card */}
                          <p className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3 text-[#E75B28]" />
                            <span>{formattedDate}</span>
                          </p>

                          {/* Activity Card Container (Calls handleActionClick on click) */}
                          <div
                            onClick={() => handleActionClick(act.name || "Activity Details")}
                            className="bg-white border border-slate-100 hover:border-[#E75B28]/40 rounded-2xl p-3 shadow-2xs hover:shadow-xs transition flex items-center gap-3 cursor-pointer select-none group"
                          >
                            <img
                              src={
                                act.last_cover_image
                                  ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(act.last_cover_image)
                                  : act.cover_image?.[0] || images.default_flock_banner
                              }
                              alt={act.name}
                              className="h-16 w-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                (e.target as HTMLImageElement).src = images.default_flock_banner;
                              }}
                            />

                            {/* Title & Info */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <h5 className="text-xs font-bold text-slate-900 leading-snug truncate group-hover:text-[#E75B28] transition-colors">
                                {act.name}
                              </h5>

                              <p className="text-[10px] text-slate-500 font-medium truncate">
                                {joinedCount} members joined
                              </p>

                              {/* Status Badge */}
                              <span
                                className={`inline-block font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                  status === "DRAFT"
                                    ? "bg-[#FFF0E6] text-[#E75B28]"
                                    : "bg-[#E8E5FF] text-[#5B4EFF]"
                                }`}
                              >
                                {status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-400 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <PartyPopper className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-600">No activities found</p>
                <p className="text-xs text-slate-400">
                  {activitySearchQuery || selectedStatusFilter !== "ALL"
                    ? "No activities match your filter settings."
                    : "This community flock has no public activities listed yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsFilterModalOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer animate-fade-in"
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-[#E75B28]" />
                <h3 className="text-base font-bold text-slate-900">Filter Activities</h3>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Search Activity</label>
                <div className="relative border border-slate-200 rounded-xl px-3.5 py-2 flex items-center bg-slate-50">
                  <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    placeholder="Type activity name..."
                    value={activitySearchQuery}
                    onChange={(e) => setActivitySearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                  {activitySearchQuery && (
                    <button onClick={() => setActivitySearchQuery("")} className="text-slate-400 hover:text-slate-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Activity Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["ALL", "ONGOING", "DRAFT", "COMPLETED"] as const).map((statusOpt) => (
                    <button
                      key={statusOpt}
                      onClick={() => setSelectedStatusFilter(statusOpt)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        selectedStatusFilter === statusOpt
                          ? "bg-[#E75B28] border-[#E75B28] text-white shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {statusOpt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedStatusFilter("ALL");
                  setActivitySearchQuery("");
                }}
                className="flex-1 py-2.5 text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 py-2.5 text-xs font-bold bg-[#E75B28] text-white hover:bg-orange-700 rounded-xl cursor-pointer shadow-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

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

export default FlocksDetails;
