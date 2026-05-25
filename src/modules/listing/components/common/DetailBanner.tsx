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
    ? (coverImage.startsWith("http") ? coverImage : ENDPOINTS.BASE_URL.BASE_IMAGE_URL(coverImage))
    : images.not_found;

  return (
    <div
      className={`relative ${isFallback ? "h-64" : "h-96"} overflow-hidden bg-cover bg-center flex justify-center items-center`}
    >
      <img
        src={srcUrl}
        alt={altText}
        onError={(e) => {
          (e.target as HTMLImageElement).src = images.not_found;
          setIsCoverFallback(true);
        }}
        className={`${isFallback ? "max-h-48 w-auto object-contain rounded-2xl p-4 bg-slate-50/50" : "h-full w-full lg:w-[90%] lg:rounded-b-xl object-cover"}`}
      />
      {coverImage && !isCoverFallback && (
        <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/60 to-transparent lg:w-[90%] lg:left-[5%] lg:rounded-b-xl" />
      )}
    </div>
  );
};

export default DetailBanner;
