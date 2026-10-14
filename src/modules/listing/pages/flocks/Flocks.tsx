import { Link, useSearchParams } from "react-router-dom";
import InterestChips from "../../components/common/InterestChips";
import { useState } from "react";
import { ResponsiveCardListSkeleton, ResponsiveBentoFlockListSkeleton } from "../../../../components/common/HomeLoader";
import CommunityFlocksCard from "../../components/home/CommunityFlocksCard";
import TitleText from "../../../../components/common/TitleText";
import GradientLinkButton from "../../../../components/common/GradientLinkButton";
import NearbyFlock from "../../components/home/NearbyFlock";
import ErrorState from "../../../../components/common/ErrorState";
import EmptyState from "../../../../components/common/EmptyState";
import SEOHead from "../../../../components/common/SEOHead";
import { useFlocks } from "../../../../hooks/useFlocksQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useSyncFilters, evictFilterFromCache } from "../../../../utils/filter";
import { encodeId } from "../../../../utils/idEncoder";

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

  // Fetch flocks (Query Keys include the query strings for caching)
  const {
    data: nearbyFlockList = [],
    isLoading: nearbyLoading,
    error: nearbyError,
    refetch: refetchNearby,
  } = useFlocks(flockQueryString);

  const communityFlockQueryString = flockQueryString;

  const {
    data: communityFlockList = [],
    isLoading: communityLoading,
    error: communityError,
    refetch: refetchCommunity,
  } = useFlocks(communityFlockQueryString);

  const handleRetry = () => {
    refetchNearby();
    refetchCommunity();
  };

  const error = nearbyError || communityError;
  const flockList = nearbyFlockList; // placeholder for initial length check



  if (error && flockList.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-16 py-10">
        <ErrorState title="Unable to load Flocks" message={error.message} onRetry={handleRetry} />
      </div>
    );
  }

  // Fallback Logic
  const isNearbyFlocksFallback = nearbyFlockList.some((flock: any) => flock.is_fallback);
  const filteredNearbyFlocks = nearbyFlockList;

  const isCommunityFlocksFallback = communityFlockList.some((flock: any) => flock.is_fallback);
  const filteredCommunityFlocks = communityFlockList;

  const isFlockFiltered = !!selectedFilter || !!searchParams.get("interest") || !!searchParams.get("location") || !!searchParams.get("created_date");
  const activeInterest = selectedFilter || searchParams.get("interest") || "";
  const activeLocation = searchParams.get("location") || "";
  let pageTitle = "Community Events & Group Activities Near Me | FlocknGo";
  let pageDescription = "Discover community events near me, local community activities, and social groups. Connect with like-minded people for group activities with FlocknGo.";
  let pageH1 = "Community Groups & Group Activities Near Me";

  if (activeLocation && activeInterest) {
    const formattedInterest = activeInterest.charAt(0).toUpperCase() + activeInterest.slice(1);
    pageTitle = `${formattedInterest} Community Groups & Activities in ${activeLocation} | FlocknGo`;
    pageDescription = `Connect with ${activeInterest} community groups and social activities in ${activeLocation}. Join local clubs on FlocknGo.`;
    pageH1 = `${formattedInterest} Community Groups in ${activeLocation}`;
  } else if (activeLocation) {
    pageTitle = `Community Events & Groups in ${activeLocation} | FlocknGo`;
    pageDescription = `Discover local community groups and social activities in ${activeLocation}. Connect with people near you on FlocknGo.`;
    pageH1 = `Community Groups & Activities in ${activeLocation}`;
  } else if (activeInterest) {
    const formattedInterest = activeInterest.charAt(0).toUpperCase() + activeInterest.slice(1);
    pageTitle = `${formattedInterest} Community Groups & Social Activities Near Me | FlocknGo`;
    pageDescription = `Find ${activeInterest} groups and local community activities near you. Join clubs and connect on FlocknGo.`;
    pageH1 = `${formattedInterest} Community Groups & Activities Near Me`;
  }

  return (
    <main className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonicalPath="/flocks"
        domain="events"
        schemaType="ItemList"
        schemaData={{
          items: filteredNearbyFlocks.map((f: any) => ({
            name: f.name || f.flock_name || f.title || "Flock",
            url: `https://events.flockngo.com/flocks/${encodeId(f.id || f.flock_id)}/detail`,
          })),
        }}
      />
      <h1 className="sr-only">{pageH1}</h1>
      {/* Nearby Flocks */}
      <section className="">
        {/* Heading */}
        <div className="mb-4 flex justify-between">
          <div className="">
            <TitleText title={isFlockFiltered ? "Filtered Communities" : "Communities"} />
            <p className="text-secondary text-base">Enable your location to get personalized results.</p>
          </div>
          <div className="">
            <GradientLinkButton to="/flocks/nearby-flocks" />
          </div>
        </div>

        {isNearbyFlocksFallback && (
          <p className="text-btn01 text-xs font-semibold mb-4 bg-orange-50/50 border border-orange-100 rounded-xl px-4 py-2.5 w-fit">
            No flocks match your current search/location. Showing recommendations:
          </p>
        )}

        {nearbyLoading ? (
          <ResponsiveCardListSkeleton />
        ) : filteredNearbyFlocks.length === 0 ? (
          <EmptyState message="No nearby flocks found" />
        ) : (
          <>
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:hidden">
              {filteredNearbyFlocks.slice(0, 5).map((flock) => (
                <Link
                  key={flock.id}
                  to={`/flocks/${encodeId(flock.id)}/detail`}
                  className="min-w-[45%] flex-shrink-0 snap-start sm:min-w-[65%] md:min-w-[45%]"
                >
                  <NearbyFlock flock={flock} />
                </Link>
              ))}
            </div>

            {/* Activities List */}
            <div className="hidden gap-8 md:gap-4 lg:grid lg:grid-cols-5">
              {filteredNearbyFlocks.slice(0, 5).map((flock) => (
                <Link key={flock.id} to={`/flocks/${encodeId(flock.id)}/detail`}>
                  <NearbyFlock flock={flock} />
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Filter Chips */}
        <InterestChips
          selectedFilter={selectedFilter}
          setSelectedFilter={handleSetSelectedFilter}
        />
      </section>

      {/* Community Flocks */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <TitleText title={isFlockFiltered ? "Filtered Communities" : "Communities"} />
          </div>

          <div>
            <GradientLinkButton to="/flocks/community-flocks" />
          </div>
        </div>

        {isCommunityFlocksFallback && (
          <p className="text-btn01 text-xs font-semibold mb-4 bg-orange-50/50 border border-orange-100 rounded-xl px-4 py-2.5 w-fit">
            No flocks match your current search/location. Showing recommendations:
          </p>
        )}

        {communityLoading ? (
          <ResponsiveBentoFlockListSkeleton />
        ) : filteredCommunityFlocks.length === 0 ? (
          <EmptyState message="No flocks found" />
        ) : (
          <>
            {/* Mobile Carousel */}
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:hidden">
              {filteredCommunityFlocks.slice(0, 5).map((flock, index) => (
                <div key={flock.id} className="min-w-[45%] flex-shrink-0 snap-start sm:min-w-[65%]">
                  <CommunityFlocksCard card={flock} index={index} isUniform={filteredCommunityFlocks.length < 5} />
                </div>
              ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden auto-rows-auto grid-cols-1 gap-4 md:grid md:grid-cols-12">
              {filteredCommunityFlocks.slice(0, 5).map((flock, index) => (
                <CommunityFlocksCard key={flock.id} card={flock} index={index} isUniform={filteredCommunityFlocks.length < 5} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Flocks;
