import { Icons } from "../../../../constants/icons";
import { ENDPOINTS } from "../../../../services/api/endpoints";

type NearbyFlockProps = {
  flock: {
    id: number;
    flock_name: string;
    location: string;
    participants_count: number;
    cover_image_s3key: string;
  };
};

const NearbyFlock = ({ flock }: NearbyFlockProps) => {
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
          src={`${flock.cover_image_s3key ? ENDPOINTS.BASE_URL.BASE_IMAGE_URL(flock?.cover_image_s3key) : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Objeomz7IceAvda_z3fdIwZo7_WiG_eHfg&s"}`}
          alt={flock.flock_name}
          loading="lazy"
          className="
            w-full h-full object-cover
            bg-primary-dark
            rounded-2xl
            hover:scale-110
            transition-all duration-500
          "
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 mt-1">
        <h2 className="text-[16px] font-semibold line-clamp-1">
          {flock.flock_name}
        </h2>

        <p className="text-secondary text-[12px] flex items-center gap-1">
          <Icons.map height={14} width={14} />
          {flock.location}
        </p>

        <p className="text-secondary text-[12px] flex items-center gap-1">
          <Icons.users height={14} width={14} />
          {flock.participants_count} members
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

export default NearbyFlock;
