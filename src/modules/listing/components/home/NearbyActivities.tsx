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
    <div className="flex flex-col gap-3 ">
      <div className="w-full lg:w-64 h-52 overflow-hidden rounded-2xl">
        <img
          src={activity.image}
          alt={activity.title}
          loading="lazy"
          className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-all duration-300"
        />
      </div>
      <div className="flex flex-col gap-0.5 mt-2">
        <h2 className="text-[16px] font-semibold">{activity.title}</h2>
        <p className="text-secondary text-[12px] flex items-center gap-1">
          {" "}
          <Icons.map size={14} /> {activity.location}
        </p>
        <p className="text-secondary text-[12px] flex items-center gap-1">
          {" "}
          <Icons.users size={14} /> {activity.membersGoing} members
        </p>
      </div>

      <button className="w-full rounded-xl bg-linear-to-tr from-btn02 to-btn01 to-75% px-5 py-2 text-primary transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer mt-5">
        Join Now
      </button>
    </div>
  );
};

export default NearbyActivities;
