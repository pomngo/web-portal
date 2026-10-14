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
  const activeDate = searchParams.get("created_date") || "";

  // Dynamic targeting aligned with FlocknGo primary, secondary, and location-specific keyword strategy
  let pageTitle = "Upcoming Events in India | Activities Near Me & Things to Do | FlocknGo";
  let pageDescription = "Explore upcoming events in India and activities near me. Find weekend activities, community events, workshops, and book event tickets online on FlocknGo.";
  let pageH1 = "Upcoming Events in India & Activities Near Me";

  if (activeLocation && activeInterest) {
    const formattedInterest = activeInterest.charAt(0).toUpperCase() + activeInterest.slice(1);
    pageTitle = `${formattedInterest} Activities & Events in ${activeLocation} | FlocknGo`;
    pageDescription = `Discover ${activeInterest} events and activities in ${activeLocation}. Find things to do this weekend, workshops, and book event tickets online.`;
    pageH1 = `${formattedInterest} Events & Activities in ${activeLocation}`;
  } else if (activeLocation) {
    pageTitle = `Upcoming Events in ${activeLocation} | Weekend Activities & Things to Do | FlocknGo`;
    pageDescription = `Discover upcoming events in ${activeLocation}. Explore weekend activities, workshops, cultural events, and things to do in ${activeLocation}. Book event tickets online.`;
    pageH1 = `Upcoming Events & Activities in ${activeLocation}`;
  } else if (activeInterest) {
    const lowerInterest = activeInterest.toLowerCase();
    if (lowerInterest === "creative" || lowerInterest.includes("workshop") || lowerInterest.includes("art")) {
      pageTitle = "Workshops Near Me | Creative & Hobby Classes | FlocknGo Events";
      pageDescription = "Find creative workshops near me, hobby classes, and learning activities in India. Book event tickets online with FlocknGo.";
      pageH1 = "Workshops & Creative Activities Near Me";
    } else if (lowerInterest === "fitness") {
      pageTitle = "Fitness Activities Near Me | Group Workouts & Sports Events | FlocknGo";
      pageDescription = "Discover fitness activities near me, group runs, yoga sessions, and sports meetups. Stay active with FlocknGo.";
      pageH1 = "Fitness Activities & Sports Events Near Me";
    } else if (lowerInterest === "social") {
      pageTitle = "Social Activities & Community Events Near Me | FlocknGo";
      pageDescription = "Join social activities near me, local community events, and group meetups. Make new connections and attend events.";
      pageH1 = "Social Activities & Community Gatherings Near Me";
    } else {
      const formattedInterest = activeInterest.charAt(0).toUpperCase() + activeInterest.slice(1);
      pageTitle = `${formattedInterest} Events & Activities Near Me | FlocknGo`;
      pageDescription = `Explore ${activeInterest} events and activities near you. Connect with local communities and book event tickets online.`;
      pageH1 = `${formattedInterest} Events & Activities Near Me`;
    }
  } else if (activeDate) {
    pageTitle = "Events Happening Today & This Weekend Near Me | FlocknGo Events";
    pageDescription = "Find events happening today, weekend activities near me, and things to do this weekend. Book event tickets online on FlocknGo.";
    pageH1 = "Events Happening Today & This Weekend Near Me";
  }

  return (
    <main className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
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
      <h1 className="sr-only">{pageH1}</h1>
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
