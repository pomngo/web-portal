import { Link } from "react-router";
import NearbyActivities from "../../components/home/NearbyActivities";
import {
  communityFlocks,
  exploreActivities,
  filterOptions,
  nearbyActivities,
} from "../../../../constants/data";
import FilterButton from "../../components/home/FilterButton";
import { Icons } from "../../../../constants/icons";
import CommunityFlocksCard from "../../components/home/CommunityFlocksCard";
import ExploreActivitiesCard from "../../components/home/ExploreActivitiesCard";
import { useEffect, useState } from "react";
import HomeLoader from "../../../../components/common/HomeLoader";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen px-16 flex flex-col gap-16 py-10">
        <HomeLoader />
      </div>
    );
  }

  return (
    <main className="min-h-screen px-16 flex flex-col gap-16 py-10">
      {/* Nearby Activities */}
      <section className="">
        {/* Heading */}
        <div className="flex justify-between items-center mb-4">
          <div className="">
            <h2 className="text-[24px] font-bold">Nearby Activities</h2>
            <p className="text-secondary text-base">
              Enable your location to get personalized results.
            </p>
          </div>
          <div className="">
            <Link
              to="/flocks"
              className="bg-linear-to-tr from-btn02 to-btn01 to-75% px-5 py-2 bg-clip-text text-transparent transition-all duration-300 hover:scale-105 flex items-center gap-1"
            >
              View All{" "}
              <Icons.rightArrow strokeWidth={1} className="text-btn01" />
            </Link>
          </div>
        </div>

        {/* Activities List */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {nearbyActivities.slice(0, 5).map((activity) => (
            <NearbyActivities key={activity.id} activity={activity} />
          ))}
        </div>

        {/* Filter button */}
        <div className="flex justify-center mt-16 gap-4 overflow-x-scroll overflow-y-hidden mx-auto scrollbar-hide">
          {filterOptions.map((item, index) => (
            <FilterButton key={index} Icon={item.icon} label={item.label} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
          ))}
        </div>
      </section>

      {/* Community Flocks */}
      <section className="">
        <div className="flex justify-between items-center mb-4">
          <div className="">
            <h2 className="text-[24px] font-bold">Community Flocks</h2>
          </div>
          <div className="">
            <Link
              to="/flocks"
              className="bg-linear-to-tr from-btn02 to-btn01 to-75% px-5 py-2 bg-clip-text text-transparent transition-all duration-300 hover:scale-105 flex items-center gap-1"
            >
              View All{" "}
              <Icons.rightArrow strokeWidth={1} className="text-btn01" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto">
          {communityFlocks.slice(0, 5).map((flock) => (
            <CommunityFlocksCard key={flock.id} card={flock} />
          ))}
        </div>
      </section>

      {/* Explore Activities */}
      <section className="">
        <div className="flex justify-between items-center mb-4">
          <div className="">
            <h2 className="text-[24px] font-bold">Explore Activities</h2>
            <p className="text-secondary text-base">
              Explore these amazing flocks and fetch your interest
            </p>
          </div>
          <div className="">
            <Link
              to="/activities"
              className="bg-linear-to-tr from-btn02 to-btn01 to-75% px-5 py-2 bg-clip-text text-transparent transition-all duration-300 hover:scale-105 flex items-center gap-1"
            >
              View All{" "}
              <Icons.rightArrow strokeWidth={1} className="text-btn01" />
            </Link>
          </div>
        </div>

        {/* Activities List */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {exploreActivities.slice(0, 5).map((activity) => (
            <ExploreActivitiesCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
