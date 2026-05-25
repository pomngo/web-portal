import { Link, useParams } from "react-router-dom";
import NearbyActivities from "../../components/home/NearbyActivities";
import { useEffect, useState } from "react";
import HomeLoader from "../../../../components/common/HomeLoader";
import PageHeader from "../../../../components/common/PageHeader";
import ScrollLoader from "../../../../components/common/ScrollLoader";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchActivitiesPage } from "../../../../store/slices/activitySlice";
import InfiniteScroll from "react-infinite-scroll-component";

import ErrorState from "../../../../components/common/ErrorState";

const AllActivities = () => {
  const { search_by } = useParams();
  const dispatch = useAppDispatch();
  const { activities, loading, hasMore, error } = useAppSelector((state) => state.activities);
  const [page, setPage] = useState(1);

  // Initial load
  useEffect(() => {
    dispatch(fetchActivitiesPage({ page: 1, offset: 5 }));
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchActivitiesPage({ page: 1, offset: 5 }));
    setPage(1);
  };

  const fetchMore = async () => {
    const nextPage = page + 1;
    try {
      await dispatch(fetchActivitiesPage({ page: nextPage, offset: 5 })).unwrap();
      setPage(nextPage);
    } catch {
      // Managed by the slice
    }
  };

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
        <InfiniteScroll
          dataLength={activityList.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={<div className=" flex flex-col gap-16 py-10">
            <ScrollLoader />
          </div>}
          endMessage={
            <p className="text-center my-6 font-medium py-4 text-sm text-secondary">
              No more activities to load.
            </p>
          }
        >
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
        </InfiniteScroll>
      </section>
    </main>
  );
};

export default AllActivities;
