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
    <div
      className="
        w-full
        rounded-2xl
        bg-white
        p-3
        flex flex-col gap-3
        cursor-pointer
        active:scale-95
        hover:scale-[1.02]
        transition-all duration-300
        shadow-sm hover:shadow-lg
      "
    >
      {/* Image */}
      <div className="w-full h-52 overflow-hidden rounded-2xl">
        <img
          src={imageUrl}
          alt={activityName}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = images.not_found;
          }}
          className="
            w-full h-full object-cover
            rounded-2xl
            hover:scale-110
            transition-all duration-500
          "
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 mt-1">
        <h2 className="text-[16px] font-semibold line-clamp-1">
          {activityName}
        </h2>

        <p className="text-secondary text-[12px] flex items-center gap-1">
          <Icons.map height={14} width={14} />
          {location}
        </p>

        <p className="text-secondary text-[12px] flex items-center gap-1">
          <Icons.users height={14} width={14} />
          {members} members
        </p>
      </div>

      {/* Button */}
      <button
        className="
          w-full rounded-xl
          bg-linear-to-tr from-btn02 to-btn01 to-75%
          px-5 py-2 text-primary
          transition-all duration-300
          hover:scale-[1.02]
          active:scale-95
          cursor-pointer
          mt-3
        "
      >
        Join Now
      </button>
    </div>
  );
};

export default NearbyActivities;
