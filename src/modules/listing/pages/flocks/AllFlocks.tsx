import { Link, useParams, useSearchParams } from "react-router-dom";
import PageHeader from "../../../../components/common/PageHeader";
import NearbyFlock from "../../components/home/NearbyFlock";
import InfiniteScroll from "react-infinite-scroll-component";
import ErrorState from "../../../../components/common/ErrorState";
import HomeLoader, { CardSkeleton } from "../../../../components/common/HomeLoader";
import SEOHead from "../../../../components/common/SEOHead";
import { useInfiniteFlocks } from "../../../../hooks/useFlocksQuery";
import { useSyncFilters } from "../../../../utils/filter";
import { encodeId } from "../../../../utils/idEncoder";

const getFlockSlugMeta = (slug?: string) => {
  const s = (slug || "").toLowerCase();
  if (s === "community-flocks" || s === "community") {
    return {
      title: "Local Community Activities & Social Groups Near Me | FlocknGo",
      description: "Join local community activities, meetup groups, and social flocks near you. Connect with like-minded local communities on FlocknGo.",
      h1: "Local Community Activities & Social Groups Near Me",
    };
  }
  if (s === "nearby-flocks" || s === "nearby") {
    return {
      title: "Group Activities Near Me | Community Groups & Flocks | FlocknGo",
      description: "Discover group activities near me and connect with nearby community flocks. Find social activities and interest groups in your city.",
      h1: "Group Activities & Community Flocks Near Me",
    };
  }
  const formatted = slug
    ? slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
    : "Community Flocks";
  return {
    title: `${formatted} - Community Flocks & Group Activities | FlocknGo`,
    description: `Discover ${formatted} community flocks and group activities near you. Join interest clubs and social groups on FlocknGo.`,
    h1: `${formatted} - Community Flocks & Group Activities`,
  };
};

const AllFlocks = () => {
  useSyncFilters();
  const { search_by } = useParams();
  const slugMeta = getFlockSlugMeta(search_by);
  const [searchParams] = useSearchParams();
  const flockQueryString = (() => {
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
  } = useInfiniteFlocks(flockQueryString, 5);

  const flockList = data?.pages.flatMap((page) => page.items) || [];

  const filteredFlockList = flockList;

  const skeletonCount = isFetchingNextPage
    ? (filteredFlockList.length % 2 !== 0 ? 3 : 2)
    : (hasNextPage && filteredFlockList.length % 2 !== 0 ? 1 : 0);

  const handleRetry = () => {
    refetch();
  };



  if (error && flockList.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-16 py-10">
        <ErrorState title="Unable to load Flocks" message={error.message} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <SEOHead
        title={slugMeta.title}
        description={slugMeta.description}
        canonicalPath={`/flocks/${search_by || "community-flocks"}`}
        domain="events"
      />
      <h1 className="sr-only">{slugMeta.h1}</h1>
      {/* Nearby Flocks */}
      <section className="">
        <PageHeader slug={search_by} />

        {loading && flockList.length === 0 ? (
          <HomeLoader type="all-flocks" />
        ) : (
          <InfiniteScroll
            dataLength={filteredFlockList.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={null}
            endMessage={
              <p className="text-secondary my-6 py-4 text-center text-sm font-medium">No more flocks are there.</p>
            }
          >
            <div className="grid grid-cols-2 gap-2.5 gap-y-8 sm:gap-4 sm:gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredFlockList.map((flock) => (
                <Link key={flock.id} to={`/flocks/${encodeId(flock.id)}/detail`}>
                  <NearbyFlock flock={flock} />
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

export default AllFlocks;
