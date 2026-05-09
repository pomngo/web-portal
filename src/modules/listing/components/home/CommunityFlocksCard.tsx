type CardType = "large" | "small" | "wide" | "tall";

type CommunityFlocksCardProps = {
  card: {
    id: number;
    title: string;
    description: string;
    image: string;
    type: CardType;
  };
};

const CommunityFlocksCard = ({ card }: CommunityFlocksCardProps) => {
  const cardClasses = {
    large: "md:col-span-4 md:row-span-2 h-[320px]",
    small: "md:col-span-3 h-[320px] md:h-[150px]",
    wide: "md:col-span-6 h-[320px] md:h-[150px]",
    tall: "md:col-span-2 md:row-span-2 h-[320px]",
  };
  return (
    <div
      className={`
              relative overflow-hidden rounded-3xl
              bg-cover bg-center group cursor-pointer
              ${cardClasses[card.type]}
            `}
      style={{
        backgroundImage: `url(${card.image})`,
      }}
    >
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
        <div className="">
          <h3 className="text-2xl font-bold mb-2 leading-tight">
            {card.title}
          </h3>

          <p className="text-sm text-gray-200 mb-4 max-w-64">
            {card.description}
          </p>

          <button className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 px-5 py-2 rounded-xl text-sm font-semibold shadow-lg">
            Join Now
          </button>
        </div>
      </div>

      {/* Hover Zoom */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300" />
    </div>
  );
};

export default CommunityFlocksCard;
