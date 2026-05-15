import { Icons } from "../../../../constants/icons";

type NearbyActivitiesProps = {
  activity: {
    id: number;
    title: string;
    location: string;
    membersGoing: number;
    image: string;
  };
};

const NearbyActivities = ({ activity }: NearbyActivitiesProps) => {
  return (
    <div
      className="
        w-full
        rounded-2xl
        bg-white
        p-3
        flex flex-col gap-3
        cursor-pointer
        active:scale-95
        hover:scale-[1.02]
        transition-all duration-300
        shadow-sm hover:shadow-lg
      "
    >
      {/* Image */}
      <div className="w-full h-52 overflow-hidden rounded-2xl">
        <img
          src={activity.image}
          alt={activity.title}
          loading="lazy"
          className="
            w-full h-full object-cover
            rounded-2xl
            hover:scale-110
            transition-all duration-500
          "
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 mt-1">
        <h2 className="text-[16px] font-semibold line-clamp-1">
          {activity.title}
        </h2>

        <p className="text-secondary text-[12px] flex items-center gap-1">
          <Icons.map height={14} width={14} />
          {activity.location}
        </p>

        <p className="text-secondary text-[12px] flex items-center gap-1">
          <Icons.users height={14} width={14} />
          {activity.membersGoing} members
        </p>
      </div>

      {/* Button */}
      <button
        className="
          w-full rounded-xl
          bg-linear-to-tr from-btn02 to-btn01 to-75%
          px-5 py-2 text-primary
          transition-all duration-300
          hover:scale-[1.02]
          active:scale-95
          cursor-pointer
          mt-3
        "
      >
        Join Now
      </button>
    </div>
  );
};

export default NearbyActivities;
