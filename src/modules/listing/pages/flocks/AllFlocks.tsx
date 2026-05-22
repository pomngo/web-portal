import { Link, useNavigate, useParams } from "react-router-dom";
import { Icons } from "../../../../constants/icons";
import { useEffect, useState } from "react";
import TitleText from "../../../../components/common/TitleText";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchFlocksPage } from "../../../../store/slices/flockSlice";
import NearbyFlock from "../../components/home/NearbyFlock";
import InfiniteScroll from "react-infinite-scroll-component";
import ScrollLoader from "../../../../components/common/ScrollLoader";

import ErrorState from "../../../../components/common/ErrorState";
import HomeLoader from "../../../../components/common/HomeLoader";

const AllFlocks = () => {
  const navigate = useNavigate();
  const { search_by } = useParams();
  const { flocks, hasMore, loading, error } = useAppSelector((state) => state.flock);
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

  useEffect(() => {
    document.title = "All Flocks | Flockn Go";
  }, []);

  const handleRetry = () => {
    dispatch(fetchFlocksPage({ page: 1, offset: 5 }));
    setPage(1);
  };

  if (loading && flocks.length === 0) {
    return (
      <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col gap-16 py-10">
        <HomeLoader type="all-flocks" />
      </div>
    );
  }

  if (error && flocks.length === 0) {
    return (
      <div className="min-h-screen px-16 flex items-center justify-center py-10">
        <ErrorState
          title="Unable to load Flocks"
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <main className="h-screen px-4  sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col gap-16 py-10">
      {/* Nearby Flocks */}
      <section className="">
        {/* Heading */}
        <div className="flex justify-between items-center mb-4">
          <div className="">
            <TitleText
              title={`
              ${search_by
                ?.split("-")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
                )
                .join(" ")}`}
            />
          </div>
          <div className="">
            <button
              onClick={() => navigate(-1)}
              className="bg-linear-to-tr from-btn02 to-btn01 to-75% px-5 py-2 bg-clip-text text-transparent transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <Icons.leftArrow className="text-btn01" /> Back
            </button>
          </div>
        </div>

        {/* Activities List */}
        <InfiniteScroll
          dataLength={flocks.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={<div className=" flex flex-col gap-16 py-10">
            <ScrollLoader />
          </div>}
          endMessage={
            <p className="text-center my-6 font-medium py-4 text-sm text-secondary">
              No more flocks are there.
            </p>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-x-4 gap-y-16">
            {flocks?.map((flock: any) => (
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
