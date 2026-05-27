import { memo } from "react";
import { Icons } from "../../../../constants/icons";
import { images } from "../../../../constants/images";
import { ENDPOINTS } from "../../../../services/api/endpoints";

type NearbyFlockProps = {
  flock: {
    id: number;
    flock_name: string;
    location: string;
    participants_count: number;
    cover_image_s3key: string;
  };
};

const NearbyFlock = ({ flock }: NearbyFlockProps) => {
  return (
    <div className="flex w-full cursor-pointer flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95">
      {/* Image */}
      <div className="h-52 w-full overflow-hidden rounded-2xl">
        <img
          src={`${flock.cover_image_s3key ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(flock?.cover_image_s3key) : images.not_found}`}
          alt={flock.flock_name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = images.not_found;
          }}
          className="bg-primary-dark h-full w-full rounded-2xl object-cover transition-all duration-500 hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="mt-1 flex flex-col gap-1">
        <h2 className="line-clamp-1 text-[16px] font-semibold">{flock.flock_name || "Title not found"}</h2>

        <p className="text-secondary flex items-center gap-1 text-[12px]">
          <Icons.map height={14} width={14} />
          {flock.location || "location not found"}
        </p>

        <p className="text-secondary flex items-center gap-1 text-[12px]">
          <Icons.users height={14} width={14} />
          {flock.participants_count || 0} members
        </p>
      </div>

      {/* Button */}
      <button className="from-btn02 to-btn01 text-primary mt-3 w-full cursor-pointer rounded-xl bg-linear-to-tr to-75% px-5 py-2 transition-all duration-300 hover:scale-[1.02] active:scale-95">
        Join Now
      </button>
    </div>
  );
};

export default memo(NearbyFlock);
