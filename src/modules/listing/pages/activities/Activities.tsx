import { Link } from "react-router-dom";
import { filterOptions } from "../../../../constants/data";
import NearbyActivities from "../../components/home/NearbyActivities";
import FilterButton from "../../components/common/FilterButton";
import { useEffect, useState } from "react";
import ExploreActivitiesCard from "../../components/home/ExploreActivitiesCard";
import TitleText from "../../../../components/common/TitleText";
import GradientLinkButton from "../../../../components/common/GradientLinkButton";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { listActivities } from "../../../../store/slices/activitySlice";

import ErrorState from "../../../../components/common/ErrorState";
import EmptyState from "../../../../components/common/EmptyState";
import HomeLoader from "../../../../components/common/HomeLoader";
import { useSEO } from "../../../../hooks/useSEO";

const Activities = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const { activities, loading, error, isInitialized } = useAppSelector((state) => state.activities);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isInitialized) {
      dispatch(listActivities());
    }
  }, [dispatch, isInitialized]);

  useSEO({
    title: "Activities | FlocknGo - Explore Events & Experiences",
    description: "Discover nearby local activities, outdoor adventures, workshops, and fun experiences. Join exciting local events with FlocknGo.",
    keywords: "local activities, events near me, local experiences, fun activities, community events",
  });

  const handleRetry = () => {
    dispatch(listActivities());
  };

  if (loading && activities.length === 0) {
    return (
      <div className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <HomeLoader type="activities" />
      </div>
    );
  }

  if (error && activities.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-16 py-10">
        <ErrorState title="Unable to load Activities" message={error} onRetry={handleRetry} />
      </div>
    );
  }
  return (
    <main className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <h1 className="sr-only">Discover Local Activities and Upcoming Events - FlocknGo</h1>
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

export default Activities;
