import { Link, useSearchParams } from "react-router-dom";
import NearbyActivities from "../../components/home/NearbyActivities";
import InterestChips from "../../components/common/InterestChips";
import { useState } from "react";
import { Icons } from "../../../../constants/icons";
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

  // Descriptive metadata aligned with search intent and brand clarity
  let pageTitle = "Upcoming Events & Activities in India | FlocknGo";
  let pageDescription = "Discover upcoming events, weekend activities, creative workshops, and local gatherings across India. Browse schedules, explore venues, and join experiences on FlocknGo.";
  let pageH1 = "Upcoming Events & Activities in India";

  if (activeLocation && activeInterest) {
    const formattedInterest = activeInterest.charAt(0).toUpperCase() + activeInterest.slice(1);
    pageTitle = `${formattedInterest} Activities & Events in ${activeLocation} | FlocknGo`;
    pageDescription = `Discover ${activeInterest} events and activities in ${activeLocation}. Browse upcoming schedules, venues, and join local experiences on FlocknGo.`;
    pageH1 = `${formattedInterest} Events & Activities in ${activeLocation}`;
  } else if (activeLocation) {
    pageTitle = `Upcoming Events & Activities in ${activeLocation} | FlocknGo`;
    pageDescription = `Discover upcoming events, weekend activities, and workshops in ${activeLocation}. Explore event schedules, venues, and connect with organizers on FlocknGo.`;
    pageH1 = `Upcoming Events & Activities in ${activeLocation}`;
  } else if (activeInterest) {
    const lowerInterest = activeInterest.toLowerCase();
    if (lowerInterest === "creative" || lowerInterest.includes("workshop") || lowerInterest.includes("art")) {
      pageTitle = "Creative Workshops & Hobby Classes in India | FlocknGo";
      pageDescription = "Discover creative workshops, pottery classes, art sessions, and learning activities across India. Connect with hosts and book your spot on FlocknGo.";
      pageH1 = "Creative Workshops & Hobby Classes";
    } else if (lowerInterest === "fitness") {
      pageTitle = "Fitness Activities & Sports Meetups in India | FlocknGo";
      pageDescription = "Discover local fitness activities, morning yoga sessions, group runs, and sports meetups across India. Stay active with FlocknGo.";
      pageH1 = "Fitness Activities & Sports Meetups";
    } else if (lowerInterest === "social") {
      pageTitle = "Social Activities & Community Gatherings in India | FlocknGo";
      pageDescription = "Explore social gatherings, club meetups, and community hangouts across India. Meet like-minded people and attend events with FlocknGo.";
      pageH1 = "Social Activities & Community Gatherings";
    } else {
      const formattedInterest = activeInterest.charAt(0).toUpperCase() + activeInterest.slice(1);
      pageTitle = `${formattedInterest} Events & Activities in India | FlocknGo`;
      pageDescription = `Explore ${activeInterest} events, workshops, and gatherings across India. Connect with local communities on FlocknGo.`;
      pageH1 = `${formattedInterest} Events & Activities`;
    }
  } else if (activeDate) {
    pageTitle = "Events Happening Today & This Weekend | FlocknGo";
    pageDescription = "Find upcoming events and activities happening today or this weekend across India. Explore schedules and participate on FlocknGo.";
    pageH1 = "Events Happening Today & This Weekend";
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

      {/* Featured Location Activities */}
      <section className="mb-20 lg:mb-0 border-t border-slate-200/60 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-primary-dark text-base sm:text-lg font-bold">
              Looking for events in major cities?
            </h2>
            <p className="text-secondary/70 text-xs sm:text-sm">
              Discover upcoming activities and weekend events by city.
            </p>
          </div>
          <Link
            to="/activities/location/mumbai"
            className="from-btn02 to-btn01 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-tr px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all duration-300 hover:scale-105 active:scale-95 w-fit"
          >
            <span>Explore Activities in Mumbai</span>
            <Icons.rightArrow className="h-4 w-4 text-white" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Activities;
