import { Link, useSearchParams } from "react-router-dom";
import NearbyActivities from "../../components/home/NearbyActivities";
import InterestChips from "../../components/common/InterestChips";
import { useState } from "react";
import ExploreActivitiesCard from "../../components/home/ExploreActivitiesCard";
import TitleText from "../../../../components/common/TitleText";
import GradientLinkButton from "../../../../components/common/GradientLinkButton";
import ErrorState from "../../../../components/common/ErrorState";
import EmptyState from "../../../../components/common/EmptyState";
import { ResponsiveCardListSkeleton } from "../../../../components/common/HomeLoader";
import SEOHead from "../../../../components/common/SEOHead";
import { useActivities } from "../../../../hooks/useActivitiesQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useSyncFilters, evictFilterFromCache } from "../../../../utils/filter";
import { encodeId } from "../../../../utils/idEncoder";

const Activities = () => {
  useSyncFilters();
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState(() => sessionStorage.getItem("activities_page_filter") || "");
  const [searchParams] = useSearchParams();

  const handleSetSelectedFilter = (value: React.SetStateAction<string>) => {
    setSelectedFilter((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (next) {
        sessionStorage.setItem("activities_page_filter", next);
      } else {
        sessionStorage.removeItem("activities_page_filter");
        if (prev) {
          evictFilterFromCache(queryClient, "interest", prev);
        }
      }
      return next;
    });
  };

  // Combine query parameters for React Query key-based caching
  const activityQueryString = (() => {
    const params = new URLSearchParams();
    const loc = searchParams.get("location");
    const interest = selectedFilter || searchParams.get("interest");
    const date = searchParams.get("created_date");
    if (loc) params.set("location", loc);
    if (interest) params.set("interest", interest);
    if (date) params.set("created_date", date);
    return params.toString() ? `?${params.toString()}` : "";
  })();

  // Fetch activities (Query Keys include the query strings for caching)
  const {
    data: nearbyActivitiesList = [],
    isLoading: nearbyLoading,
    error: nearbyError,
    refetch: refetchNearby,
  } = useActivities(activityQueryString);

  const {
    data: exploreActivitiesList = [],
    isLoading: exploreLoading,
    error: exploreError,
    refetch: refetchExplore,
  } = useActivities("");

  const handleRetry = () => {
    refetchNearby();
    refetchExplore();
  };

  const error = nearbyError || exploreError;



  if (error && nearbyActivitiesList.length === 0 && exploreActivitiesList.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-16 py-10">
        <ErrorState title="Unable to load Activities" message={error?.message || "An error occurred."} onRetry={handleRetry} />
      </div>
    );
  }

  // Fallback Logic
  const isNearbyActivitiesFallback = nearbyActivitiesList.some((act: any) => act.is_fallback);
  const filteredNearbyActivities = nearbyActivitiesList;

  const filteredExploreActivities = exploreActivitiesList;

  const isActivityFiltered = !!selectedFilter || !!searchParams.get("interest") || !!searchParams.get("location") || !!searchParams.get("created_date");
  const activeInterest = selectedFilter || searchParams.get("interest") || "";
  const activeLocation = searchParams.get("location") || "";
  const dynamicActivityTitle = activeInterest || activeLocation
    ? `${activeInterest ? activeInterest + " " : ""}Activities${activeLocation ? " in " + activeLocation : ""} | FlocknGo Events`
    : "Explore Nearby Local Activities & Events | FlocknGo";

  return (
    <main className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <SEOHead
        title={dynamicActivityTitle}
        description="Discover nearby local activities, outdoor adventures, workshops, and fun experiences. Join exciting local events with FlocknGo."
        keywords={`local activities, events near me, local experiences, fun activities, community events, ${activeInterest}, ${activeLocation}`}
        canonicalPath="/activities"
        domain="events"
        schemaType="ItemList"
        schemaData={{
          items: filteredNearbyActivities.map((act: any) => ({
            name: act.name || act.activity_name || act.title || "Activity",
            url: `https://events.flockngo.com/flocks/${encodeId(act.flock_id || 1)}/activities/${encodeId(act.id || act.activity_id)}/detail`,
          })),
        }}
      />
      <h1 className="sr-only">Discover Local Activities and Upcoming Events - FlocknGo</h1>
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
            No activities match your current search/location. Showing recommendations:
          </p>
        )}

        {nearbyLoading ? (
          <ResponsiveCardListSkeleton />
        ) : filteredNearbyActivities.length === 0 ? (
          <EmptyState message="No nearby activities found" />
        ) : (
          <>
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:hidden">
              {filteredNearbyActivities.map((activity) => (
                <div key={activity.id} className="min-w-[45%] flex-shrink-0 snap-start sm:min-w-[65%] md:min-w-[45%]">
                  <Link to={`/flocks/${encodeId(activity.flock_id || activity.id)}/activities/${encodeId(activity.id)}/detail`}>
                    <NearbyActivities activity={activity} />
                  </Link>
                </div>
              ))}
            </div>

            {/* Activities List */}
            <div className="hidden gap-8 md:gap-4 lg:grid lg:grid-cols-5">
              {filteredNearbyActivities.slice(0, 5).map((activity) => (
                <Link key={activity.id} to={`/flocks/${encodeId(activity.flock_id || activity.id)}/activities/${encodeId(activity.id)}/detail`}>
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
        {exploreLoading ? (
          <ResponsiveCardListSkeleton />
        ) : filteredExploreActivities.length === 0 ? (
          <EmptyState message="No activities found" />
        ) : (
          <>
            {/* Mobile Carousel */}
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:hidden">
              {filteredExploreActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="min-w-[45%] flex-shrink-0 snap-start sm:min-w-[65%] md:min-w-[45%]">
                  <Link to={`/flocks/${encodeId(activity.flock_id || activity.id)}/activities/${encodeId(activity.id)}/detail`}>
                    <ExploreActivitiesCard activity={activity} />
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden gap-8 md:gap-4 lg:grid lg:grid-cols-5">
              {filteredExploreActivities.slice(0, 5).map((activity) => (
                <Link key={activity.id} to={`/flocks/${encodeId(activity.flock_id || activity.id)}/activities/${encodeId(activity.id)}/detail`}>
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

export default Activities;
