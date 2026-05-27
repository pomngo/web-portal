import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageHeader from "../../../../components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchFlocksPage } from "../../../../store/slices/flockSlice";
import NearbyFlock from "../../components/home/NearbyFlock";
import InfiniteScroll from "react-infinite-scroll-component";
import ScrollLoader from "../../../../components/common/ScrollLoader";

import ErrorState from "../../../../components/common/ErrorState";
import HomeLoader from "../../../../components/common/HomeLoader";
import { useSEO } from "../../../../hooks/useSEO";

const AllFlocks = () => {
  const { search_by } = useParams();
  const { flocks, hasMore, loading, error } = useAppSelector((state) => state.flock);
  const flockList = flocks;
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();

  const fetchMore = async () => {
    const nextPage = page + 1;
    try {
      await dispatch(fetchFlocksPage({ page: nextPage, offset: 5 })).unwrap();
      setPage(nextPage);
    } catch {
      // The hasMore flag is managed by the slice on failure.
    }
  };

  useEffect(() => {
    dispatch(fetchFlocksPage({ page: 1, offset: 5 }));
  }, [dispatch]);

  useSEO({
    title: `All Flocks - ${search_by || "Nearby"} | FlocknGo`,
    description: `Discover and browse through all our local community flocks and groups matching ${search_by || "your interest"}. Join now on FlocknGo!`,
    keywords: "discover flocks, find community, local social groups, join social group",
  });

  const handleRetry = () => {
    dispatch(fetchFlocksPage({ page: 1, offset: 5 }));
    setPage(1);
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
        <ErrorState title="Unable to load Flocks" message={error} onRetry={handleRetry} />
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
          next={fetchMore}
          hasMore={hasMore}
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
