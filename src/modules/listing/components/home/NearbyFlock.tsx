import { memo } from "react";
import { Icons } from "../../../../constants/icons";
import { images } from "../../../../constants/images";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import { handleExternalRedirect } from "../../../../constants/urls";

type NearbyFlockProps = {
  flock: {
    id: number;
    name?: string;
    location: string;
    member_count?: number;
    cover_image_s3key?: string | null;
  };
};

const NearbyFlock = ({ flock }: NearbyFlockProps) => {
  return (
    <div className="flex w-full cursor-pointer flex-col gap-2 sm:gap-3 rounded-2xl bg-white p-2.5 sm:p-3 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 border border-slate-100/80">
      {/* Image */}
      <div className="h-28 xs:h-32 sm:h-52 w-full overflow-hidden rounded-xl sm:rounded-2xl">
        <img
          src={`${flock.cover_image_s3key ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(flock?.cover_image_s3key) : images.default_flock_banner}`}
          alt={flock.name}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            (e.target as HTMLImageElement).src = images.default_flock_banner;
          }}
          className="bg-primary-dark h-full w-full rounded-xl sm:rounded-2xl object-cover object-center transition-all duration-500 hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="mt-0.5 sm:mt-1 flex flex-col gap-1">
        <h2 className="line-clamp-1 text-xs sm:text-[16px] font-semibold">{flock.name || "Title not found"}</h2>

        <p className="text-secondary flex items-center gap-1 text-[10px] sm:text-[12px] truncate">
          <Icons.map className="h-3 w-3 sm:h-[14px] sm:w-[14px] flex-shrink-0" />
          <span className="truncate">{flock.location || "location not found"}</span>
        </p>

        <p className="text-secondary flex items-center gap-1 text-[10px] sm:text-[12px]">
          <Icons.users className="h-3 w-3 sm:h-[14px] sm:w-[14px] flex-shrink-0" />
          <span>{flock.member_count || 0} members</span>
        </p>
      </div>

      {/* Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleExternalRedirect();
        }}
        className="from-btn02 to-btn01 text-primary font-semibold text-[11px] sm:text-sm mt-1.5 sm:mt-3 w-full cursor-pointer rounded-lg sm:rounded-xl bg-linear-to-tr to-75% px-2.5 py-1.5 sm:px-5 sm:py-2 transition-all duration-300 hover:scale-[1.02] active:scale-95"
      >
        Join Now
      </button>
    </div>
  );
};

export default memo(NearbyFlock);
