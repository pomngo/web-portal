import { Icons } from "../../../../constants/icons";

export type ExploreActivity = {
  id: number;
  title: string;
  location: string;
  members: number;
  image: string;
};

type ExploreActivitiesCardProps = {
  activity: ExploreActivity;
};

const ExploreActivitiesCard = ({ activity }: ExploreActivitiesCardProps) => {
  return (
    <div className="flex flex-col gap-3 overflow-hidden">
      <div className="w-64 h-52 overflow-hidden rounded-2xl">
        <img
          src={activity.image}
          alt={activity.title}
          loading="lazy"
          className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-all duration-300"
        />
      </div>

      <div className="flex flex-col gap-0.5 mt-2">
        <h2 className="text-[16px] font-semibold">{activity.title}</h2>

        <div className="flex items-center gap-4">
          <p className="text-secondary text-[12px] flex items-center gap-1">
            <Icons.map size={14} />
            {activity.location}
          </p>

          <p className="text-secondary text-[12px] flex items-center gap-1">
            <Icons.users size={14} />
            {activity.members} members going
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExploreActivitiesCard;
