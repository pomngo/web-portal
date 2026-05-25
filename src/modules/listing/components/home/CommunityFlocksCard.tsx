import { Link } from "react-router-dom";
import type { CardType } from "../../../../types";
import { ENDPOINTS } from "../../../../services/api/endpoints";
import { images } from "../../../../constants/images";

type CommunityFlocksCardProps = { 
  card: { 
    id: number; 
    flock_name?: string; 
    title?: string; 
    description?: string | ""; 
    cover_image_s3key?: string | null; 
    image?: string; 
    type?: CardType; 
  }; 
  index?: number; 
}; 

const cardClasses = {
  1: `
    col-span-1
    sm:col-span-2
    lg:col-span-4 lg:row-span-2
    h-[370px]
  `,

  2: `
    col-span-1
    lg:col-span-3
    h-[370px] lg:h-[170px]
  `,
  3: `
    col-span-1
    lg:col-span-3
    h-[370px] lg:h-[170px]
  `,

  5: `
    col-span-1
    sm:col-span-2
    lg:col-span-6
    h-[370px] lg:h-[170px]
  `,

  4: `
    col-span-1
    sm:col-span-1
    lg:col-span-2 lg:row-span-2
    h-[370px]
  `,
};
const CommunityFlocksCard = ({ card, index=1 }: CommunityFlocksCardProps) => {
  const classKey = ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5;
  const classes = cardClasses[classKey] ?? "";
  const description = card.description?.toString() ?? "";
  return (
    <Link
      to={`/flocks/${card.id}/detail`}
      className={`
        block w-full
        relative overflow-hidden rounded-3xl
        bg-cover bg-center group cursor-pointer
        hover:scale-105 hover:z-auto active:scale-95
        transition-all duration-300
        ${classes}
        ${!card.cover_image_s3key ? "bg-slate-50 border border-slate-100" : ""}
      `}
      style={
        card.cover_image_s3key
          ? { backgroundImage: `url(${ENDPOINTS.BASE_URL.BASE_IMAGE_URL(card.cover_image_s3key)})` }
          : undefined
      }
    >
      {!card.cover_image_s3key && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
          <img
            src={images.not_found}
            alt="No cover"
            className="max-h-20 w-auto opacity-30 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      {/* Dark Animated Overlay */}
      <div
        className="
          absolute inset-0
          bg-linear-to-t from-black/90 via-black/40 to-transparent
          opacity-60 group-hover:opacity-100
          transition-all duration-500
        "
      />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end p-6 text-white">
        <div
          className="
            transform transition-all duration-500 ease-out
            translate-y-10 opacity-0
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <h3 className="text-2xl font-bold mb-2 leading-tight">
            {card?.flock_name}
          </h3>

          <p className="text-sm text-shadow-primary text-primary/80 mb-4 max-w-64">
            {description.slice(0, 25).trim()}{description.length > 0 && "..."}
          </p>

          <button
            className="
              bg-linear-to-tl from-btn02 to-btn01 to-65%
              transition-all duration-300
              px-5 py-2 rounded-xl
              text-sm font-semibold shadow-lg cursor-pointer active:scale-95
            "
          >
            Join Now
          </button>
        </div>
      </div>

      {/* Extra Hover Layer */}
      <div>

              <h3 className="text-2xl font-bold mb-2 leading-tight">
                {card?.flock_name ?? card?.title}
              </h3>
          transition duration-200
        "
      </div>
    </Link>
  );
};

export default CommunityFlocksCard;
