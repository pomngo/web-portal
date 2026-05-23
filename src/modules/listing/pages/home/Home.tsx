import { Link } from "react-router-dom";
import NearbyActivities from "../../components/home/NearbyActivities";
import { filterOptions } from "../../../../constants/data";
import FilterButton from "../../components/common/FilterButton";
import CommunityFlocksCard from "../../components/home/CommunityFlocksCard";
import ExploreActivitiesCard from "../../components/home/ExploreActivitiesCard";
import { useEffect, useState } from "react";
import HomeLoader from "../../../../components/common/HomeLoader";
import TitleText from "../../../../components/common/TitleText";
import GradientLinkButton from "../../../../components/common/GradientLinkButton";
import { listFlocks } from "../../../../store/slices/flockSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { listActivities } from "../../../../store/slices/activitySlice";

import ErrorState from "../../../../components/common/ErrorState";

const Home = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const { flocks, loading: flockLoading, error: flockError, isInitialized: flockInitialized } = useAppSelector((state) => state.flock);
  const { activities, loading: activityLoading, error: activityError, isInitialized: activityInitialized } = useAppSelector((state) => state.activities);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!flockInitialized) {
      dispatch(listFlocks("?is_discoverable=true"));
    }
    if (!activityInitialized) {
      dispatch(listActivities());
    }
  }, [dispatch, flockInitialized, activityInitialized]);

  useEffect(() => {
    document.title = "Home | Flockn Go";
  }, []);

  const handleRetry = () => {
    dispatch(listFlocks("?is_discoverable=true"));
    dispatch(listActivities());
  };

  if (flockLoading || activityLoading) {
    return (
      <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col gap-16 py-10">
        <HomeLoader type="home" />
      </div>
    );
  }

  if ((flockError || activityError) && flocks.length === 0 && activities.length === 0) {
    return (
      <div className="min-h-screen px-16 flex items-center justify-center py-10">
        <ErrorState
          title="Unable to load Home Feed"
          message={flockError || activityError || "An error occurred while fetching the feed."}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4  sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col gap-16 py-10">
      {/* Nearby Activities */}
      <section className="">
        {/* Heading */}
        <div className="flex justify-between mb-4">
          <div className="">
            <TitleText title="Nearby Activities" />
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
          {activities?.map((activity) => (
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
          {activities?.slice(0, 5).map((activity) => (
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
          {flocks?.slice(0, 5).map((flock: any, index: number) => (
            <div
              key={flock.id}
              className="
          min-w-[90%]
          sm:min-w-[70%]
          snap-center
          flex-shrink-0
        "
            >
              <CommunityFlocksCard card={flock} index={index} />
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-auto">
          {flocks?.slice(0, 5).map((flock: any, index: number) => (
            <CommunityFlocksCard key={flock.id} card={flock} index={index} />
          ))}
        </div>
      </section>

      {/* Explore Activities */}
      <section className="mb-20 lg:mb-0">
        <div className="flex justify-between mb-4">
          <div className="">
            <TitleText title="Explore Activities" />
            <p className="text-secondary text-xs sm:text-sm md:text-base">
              Explore these amazing flocks and fetch your interest
            </p>
          </div>
          <div className="">
            <GradientLinkButton to="/activities/explore-activities" />
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
          {activities?.slice(0, 5).map((activity) => (
            <div
              key={activity.id}
              className="
        min-w-[85%]
        sm:min-w-[65%]
        md:min-w-[45%]
        snap-center
        flex-shrink-0
      "
            >
              <Link
                to={`/flocks/${activity.id}/activities/${activity.id}/detail`}
              >
                <ExploreActivitiesCard activity={activity} />
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-8 md:gap-4">
          {activities?.slice(0, 5).map((activity) => (
            <Link
              key={activity.id}
              to={`/flocks/${activity.id}/activities/${activity.id}/detail`}
            >
              <ExploreActivitiesCard activity={activity} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
