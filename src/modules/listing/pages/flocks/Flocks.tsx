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
  const { flocks, loading, error } = useAppSelector((state) => state.flock);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(flocks.length === 0){
      dispatch(listFlocks("?is_discoverable=true&page=1&offset=5"));
    }
  }, [dispatch, flocks.length]);

  useEffect(() => {
    document.title = "Flocks | Flockn Go";
  }, []);

  const handleRetry = () => {
    dispatch(listFlocks("?is_discoverable=true&page=1&offset=5"));
  };

  if (loading && flocks.length === 0) {
    return (
      <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col gap-16 py-10">
        <HomeLoader type="flocks" />
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
    <main className="min-h-screen px-4  sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col gap-16 py-10">
      {/* Nearby Flocks */}
      <section className="">
        {/* Heading */}
        <div className="flex justify-between mb-4">
          <div className="">
            <TitleText title="Nearby Flocks" />
            <p className="text-secondary text-base">
              Enable your location to get personalized results.
            </p>
          </div>
          <div className="">
            <GradientLinkButton to="/flocks/nearby-flocks" />
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
          {flocks?.slice(0, 5).map((flock: any) => (
            <Link
              key={flock.id}
              to={`/flocks/${flock.id}/detail`}
            
              className="
        min-w-[85%] sm:min-w-[65%] md:min-w-[45%]
        snap-center
        flex-shrink-0
      "
            >
              <NearbyFlock flock={flock} />
            </Link>
          ))}
        </div>

        {/* Activities List */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-8 md:gap-4">
          {flocks?.slice(0, 5).map((flock: any) => (
            <Link
              key={flock.id}
              to={`/flocks/${flock.id}/detail`}
            >
              <NearbyFlock flock={flock} />
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

      {/* Community Flocks */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <div>
            <TitleText title="Community Flocks" />
          </div>

          <div>
            <GradientLinkButton to="/flocks/community-flocks" />
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
          {flocks?.slice(0, 5).map((flock: any, index: number) => (
            <div
              key={flock.id}
              className="
          min-w-[90%]
          sm:min-w-[70%]
          snap-center
          flex-shrink-0
        "
            >
              <CommunityFlocksCard card={flock} index={index} />
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-auto">
          {flocks?.slice(0, 5).map((flock: any, index: number) => (
            <CommunityFlocksCard key={flock.id} card={flock} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Flocks;
