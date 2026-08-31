import { Link, useParams, useSearchParams } from "react-router-dom";
import NearbyActivities from "../../components/home/NearbyActivities";
import HomeLoader, { CardSkeleton } from "../../../../components/common/HomeLoader";
import PageHeader from "../../../../components/common/PageHeader";
import ScrollLoader from "../../../../components/common/ScrollLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import ErrorState from "../../../../components/common/ErrorState";
import { useSEO } from "../../../../hooks/useSEO";
import { useInfiniteActivities } from "../../../../hooks/useActivitiesQuery";
import { useSyncFilters } from "../../../../utils/filter";

const AllActivities = () => {
  useSyncFilters();
  const { search_by } = useParams();
  const [searchParams] = useSearchParams();
  const activityQueryString = (() => {
    const params = new URLSearchParams();
    const loc = searchParams.get("location");
    const interest = searchParams.get("interest");
    const date = searchParams.get("created_date");
    if (loc) params.set("location", loc);
    if (interest) params.set("interest", interest);
    if (date) params.set("created_date", date);
    return params.toString() ? `?${params.toString()}` : "";
  })();

  const {
    data,
    isLoading: loading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteActivities(activityQueryString, 5);

  const activityList = data?.pages.flatMap((page) => page.items) || [];

  const filteredActivityList = activityList;

  const skeletonCount = isFetchingNextPage
    ? (filteredActivityList.length % 2 !== 0 ? 3 : 2)
    : (hasNextPage && filteredActivityList.length % 2 !== 0 ? 1 : 0);

  useSEO({
    title: `All Activities - ${search_by || "Nearby"} | FlocknGo`,
    description: `Discover all our local activities, experiences, and events matching ${search_by || "your interest"}. Join now on FlocknGo!`,
    keywords: "discover activities, find local events, local experiences, social meetup activities",
  });

  const handleRetry = () => {
    refetch();
  };



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

        {loading && activityList.length === 0 ? (
          <HomeLoader type="all-activities" />
         ) : (
          <InfiniteScroll
            dataLength={filteredActivityList.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={null}
            endMessage={
              <p className="text-secondary my-6 py-4 text-center text-sm font-medium">No more activities to load.</p>
            }
          >
            <div className="grid grid-cols-2 gap-2.5 gap-y-8 sm:gap-4 sm:gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {filteredActivityList.map((activity) => (
                <Link key={activity.id} to={`/flocks/${activity.flock_id || activity.id}/activities/${activity.id}/detail`}>
                  <NearbyActivities activity={activity} />
                </Link>
              ))}
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <CardSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </section>
    </main>
  );
};

export default AllActivities;
