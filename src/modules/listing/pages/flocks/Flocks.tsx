import { Link } from "react-router";
import {
  communityFlocks,
  filterOptions,
  nearbyActivities,
} from "../../../../constants/data";
import NearbyActivities from "../../components/home/NearbyActivities";
import FilterButton from "../../components/common/FilterButton";
import { useEffect, useState } from "react";
import HomeLoader from "../../../../components/common/HomeLoader";
import CommunityFlocksCard from "../../components/home/CommunityFlocksCard";
import TitleText from "../../../../components/common/TitleText";
import GradientLinkButton from "../../../../components/common/GradientLinkButton";

const Flocks = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = "Flocks | Flockn Go";
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen px-16 flex flex-col gap-16 py-10">
        <HomeLoader />
      </div>
    );
  }
  return (
    <main className="min-h-screen px-4  sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col gap-16 py-10">
      {/* Nearby Flocks */}
      <section className="">
        {/* Heading */}
        <div className="flex justify-between mb-4">
          <div className="">
            <TitleText title="Nearby Flocks" />
            <p className="text-secondary text-base">
              Enable your location to get personalized results.
            </p>
          </div>
          <div className="">
            <GradientLinkButton to="/activities/nearby-activities" />
          </div>
        </div>

        <div
          className="
    flex gap-4 overflow-x-auto
    snap-x snap-mandatory
    scrollbar-hide
    lg:hidden
    pb-2
  "
        >
          {nearbyActivities.map((activity) => (
            <div
              key={activity.id}
              className="
        min-w-[85%] sm:min-w-[65%] md:min-w-[45%]
        snap-center
        flex-shrink-0
      "
            >
              <NearbyActivities activity={activity} />
            </div>
          ))}
        </div>

        {/* Activities List */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-8 md:gap-4">
          {nearbyActivities.slice(0, 5).map((activity) => (
            <Link
              key={activity.id}
              to={`/flocks/${activity.id}/activities/${activity.id}/detail`}
            >
              <NearbyActivities activity={activity} />
            </Link>
          ))}
        </div>

        {/* Filter button */}
        <div className="flex overflow-scroll mt-16 gap-4 overflow-y-hidden scrollbar-hide">
          {filterOptions.map((item, index) => (
            <FilterButton
              key={index}
              Icon={item.icon}
              label={item.label}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          ))}
        </div>
      </section>

      {/* Community Flocks */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <div>
            <TitleText title="Community Flocks" />
          </div>

          <div>
            <GradientLinkButton to="/flocks/community-flocks" />
          </div>
        </div>

        {/* Mobile Carousel */}
        <div
          className="
      flex gap-4 overflow-x-auto
      snap-x snap-mandatory
      scrollbar-hide
      lg:hidden
      pb-2
    "
        >
          {communityFlocks.slice(0, 5).map((flock) => (
            <div
              key={flock.id}
              className="
          min-w-[90%]
          sm:min-w-[70%]
          snap-center
          flex-shrink-0
        "
            >
              <CommunityFlocksCard card={flock} />
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-auto">
          {communityFlocks.slice(0, 5).map((flock) => (
            <CommunityFlocksCard key={flock.id} card={flock} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Flocks;
