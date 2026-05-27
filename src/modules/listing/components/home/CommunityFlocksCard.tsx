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
const CommunityFlocksCard = ({ card, index = 1 }: CommunityFlocksCardProps) => {
  const classKey = ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5;
  const classes = cardClasses[classKey] ?? "";
  const description = card.description?.toString() ?? "";
  return (
    <Link
      to={`/flocks/${card.id}/detail`}
      className={`group relative block w-full cursor-pointer overflow-hidden rounded-3xl transition-all duration-300 hover:z-auto hover:scale-105 active:scale-95 ${classes} `}
    >
      {card.cover_image_s3key ? (
        <img
          src={ENDPOINTS.BASE_URL.BASE_IMAGE_URL(card.cover_image_s3key)}
          alt={card.flock_name || "Cover Image"}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
          <img
            src={images.not_found}
            alt="No cover"
            loading="lazy"
            className="max-h-40 w-auto opacity-30 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      {/* Dark Animated Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/40 to-black/10 transition-all duration-500" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end p-6 text-white">
        <div className="translate-y-10 transform opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="mb-2 text-2xl leading-tight font-bold">{card?.flock_name}</h3>

          <p className="text-shadow-primary text-primary/80 mb-4 max-w-64 text-sm">
            {description.slice(0, 25).trim()}
            {description.length > 0 && "..."}
          </p>

          <button className="from-btn02 to-btn01 cursor-pointer rounded-xl bg-linear-to-tl to-65% px-5 py-2 text-sm font-semibold shadow-lg transition-all duration-300 active:scale-95">
            Join Now
          </button>
        </div>
      </div>

      {/* Extra Hover Layer */}
      <div>
        <h3 className="mb-2 text-2xl leading-tight font-bold">{card?.flock_name ?? card?.title}</h3>
        transition duration-200 "
      </div>
    </Link>
  );
};

export default CommunityFlocksCard;
