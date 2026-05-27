import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../../components/common/PageHeader";
import NearbyFlock from "../../components/home/NearbyFlock";
import InfiniteScroll from "react-infinite-scroll-component";
import ScrollLoader from "../../../../components/common/ScrollLoader";
import ErrorState from "../../../../components/common/ErrorState";
import HomeLoader from "../../../../components/common/HomeLoader";
import { useSEO } from "../../../../hooks/useSEO";
import { useInfiniteFlocks } from "../../../../hooks/useFlocksQuery";

const AllFlocks = () => {
  const { search_by } = useParams();

  const {
    data,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteFlocks("", 5);

  const flockList = data?.pages.flatMap((page) => page.items) || [];

  useSEO({
    title: `All Flocks - ${search_by || "Nearby"} | FlocknGo`,
    description: `Discover and browse through all our local community flocks and groups matching ${search_by || "your interest"}. Join now on FlocknGo!`,
    keywords: "discover flocks, find community, local social groups, join social group",
  });

  const handleRetry = () => {
    refetch();
  };

  if (loading && flockList.length === 0) {
    return (
      <div className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <HomeLoader type="all-flocks" />
      </div>
    );
  }

  if (error && flockList.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-16 py-10">
        <ErrorState title="Unable to load Flocks" message={error.message} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <h1 className="sr-only">Explore All Community Flocks - {search_by || "Nearby"}</h1>
      {/* Nearby Flocks */}
      <section className="">
        <PageHeader slug={search_by} />

        {/* Activities List */}
        <InfiniteScroll
          dataLength={flockList.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="flex flex-col gap-16 py-10">
              <ScrollLoader />
            </div>
          }
          endMessage={
            <p className="text-secondary my-6 py-4 text-center text-sm font-medium">No more flocks are there.</p>
          }
        >
          <div className="grid grid-cols-1 gap-4 gap-x-4 gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {flockList.map((flock) => (
              <Link key={flock.id} to={`/flocks/${flock.id}/detail`}>
                <NearbyFlock flock={flock} />
              </Link>
            ))}
          </div>
        </InfiniteScroll>
      </section>
    </main>
  );
};

export default AllFlocks;
