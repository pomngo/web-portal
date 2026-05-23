import { Link, useParams } from "react-router-dom";
import NearbyActivities from "../../components/home/NearbyActivities";
import { useEffect, useState, useRef } from "react";
import HomeLoader from "../../../../components/common/HomeLoader";
import PageHeader from "../../../../components/common/PageHeader";
import ScrollLoader from "../../../../components/common/ScrollLoader";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchActivitiesPage } from "../../../../store/slices/activitySlice";

import ErrorState from "../../../../components/common/ErrorState";

const AllActivities = () => {
  const { search_by } = useParams();
  const dispatch = useAppDispatch();
  const { activities, loading, page, hasMore, error } = useAppSelector((state) => state.activities);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    dispatch(fetchActivitiesPage({ page: 1, offset: 10 }));
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchActivitiesPage({ page: 1, offset: 10 }));
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !loading) {
          setIsLoadingMore(true);
          dispatch(fetchActivitiesPage({ page: page + 1, offset: 10 })).then(() =>
            setIsLoadingMore(false)
          ).catch(() => setIsLoadingMore(false));
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [dispatch, hasMore, isLoadingMore, loading, page]);

  useEffect(() => {
    document.title = "All Activities | Flockn Go";
  }, []);

  const activityList = activities;

  if (loading && activityList.length === 0) {
    return (
      <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col gap-16 py-10">
        <HomeLoader type="all-activities" />
      </div>
    );
  }

  if (error && activityList.length === 0) {
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
    <main className="min-h-screen px-4  sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col gap-16 py-10">
      {/* Nearby Flocks */}
      <section className="">
        <PageHeader slug={search_by} />

        {/* Activities List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-x-4 gap-y-16">
          {activityList.map((activity) => (
            <Link
              key={activity.id}
              to={`/flocks/${activity.id}/activities/${activity.id}/detail`}
            >
              <NearbyActivities activity={activity} />
            </Link>
          ))}
        </div>

        {/* Intersection Observer Target - placed before loading indicator */}
        <div ref={observerTarget} className="h-10 mt-8" />

        {/* Loading More Indicator */}
        {isLoadingMore && (
          <div className="mt-8">
            <ScrollLoader />
          </div>
        )}

        {/* No More Data Message */}
        {!hasMore && !loading && activityList.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-secondary text-base">No more activities to load</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default AllActivities;
