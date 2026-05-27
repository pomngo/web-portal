import { Link, useParams } from "react-router-dom";
import NearbyActivities from "../../components/home/NearbyActivities";
import HomeLoader from "../../../../components/common/HomeLoader";
import PageHeader from "../../../../components/common/PageHeader";
import ScrollLoader from "../../../../components/common/ScrollLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import ErrorState from "../../../../components/common/ErrorState";
import { useSEO } from "../../../../hooks/useSEO";
import { useInfiniteActivities } from "../../../../hooks/useActivitiesQuery";

const AllActivities = () => {
  const { search_by } = useParams();

  const {
    data,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteActivities("", 5);

  const activityList = data?.pages.flatMap((page) => page.items) || [];

  useSEO({
    title: `All Activities - ${search_by || "Nearby"} | FlocknGo`,
    description: `Discover all our local activities, experiences, and events matching ${search_by || "your interest"}. Join now on FlocknGo!`,
    keywords: "discover activities, find local events, local experiences, social meetup activities",
  });

  const handleRetry = () => {
    refetch();
  };

  if (loading && activityList.length === 0) {
    return (
      <div className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <HomeLoader type="all-activities" />
      </div>
    );
  }

  if (error && activityList.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-16 py-10">
        <ErrorState title="Unable to load Activities" message={error.message} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <h1 className="sr-only">Explore All Activities - {search_by || "Nearby"}</h1>
      {/* Nearby Flocks */}
      <section className="">
        <PageHeader slug={search_by} />

        {/* Activities List */}
        <InfiniteScroll
          dataLength={activityList.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="flex flex-col gap-16 py-10">
              <ScrollLoader />
            </div>
          }
          endMessage={
            <p className="text-secondary my-6 py-4 text-center text-sm font-medium">No more activities to load.</p>
          }
        >
          <div className="grid grid-cols-1 gap-4 gap-x-4 gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {activityList.map((activity) => (
              <Link key={activity.id} to={`/flocks/${activity.id}/activities/${activity.id}/detail`}>
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
