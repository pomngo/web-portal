import { memo } from "react";
import dayjs from "dayjs";
import { Icons } from "../../../../constants/icons";
import { images } from "../../../../constants/images";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import { getMemberCount, getLocation, getItemName } from "../../../../utils/dataHelper";

export type ExploreActivity = {
  id: number;
  name: string;
  campaign_location: string;
  description?: string;
  about?: string;
  flock_members_count?: number;
  joined_member_count?: number;
  cover_image_s3key?: string;
  last_cover_image?: string | null;
  image?: string;
  flock_name?: string;
  flock?: { name?: string };
  start_date?: string;
  start_date_time?: string;
  activity_date?: string;
  date?: string;
  price?: string | number;
  entry_fee?: string | number;
  [key: string]: any;
};

type ExploreActivitiesCardProps = {
  activity: ExploreActivity;
};

const ExploreActivitiesCard = ({ activity }: ExploreActivitiesCardProps) => {
  const imageUrl = activity?.last_cover_image
    ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(activity.last_cover_image)
    : activity?.cover_image_s3key
      ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(activity.cover_image_s3key)
      : activity?.image || images.default_flock_banner;

  const activityName = getItemName(activity, "Community Activity");
  const location = getLocation(activity, "Location N/A");
  const members = getMemberCount(activity);
  const description = (activity?.description || activity?.about || "").trim();
  const flockName = activity?.flock_name || activity?.flock?.name;

  const dateStr = activity?.start_date_time || activity?.start_date || activity?.activity_date || activity?.date;
  const formattedDate = dateStr && dayjs(dateStr).isValid() ? dayjs(dateStr).format("D MMM") : null;
  const isFree = !activity?.price && !activity?.entry_fee;
  const priceDisplay = isFree
    ? "FREE"
    : (activity?.price && !isNaN(Number(activity.price)))
      ? `₹${activity.price}`
      : activity?.price || activity?.entry_fee;

  return (
    <div className="group flex h-full w-full cursor-pointer flex-col justify-between gap-2 sm:gap-2.5 rounded-2xl bg-white p-2.5 sm:p-3 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 active:scale-98 border border-slate-100/90">
      {/* Full Size Image on Card - Strictly Uniform */}
      <div className="relative h-28 xs:h-32 sm:h-48 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-100">
        <img
          src={imageUrl}
          alt={activityName}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            (e.target as HTMLImageElement).src = images.default_flock_banner;
          }}
          className="h-full w-full object-cover rounded-xl sm:rounded-2xl transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Badges */}
        {formattedDate && (
          <div className="absolute top-2 left-2 z-10 rounded-md bg-black/55 backdrop-blur-md px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white shadow-xs">
            {formattedDate}
          </div>
        )}

        {priceDisplay && (
          <div
            className={`absolute top-2 right-2 z-10 rounded-md px-2 py-0.5 text-[9px] sm:text-[10px] font-bold shadow-xs ${
              isFree ? "bg-emerald-500 text-white" : "bg-black/60 backdrop-blur-md text-white"
            }`}
          >
            {priceDisplay}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between gap-1 mt-0.5">
        <div>
          {flockName && (
            <span className="text-[10px] font-semibold text-[#EF7F23] truncate block max-w-full leading-tight">
              {flockName}
            </span>
          )}

          <h2
            className="line-clamp-1 text-xs sm:text-[15px] font-bold text-slate-800 transition-colors group-hover:text-btn01"
            title={activityName}
          >
            {activityName}
          </h2>

          {description && (
            <p className="mt-1 line-clamp-2 text-[10px] sm:text-[11px] text-slate-500 leading-snug break-words">
              {description.slice(0, 85)}
              {description.length > 85 ? "..." : ""}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-slate-100/70 text-[10px] sm:text-[12px] text-slate-500">
          <p className="flex items-center gap-1 truncate max-w-[55%]">
            <Icons.map className="h-3 w-3 sm:h-[13px] sm:w-[13px] text-[#EF7F23] flex-shrink-0" />
            <span className="truncate">{location}</span>
          </p>

          <p className="flex items-center gap-1 flex-shrink-0">
            <Icons.users className="h-3 w-3 sm:h-[13px] sm:w-[13px] text-[#EF7F23] flex-shrink-0" />
            <span>{members} members</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(ExploreActivitiesCard);
