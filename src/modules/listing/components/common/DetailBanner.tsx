import { useState } from "react";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import { images } from "../../../../constants/images";

type DetailBannerProps = {
  coverImage?: string | null;
  altText?: string;
};

const DetailBanner = ({ coverImage, altText = "Banner" }: DetailBannerProps) => {
  const [isCoverFallback, setIsCoverFallback] = useState(false);
  const isFallback = !coverImage || isCoverFallback;

  const srcUrl = coverImage
    ? coverImage.startsWith("http")
      ? coverImage
      : ENDPOINTS.BASE_URL.BASE_IMAGE_URL(coverImage)
    : images.not_found;

  return (
    <div
      className={`relative ${isFallback ? "h-64" : "h-96"} flex items-center justify-center overflow-hidden bg-cover bg-center`}
    >
      <img
        src={srcUrl}
        alt={altText}
        onError={(e) => {
          (e.target as HTMLImageElement).src = images.not_found;
          setIsCoverFallback(true);
        }}
        className={`${isFallback ? "max-h-48 w-auto rounded-2xl bg-slate-50/50 object-contain p-4" : "h-full w-full object-cover lg:w-[90%] lg:rounded-b-xl"}`}
      />
      {coverImage && !isCoverFallback && (
        <div className="from-primary-dark/90 via-primary-dark/60 absolute inset-0 bg-linear-to-r to-transparent lg:left-[5%] lg:w-[90%] lg:rounded-b-xl" />
      )}
    </div>
  );
};

export default DetailBanner;
