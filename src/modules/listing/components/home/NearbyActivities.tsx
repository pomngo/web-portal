import { Icons } from "../../../../constants/icons";
import { images } from "../../../../constants/images";
import { ENDPOINTS } from "../../../../services/api/endpoints";

type NearbyActivitiesProps = {
  activity: {
    id: number;
    name?: string;
    title?: string;
    campaign_location?: string;
    cover_image_s3key?: string;
    image?: string;
    flock_members_count?: number;
  };
};

const NearbyActivities = ({ activity }: NearbyActivitiesProps) => {
  const imageUrl = activity?.cover_image_s3key
    ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(activity.cover_image_s3key)
    : activity?.image || images.not_found;

  const activityName = activity?.name || activity?.title || "Title not found";
  const location = activity?.campaign_location || "Location not found";
  const members = activity?.flock_members_count || 0;

  return (
    <div className="flex w-full cursor-pointer flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95">
      {/* Image */}
      <div className="h-52 w-full overflow-hidden rounded-2xl">
        <img
          src={imageUrl}
          alt={activityName}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = images.not_found;
          }}
          className="h-full w-full rounded-2xl object-cover transition-all duration-500 hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="mt-1 flex flex-col gap-1">
        <h2 className="line-clamp-1 text-[16px] font-semibold">{activityName}</h2>

        <p className="text-secondary flex items-center gap-1 text-[12px]">
          <Icons.map height={14} width={14} />
          {location}
        </p>

        <p className="text-secondary flex items-center gap-1 text-[12px]">
          <Icons.users height={14} width={14} />
          {members} members
        </p>
      </div>

      {/* Button */}
      <button className="from-btn02 to-btn01 text-primary mt-3 w-full cursor-pointer rounded-xl bg-linear-to-tr to-75% px-5 py-2 transition-all duration-300 hover:scale-[1.02] active:scale-95">
        Join Now
      </button>
    </div>
  );
};

export default NearbyActivities;
