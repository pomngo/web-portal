import { memo } from "react";
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

  return (
    <div className="group flex h-full w-full cursor-pointer flex-col justify-between gap-2 sm:gap-2.5 rounded-2xl bg-white p-2.5 sm:p-3 shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-98 border border-slate-100/90">
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
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between gap-1 mt-0.5">
        <div>
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
