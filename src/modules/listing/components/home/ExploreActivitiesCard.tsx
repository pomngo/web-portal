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
    <div className="flex cursor-pointer flex-col gap-3 transition-all duration-200 hover:z-99 hover:scale-105 hover:bg-white active:scale-95">
      <div className="h-52 w-full overflow-hidden rounded-2xl">
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

      <div className="mt-2 flex flex-col gap-0.5">
        <h2 className="text-[16px] font-semibold">{activity?.name || "Title not found"}</h2>

        <div className="flex items-center gap-4">
          <p className="text-secondary flex items-center gap-1 text-[12px]">
            <Icons.map height={14} width={14} />
            {activity?.campaign_location || "Location not found"}
          </p>

          <p className="text-secondary flex items-center gap-1 text-[12px]">
            <Icons.users height={14} width={14} />
            {activity?.joined_member_count ?? activity?.flock_members_count ?? 0} members
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(ExploreActivitiesCard);
