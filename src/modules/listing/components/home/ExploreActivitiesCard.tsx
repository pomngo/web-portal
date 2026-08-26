import { memo } from "react";
import { Icons } from "../../../../constants/icons";
import { images } from "../../../../constants/images";
import { ENDPOINTS } from "../../../../services/api/endpoints";

export type ExploreActivity = {
  id: number;
  name: string;
  campaign_location: string;
  flock_members_count?: number;
  joined_member_count?: number;
  cover_image_s3key?: string;
  last_cover_image?: string | null;
  image?: string;
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

  return (
    <div className="flex cursor-pointer flex-col gap-2.5 transition-all duration-200 hover:z-99 hover:scale-105 hover:bg-white active:scale-95 p-2 rounded-2xl">
      <div className="h-44 sm:h-52 w-full overflow-hidden rounded-2xl">
        <img
          src={imageUrl}
          alt={activity?.name || "Activity"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            (e.target as HTMLImageElement).src = images.default_flock_banner;
          }}
          className="h-full w-full rounded-2xl object-cover transition-all duration-300 hover:scale-105"
        />
      </div>

      <div className="mt-1 flex flex-col gap-1">
        <h2 className="text-sm sm:text-[16px] font-bold text-slate-800 line-clamp-1">{activity?.name || "Title not found"}</h2>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-slate-500 flex items-center gap-1 text-[11px] sm:text-[12px] truncate">
            <Icons.map height={14} width={14} className="text-[#EF7F23] flex-shrink-0" />
            <span className="truncate">{activity?.campaign_location || "Location N/A"}</span>
          </p>

          <p className="text-slate-500 flex items-center gap-1 text-[11px] sm:text-[12px]">
            <Icons.users height={14} width={14} className="text-[#EF7F23] flex-shrink-0" />
            <span>{activity?.joined_member_count ?? activity?.flock_members_count ?? 0} members</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(ExploreActivitiesCard);
