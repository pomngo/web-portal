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
import EmptyState from "../../../../components/common/EmptyState";
import { useSEO } from "../../../../hooks/useSEO";

const Home = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const {
    flocks,
    loading: flockLoading,
    error: flockError,
    isInitialized: flockInitialized,
  } = useAppSelector((state) => state.flock);
  const {
    activities,
    loading: activityLoading,
    error: activityError,
    isInitialized: activityInitialized,
  } = useAppSelector((state) => state.activities);
  const dispatch = useAppDispatch();

  const flockList = flocks;

  useEffect(() => {
    if (!flockInitialized) {
      dispatch(listFlocks("?is_discoverable=true"));
    }
    if (!activityInitialized) {
      dispatch(listActivities());
    }
  }, [dispatch, flockInitialized, activityInitialized]);

  useSEO({
    title: "Home | FlocknGo - Discover Nearby Activities & Groups",
    description:
      "Discover nearby local flocks, join exciting community activities, and make new connections. Find your interest and go with FlocknGo!",
    keywords: "activities near me, community events, local groups, join club, social meetups",
  });

  const handleRetry = () => {
    dispatch(listFlocks("?is_discoverable=true"));
    dispatch(listActivities());
  };

  if (flockLoading || activityLoading) {
    return (
      <div className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <HomeLoader type="home" />
      </div>
    );
  }

  if ((flockError || activityError) && flockList.length === 0 && activities.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-16 py-10">
        <ErrorState
          title="Unable to load Home Feed"
          message={flockError || activityError || "An error occurred while fetching the feed."}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <h1 className="sr-only">FlocknGo - Discover Nearby Activities and Community Flocks</h1>
      {/* Nearby Activities */}
      <section className="">
        {/* Heading */}
        <div className="mb-4 flex justify-between">
          <div className="">
            <TitleText title="Nearby Activities" />
            <p className="text-secondary text-base">Enable your location to get personalized results.</p>
          </div>
          <div className="">
            <GradientLinkButton to="/activities/nearby-activities" />
          </div>
        </div>

        {activities?.length === 0 ? (
          <EmptyState message="No nearby activities found" />
        ) : (
          <>
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
              {activities?.map((activity) => (
                <div key={activity.id} className="min-w-[85%] flex-shrink-0 snap-center sm:min-w-[65%] md:min-w-[45%]">
                  <NearbyActivities activity={activity} />
                </div>
              ))}
            </div>

            {/* Activities List */}
            <div className="hidden gap-8 md:gap-4 lg:grid lg:grid-cols-5">
              {activities?.slice(0, 5).map((activity) => (
                <Link key={activity.id} to={`/flocks/${activity.id}/activities/${activity.id}/detail`}>
                  <NearbyActivities activity={activity} />
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Filter button */}
        <div className="scrollbar-hide mt-16 flex gap-4 overflow-scroll overflow-y-hidden">
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
        <div className="mb-4 flex items-center justify-between">
          <div>
            <TitleText title="Community Flocks" />
          </div>

          <div>
            <GradientLinkButton to="/flocks/community-flocks" />
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
          {flockList.slice(0, 5).map((flock, index) => (
            <div key={flock.id} className="min-w-[90%] flex-shrink-0 snap-center sm:min-w-[70%]">
              <CommunityFlocksCard card={flock} index={index} />
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden auto-rows-auto grid-cols-1 gap-4 lg:grid lg:grid-cols-12">
          {flockList.slice(0, 5).map((flock, index) => (
            <CommunityFlocksCard key={flock.id} card={flock} index={index} />
          ))}
        </div>
      </section>

      {/* Explore Activities */}
      <section className="mb-20 lg:mb-0">
        <div className="mb-4 flex justify-between">
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
        {activities?.length === 0 ? (
          <EmptyState message="No activities found" />
        ) : (
          <>
            {/* Mobile Carousel */}
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
              {activities?.slice(0, 5).map((activity) => (
                <div key={activity.id} className="min-w-[85%] flex-shrink-0 snap-center sm:min-w-[65%] md:min-w-[45%]">
                  <Link to={`/flocks/${activity.id}/activities/${activity.id}/detail`}>
                    <ExploreActivitiesCard activity={activity} />
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden gap-8 md:gap-4 lg:grid lg:grid-cols-5">
              {activities?.slice(0, 5).map((activity) => (
                <Link key={activity.id} to={`/flocks/${activity.id}/activities/${activity.id}/detail`}>
                  <ExploreActivitiesCard activity={activity} />
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Home;
