import { memo } from "react";
import { Icons } from "../../../../constants/icons";
import { images } from "../../../../constants/images";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import { handleExternalRedirect } from "../../../../constants/urls";

type NearbyActivitiesProps = {
  activity: {
    id: number;
    name?: string;
    title?: string;
    campaign_location?: string;
    cover_image_s3key?: string;
    last_cover_image?: string | null;
    image?: string;
    flock_members_count?: number;
    joined_member_count?: number;
  };
};

const NearbyActivities = ({ activity }: NearbyActivitiesProps) => {
  const imageUrl = activity?.last_cover_image
    ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(activity.last_cover_image)
    : activity?.cover_image_s3key
      ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(activity.cover_image_s3key)
      : activity?.image || images.default_flock_banner;

  const activityName = activity?.name || activity?.title || "Title not found";
  const location = activity?.campaign_location || "Location not found";
  const members = activity?.joined_member_count ?? activity?.flock_members_count ?? 0;

  return (
    <div className="flex w-full cursor-pointer flex-col gap-2.5 rounded-2xl bg-white p-3 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 border border-slate-100/80">
      {/* Image */}
      <div className="h-44 sm:h-52 w-full overflow-hidden rounded-xl sm:rounded-2xl">
        <img
          src={imageUrl}
          alt={activityName}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            (e.target as HTMLImageElement).src = images.default_flock_banner;
          }}
          className="h-full w-full rounded-xl sm:rounded-2xl object-cover transition-all duration-500 hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="mt-0.5 flex flex-col gap-1">
        <h2 className="line-clamp-1 text-sm sm:text-[16px] font-bold text-slate-800">{activityName}</h2>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-slate-500 flex items-center gap-1 text-[11px] sm:text-[12px] truncate">
            <Icons.map height={14} width={14} className="text-[#EF7F23] flex-shrink-0" />
            <span className="truncate">{location}</span>
          </p>

          <p className="text-slate-500 flex items-center gap-1 text-[11px] sm:text-[12px]">
            <Icons.users height={14} width={14} className="text-[#EF7F23] flex-shrink-0" />
            <span>{members} members</span>
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleExternalRedirect();
        }}
        className="from-btn02 to-btn01 text-white font-semibold text-xs sm:text-sm mt-2 w-full cursor-pointer rounded-xl bg-linear-to-tr to-75% px-4 py-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xs"
      >
        Join Now
      </button>
    </div>
  );
};

export default memo(NearbyActivities);
