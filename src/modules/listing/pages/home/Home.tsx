import { Link, useSearchParams } from "react-router-dom";
import NearbyActivities from "../../components/home/NearbyActivities";
import InterestChips from "../../components/common/InterestChips";
import CommunityFlocksCard from "../../components/home/CommunityFlocksCard";
import ExploreActivitiesCard from "../../components/home/ExploreActivitiesCard";
import { useState } from "react";
import { ResponsiveCardListSkeleton, ResponsiveBentoFlockListSkeleton } from "../../../../components/common/HomeLoader";
import TitleText from "../../../../components/common/TitleText";
import GradientLinkButton from "../../../../components/common/GradientLinkButton";
import ErrorState from "../../../../components/common/ErrorState";
import EmptyState from "../../../../components/common/EmptyState";
import { useSEO } from "../../../../hooks/useSEO";
import { useFlocks } from "../../../../hooks/useFlocksQuery";
import { useActivities } from "../../../../hooks/useActivitiesQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useSyncFilters, evictFilterFromCache } from "../../../../utils/filter";

const Home = () => {
  useSyncFilters();
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState(() => sessionStorage.getItem("home_activity_filter") || "");
  const [searchParams] = useSearchParams();

  const handleSetSelectedFilter = (value: React.SetStateAction<string>) => {
    setSelectedFilter((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (next) {
        sessionStorage.setItem("home_activity_filter", next);
      } else {
        sessionStorage.removeItem("home_activity_filter");
        if (prev) {
          evictFilterFromCache(queryClient, "interest", prev);
        }
      }
      return next;
    });
  };



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

  const activityQueryString = (() => {
    const params = new URLSearchParams();
    const loc = searchParams.get("location");
    const interest = selectedFilter || searchParams.get("interest");
    const date = searchParams.get("created_date");
    if (loc) params.set("location", loc);
    if (date) params.set("created_date", date);
    if (interest) params.set("interest", interest);
    return params.toString() ? `?${params.toString()}` : "";
  })();

  // Fetch flocks and activities (Query Key includes flockQueryString/activityQueryString for caching)
  const {
    data: flockList = [],
    isLoading: flockLoading,
    error: flockError,
    refetch: refetchFlocks,
  } = useFlocks(flockQueryString);

  const {
    data: nearbyActivities = [],
    isLoading: nearbyActivityLoading,
    error: nearbyActivityError,
    refetch: refetchNearbyActivities,
  } = useActivities(activityQueryString);

  const {
    data: exploreActivities = [],
    isLoading: exploreActivityLoading,
    error: exploreActivityError,
    refetch: refetchExploreActivities,
  } = useActivities("");

  useSEO({
    title: "Home | FlocknGo - Discover Nearby Activities & Groups",
    description:
      "Discover nearby local flocks, join exciting community activities, and make new connections. Find your interest and go with FlocknGo!",
    keywords: "activities near me, community events, local groups, join club, social meetups",
  });

  const handleRetry = () => {
    refetchFlocks();
    refetchNearbyActivities();
    refetchExploreActivities();
  };

  const activityError = nearbyActivityError || exploreActivityError;



  if ((flockError || activityError) && flockList.length === 0 && nearbyActivities.length === 0 && exploreActivities.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-16 py-10">
        <ErrorState
          title="Unable to load Home Feed"
          message={flockError?.message || activityError?.message || "An error occurred while fetching the feed."}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Determine filtering status for headers based on context-specific filters
  const isActivityFiltered = !!selectedFilter || !!searchParams.get("interest") || !!searchParams.get("location") || !!searchParams.get("created_date");
  const isFlockFiltered = !!selectedFilter || !!searchParams.get("interest") || !!searchParams.get("location") || !!searchParams.get("created_date");

  // Fallback Logic
  const isNearbyActivitiesFallback = nearbyActivities.some((act: any) => act.is_fallback);
  const filteredNearbyActivities = nearbyActivities;
  
  const isCommunityFlocksFallback = flockList.some((flock: any) => flock.is_fallback);
  const filteredCommunityFlocks = flockList;

  const filteredExploreActivities = exploreActivities;

  return (
    <main className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <h1 className="sr-only">FlocknGo - Discover Nearby Activities and Community Flocks</h1>
      {/* Nearby Activities */}
      <section className="">
        {/* Heading */}
        <div className="mb-4 flex justify-between">
          <div className="">
            <TitleText title={isActivityFiltered ? "Filtered Activities" : "Nearby Activities"} />
            <p className="text-secondary text-base">Enable your location to get personalized results.</p>
          </div>
          <div className="">
            <GradientLinkButton to="/activities/nearby-activities" />
          </div>
        </div>

        {isNearbyActivitiesFallback && (
          <p className="text-btn01 text-xs font-semibold mb-4 bg-orange-50/50 border border-orange-100 rounded-xl px-4 py-2.5 w-fit">
            No activities match your current search/location. Showing fallback recommendations:
          </p>
        )}

        {nearbyActivityLoading ? (
          <ResponsiveCardListSkeleton />
        ) : filteredNearbyActivities.length === 0 ? (
          <EmptyState message="No nearby activities found" />
        ) : (
          <>
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
              {filteredNearbyActivities.map((activity) => (
                <div key={activity.id} className="min-w-[85%] flex-shrink-0 snap-center sm:min-w-[65%] md:min-w-[45%]">
                  <NearbyActivities activity={activity} />
                </div>
              ))}
            </div>

            {/* Activities List */}
            <div className="hidden gap-8 md:gap-4 lg:grid lg:grid-cols-5">
              {filteredNearbyActivities.slice(0, 5).map((activity) => (
                <Link key={activity.id} to={`/flocks/${activity.flock_id || activity.id}/activities/${activity.id}/detail`}>
                  <NearbyActivities activity={activity} />
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
            <TitleText title={isFlockFiltered ? "Filtered Flocks" : "Community Flocks"} />
          </div>

          <div>
            <GradientLinkButton to="/flocks/community-flocks" />
          </div>
        </div>

        {isCommunityFlocksFallback && (
          <p className="text-btn01 text-xs font-semibold mb-4 bg-orange-50/50 border border-orange-100 rounded-xl px-4 py-2.5 w-fit">
            No flocks match your current search/location. Showing fallback recommendations:
          </p>
        )}

        {flockLoading ? (
          <ResponsiveBentoFlockListSkeleton />
        ) : filteredCommunityFlocks.length === 0 ? (
          <EmptyState message="No flocks found" />
        ) : (
          <>
            {/* Mobile Carousel */}
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:hidden">
              {filteredCommunityFlocks.slice(0, 5).map((flock, index) => (
                <div key={flock.id} className="min-w-[90%] flex-shrink-0 snap-center sm:min-w-[70%]">
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

      {/* Explore Activities */}
      <section className="mb-20 lg:mb-0">
        <div className="mb-4 flex justify-between">
          <div className="">
            <TitleText title="Explore Activities" />
            <p className="text-secondary text-xs sm:text-sm md:text-base">
              Explore these amazing flocks and fetch your interest
            </p>
          </div>
          <div className="">
            <GradientLinkButton to="/activities/explore-activities" />
          </div>
        </div>
        {exploreActivityLoading ? (
          <ResponsiveCardListSkeleton />
        ) : filteredExploreActivities.length === 0 ? (
          <EmptyState message="No activities found" />
        ) : (
          <>
            {/* Mobile Carousel */}
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
              {filteredExploreActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="min-w-[85%] flex-shrink-0 snap-center sm:min-w-[65%] md:min-w-[45%]">
                  <Link to={`/flocks/${activity.flock_id || activity.id}/activities/${activity.id}/detail`}>
                    <ExploreActivitiesCard activity={activity} />
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden gap-8 md:gap-4 lg:grid lg:grid-cols-5">
              {filteredExploreActivities.slice(0, 5).map((activity) => (
                <Link key={activity.id} to={`/flocks/${activity.flock_id || activity.id}/activities/${activity.id}/detail`}>
                  <ExploreActivitiesCard activity={activity} />
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Home;
