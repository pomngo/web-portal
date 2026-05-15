import { Link } from "react-router";
import type { CardType } from "../../../../types";

type CommunityFlocksCardProps = {
  card: {
    id: number;
    title: string;
    description: string;
    image: string;
    type: CardType;
  };
};

const cardClasses = {
  large: `
    col-span-1
    sm:col-span-2
    lg:col-span-4 lg:row-span-2
    h-[370px]
  `,

  small: `
    col-span-1
    lg:col-span-3
    h-[370px] lg:h-[170px]
  `,

  wide: `
    col-span-1
    sm:col-span-2
    lg:col-span-6
    h-[370px] lg:h-[170px]
  `,

  tall: `
    col-span-1
    sm:col-span-1
    lg:col-span-2 lg:row-span-2
    h-[370px]
  `,
};
const CommunityFlocksCard = ({ card }: CommunityFlocksCardProps) => {
  return (
    <Link
      to={`/flocks/${card.id}/detail`}
      className={`
        block w-full
  relative overflow-hidden rounded-3xl
        bg-cover bg-center group cursor-pointer
        hover:scale-105 hover:z-50 active:scale-95
        transition-all duration-300
        ${cardClasses[card.type]}
      `}
      style={{
        backgroundImage: `url(${card.image})`,
      }}
    >
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
            {card.title}
          </h3>

          <p className="text-sm text-shadow-primary text-primary/80 mb-4 max-w-64">
            {card.description}
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
      <div
        className="
          absolute inset-0 bg-primary-dark/10
          opacity-0 group-hover:opacity-100
          transition duration-200
        "
      />
    </Link>
  );
};

export default CommunityFlocksCard;
