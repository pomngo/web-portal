import { memo } from "react";
import { Icons } from "../../../../constants/icons";
import { images } from "../../../../constants/images";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import { handleExternalRedirect } from "../../../../constants/urls";
import { getMemberCount, getLocation, getItemName } from "../../../../utils/dataHelper";

type NearbyFlockProps = {
  flock: {
    id: number;
    name?: string;
    location: string;
    description?: string;
    about?: string;
    member_count?: number;
    cover_image_s3key?: string | null;
    [key: string]: any;
  };
};

const NearbyFlock = ({ flock }: NearbyFlockProps) => {
  const imageUrl = flock.cover_image_s3key
    ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(flock?.cover_image_s3key)
    : images.default_flock_banner;

  const flockName = getItemName(flock, "Community Flock");
  const location = getLocation(flock, "Pune");
  const members = getMemberCount(flock);
  const description = (flock?.description || flock?.about || "").trim();

  return (
    <div className="group flex h-full w-full cursor-pointer flex-col justify-between gap-2 sm:gap-2.5 rounded-2xl bg-white p-2.5 sm:p-3 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 active:scale-98 border border-slate-100/90">
      {/* Full Size Image on Card - Strictly Uniform */}
      <div className="relative h-28 xs:h-32 sm:h-48 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-100">
        <img
          src={imageUrl}
          alt={flockName}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            (e.target as HTMLImageElement).src = images.default_flock_banner;
          }}
          className="h-full w-full object-cover rounded-xl sm:rounded-2xl transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Community Pill */}
        <div className="absolute top-2 left-2 z-10 rounded-md bg-black/55 backdrop-blur-md px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white shadow-xs">
          Community
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between gap-1 mt-0.5">
        <div>
          <div className="flex items-center gap-1.5">
            <h2
              className="line-clamp-1 text-xs sm:text-[15px] font-bold text-slate-800 transition-colors group-hover:text-btn01"
              title={flockName}
            >
              {flockName}
            </h2>
            <span className="inline-flex items-center justify-center h-3.5 w-3.5 rounded-full bg-orange-100 text-[#EF7F23] text-[9px] font-bold shrink-0" title="Verified Flock">
              ✓
            </span>
          </div>

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

      {/* Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleExternalRedirect(flock?.dynamic_url || flock?.invite_link);
        }}
        className="from-btn02 to-btn01 text-white font-semibold text-[11px] sm:text-xs mt-1 w-full cursor-pointer rounded-lg sm:rounded-xl bg-linear-to-tr to-75% px-2.5 py-1.5 sm:py-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xs"
      >
        Join Now
      </button>
    </div>
  );
};

export default memo(NearbyFlock);
