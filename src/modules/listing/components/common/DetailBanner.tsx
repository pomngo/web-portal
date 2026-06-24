import { useState } from "react";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import { images } from "../../../../constants/images";

type DetailBannerProps = {
  coverImage?: string | null;
  altText?: string;
  defaultImage?: string;
};

const DetailBanner = ({
  coverImage,
  altText = "Banner",
  defaultImage = images.default_flock_banner,
}: DetailBannerProps) => {
  const [isCoverFallback, setIsCoverFallback] = useState(false);

  const srcUrl = coverImage
    ? coverImage.startsWith("http")
      ? coverImage
      : ENDPOINTS.BASE_URL.BASE_IMAGE_URL(coverImage)
    : defaultImage;

  const isDefaultFlockBanner = srcUrl === images.default_flock_banner || isCoverFallback;

  return (
    <div
      className={`relative ${isDefaultFlockBanner ? "h-64 lg:h-96" : "h-96"} flex items-center justify-center overflow-hidden bg-cover bg-center`}
      style={isDefaultFlockBanner ? { backgroundColor: "#7e4af4" } : undefined}
    >
      <img
        src={srcUrl}
        alt={altText}
        onError={(e) => {
          e.currentTarget.onerror = null;
          (e.target as HTMLImageElement).src = images.default_flock_banner;
          setIsCoverFallback(true);
        }}
        className={
          isDefaultFlockBanner
            ? "h-full w-full object-contain"
            : "h-full w-full object-cover lg:w-[90%] lg:rounded-b-xl"
        }
      />
      {!isDefaultFlockBanner && (
        <div className="from-primary-dark/90 via-primary-dark/60 absolute inset-0 bg-linear-to-r to-transparent lg:left-[5%] lg:w-[90%] lg:rounded-b-xl" />
      )}
    </div>
  );
};

export default DetailBanner;
