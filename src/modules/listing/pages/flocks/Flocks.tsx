import { Link, useSearchParams } from "react-router-dom";
import { filterOptions } from "../../../../constants/data";
import FilterButton from "../../components/common/FilterButton";
import { useState } from "react";
import HomeLoader from "../../../../components/common/HomeLoader";
import CommunityFlocksCard from "../../components/home/CommunityFlocksCard";
import TitleText from "../../../../components/common/TitleText";
import GradientLinkButton from "../../../../components/common/GradientLinkButton";
import NearbyFlock from "../../components/home/NearbyFlock";
import ErrorState from "../../../../components/common/ErrorState";
import EmptyState from "../../../../components/common/EmptyState";
import { useSEO } from "../../../../hooks/useSEO";
import { useFlocks } from "../../../../hooks/useFlocksQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useSyncFilters, evictFilterFromCache } from "../../../../utils/filter";

const Flocks = () => {
  useSyncFilters();
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState(() => sessionStorage.getItem("flocks_page_filter") || "");
  const [searchParams] = useSearchParams();

  const handleSetSelectedFilter = (value: React.SetStateAction<string>) => {
    setSelectedFilter((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (next) {
        sessionStorage.setItem("flocks_page_filter", next);
      } else {
        sessionStorage.removeItem("flocks_page_filter");
        if (prev) {
          evictFilterFromCache(queryClient, "interest", prev);
        }
      }
      return next;
    });
  };

  // Combine query parameters for React Query key-based caching
  const flockQueryString = (() => {
    const params = new URLSearchParams();
    const loc = searchParams.get("location");
    const interest = selectedFilter || searchParams.get("interest");
    const date = searchParams.get("created_date");
    if (loc) params.set("location", loc);
    if (interest) params.set("interest", interest);
    if (date) params.set("created_date", date);
    return params.toString() ? `?${params.toString()}` : "";
  })();

  const communityFlockQueryString = (() => {
    const params = new URLSearchParams();
    const loc = searchParams.get("location");
    const interest = searchParams.get("interest");
    const date = searchParams.get("created_date");
    if (loc) params.set("location", loc);
    if (interest) params.set("interest", interest);
    if (date) params.set("created_date", date);
    return params.toString() ? `?${params.toString()}` : "";
  })();

  // Fetch flocks (Query Keys include the query strings for caching)
  const {
    data: nearbyFlockList = [],
    isLoading: nearbyLoading,
    error: nearbyError,
    refetch: refetchNearby,
  } = useFlocks(flockQueryString);

  const {
    data: communityFlockList = [],
    isLoading: communityLoading,
    error: communityError,
    refetch: refetchCommunity,
  } = useFlocks(communityFlockQueryString);

  const isFlockFiltered = !!selectedFilter || !!searchParams.get("interest") || !!searchParams.get("location") || !!searchParams.get("created_date");

  useSEO({
    title: "Flocks | FlocknGo - Find & Connect with Community Groups",
    description: "Browse and discover local social groups, clubs, and interest-based flocks. Connect with like-minded people near you with FlocknGo.",
    keywords: "local social groups, interest groups, find community, meetup groups, social club",
  });

  const handleRetry = () => {
    refetchNearby();
    refetchCommunity();
  };

  const loading = nearbyLoading || communityLoading;
  const error = nearbyError || communityError;
  const flockList = nearbyFlockList; // placeholder for initial length check

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
        <ErrorState title="Unable to load Flocks" message={error.message} onRetry={handleRetry} />
      </div>
    );
  }

  // Client-side filtering logic (now bypassed as API returns pre-filtered data)
  const filteredNearbyFlocks = nearbyFlockList;
  const filteredCommunityFlocks = communityFlockList;

  return (
    <main className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <h1 className="sr-only">Browse Local Flocks and Social Groups - FlocknGo</h1>
      {/* Nearby Flocks */}
      <section className="">
        {/* Heading */}
        <div className="mb-4 flex justify-between">
          <div className="">
            <TitleText title={isFlockFiltered ? "Filtered Flocks" : "Nearby Flocks"} />
            <p className="text-secondary text-base">Enable your location to get personalized results.</p>
          </div>
          <div className="">
            <GradientLinkButton to="/flocks/nearby-flocks" />
          </div>
        </div>

        {filteredNearbyFlocks.length === 0 ? (
          <EmptyState message="No nearby flocks found" />
        ) : (
          <>
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
              {filteredNearbyFlocks.slice(0, 5).map((flock) => (
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
              {filteredNearbyFlocks.slice(0, 5).map((flock) => (
                <Link key={flock.id} to={`/flocks/${flock.id}/detail`}>
                  <NearbyFlock flock={flock} />
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Filter button */}
        <div className="scrollbar-hide mt-16 flex gap-4 overflow-scroll overflow-y-hidden">
          {filterOptions.map((item, index) => (
            <FilterButton
              key={index}
              Icon={item.icon}
              label={item.label}
              selectedFilter={selectedFilter}
              setSelectedFilter={handleSetSelectedFilter}
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

        {filteredCommunityFlocks.length === 0 ? (
          <EmptyState message="No flocks found" />
        ) : (
          <>
            {/* Mobile Carousel */}
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
              {filteredCommunityFlocks.slice(0, 5).map((flock, index) => (
                <div key={flock.id} className="min-w-[90%] flex-shrink-0 snap-center sm:min-w-[70%]">
                  <CommunityFlocksCard card={flock} index={index} />
                </div>
              ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden auto-rows-auto grid-cols-1 gap-4 lg:grid lg:grid-cols-12">
              {filteredCommunityFlocks.slice(0, 5).map((flock, index) => (
                <CommunityFlocksCard key={flock.id} card={flock} index={index} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Flocks;
