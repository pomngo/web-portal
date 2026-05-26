import { Link } from "react-router-dom";
import { filterOptions } from "../../../../constants/data";
import FilterButton from "../../components/common/FilterButton";
import { useEffect, useState } from "react";
import HomeLoader from "../../../../components/common/HomeLoader";
import CommunityFlocksCard from "../../components/home/CommunityFlocksCard";
import TitleText from "../../../../components/common/TitleText";
import GradientLinkButton from "../../../../components/common/GradientLinkButton";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { listFlocks } from "../../../../store/slices/flockSlice";
import NearbyFlock from "../../components/home/NearbyFlock";

import ErrorState from "../../../../components/common/ErrorState";

const Flocks = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const { flocks, loading, error, isInitialized } = useAppSelector((state) => state.flock);
  const dispatch = useAppDispatch();

  const flockList = flocks;

  useEffect(() => {
    if (!isInitialized) {
      dispatch(listFlocks("?is_discoverable=true&page=1&offset=5"));
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    document.title = "Flocks | Flockn Go";
  }, []);

  const handleRetry = () => {
    dispatch(listFlocks("?is_discoverable=true&page=1&offset=5"));
  };

  if (loading && flockList.length === 0) {
    return (
      <div className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <HomeLoader type="flocks" />
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
      {/* Nearby Flocks */}
      <section className="">
        {/* Heading */}
        <div className="mb-4 flex justify-between">
          <div className="">
            <TitleText title="Nearby Flocks" />
            <p className="text-secondary text-base">Enable your location to get personalized results.</p>
          </div>
          <div className="">
            <GradientLinkButton to="/flocks/nearby-flocks" />
          </div>
        </div>

        <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
          {flockList.slice(0, 5).map((flock) => (
            <Link
              key={flock.id}
              to={`/flocks/${flock.id}/detail`}
              className="min-w-[85%] flex-shrink-0 snap-center sm:min-w-[65%] md:min-w-[45%]"
            >
              <NearbyFlock flock={flock} />
            </Link>
          ))}
        </div>

        {/* Activities List */}
        <div className="hidden gap-8 md:gap-4 lg:grid lg:grid-cols-5">
          {flockList.slice(0, 5).map((flock) => (
            <Link key={flock.id} to={`/flocks/${flock.id}/detail`}>
              <NearbyFlock flock={flock} />
            </Link>
          ))}
        </div>

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

      {/* Community Flocks */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <TitleText title="Community Flocks" />
          </div>

          <div>
            <GradientLinkButton to="/flocks/community-flocks" />
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
          {flockList.slice(0, 5).map((flock, index) => (
            <div key={flock.id} className="min-w-[90%] flex-shrink-0 snap-center sm:min-w-[70%]">
              <CommunityFlocksCard card={flock} index={index} />
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden auto-rows-auto grid-cols-1 gap-4 lg:grid lg:grid-cols-12">
          {flockList.slice(0, 5).map((flock, index) => (
            <CommunityFlocksCard key={flock.id} card={flock} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Flocks;
