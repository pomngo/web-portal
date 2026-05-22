import { Link } from "react-router-dom";
import {
  filterOptions,
} from "../../../../constants/data";
import NearbyActivities from "../../components/home/NearbyActivities";
import FilterButton from "../../components/common/FilterButton";
import { useEffect, useState } from "react";
import ExploreActivitiesCard from "../../components/home/ExploreActivitiesCard";
import TitleText from "../../../../components/common/TitleText";
import GradientLinkButton from "../../../../components/common/GradientLinkButton";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { listActivities } from "../../../../store/slices/activitySlice";

import ErrorState from "../../../../components/common/ErrorState";
import HomeLoader from "../../../../components/common/HomeLoader";

const Activities = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const { activities, loading, error } = useAppSelector((state) => state.activities);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(activities.length === 0){
      dispatch(listActivities());
    }
  }, [dispatch, activities.length]);

  useEffect(() => {
    document.title = "Activities | Flockn Go";
  }, []);

  const handleRetry = () => {
    dispatch(listActivities());
  };

  if (loading && activities.length === 0) {
    return (
      <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col gap-16 py-10">
        <HomeLoader type="activities" />
      </div>
    );
  }

  if (error && activities.length === 0) {
    return (
      <div className="min-h-screen px-16 flex items-center justify-center py-10">
        <ErrorState
          title="Unable to load Activities"
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }
  return (
    <main className="min-h-screen px-4  sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col gap-16 py-10 ">
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

      {/* Explore Activities */}
      <section className="mb-20 lg:mb-0">
        <div className="flex justify-between  mb-4">
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

export default Activities;
