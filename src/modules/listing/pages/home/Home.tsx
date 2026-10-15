import { Link, useSearchParams } from "react-router-dom";
import NearbyActivities from "../../components/home/NearbyActivities";
import InterestChips from "../../components/common/InterestChips";
import CommunityFlocksCard from "../../components/home/CommunityFlocksCard";
import ExploreActivitiesCard from "../../components/home/ExploreActivitiesCard";
import { useState, useCallback, useMemo } from "react";
import { ResponsiveCardListSkeleton, ResponsiveBentoFlockListSkeleton } from "../../../../components/common/HomeLoader";
import TitleText from "../../../../components/common/TitleText";
import GradientLinkButton from "../../../../components/common/GradientLinkButton";
import ErrorState from "../../../../components/common/ErrorState";
import EmptyState from "../../../../components/common/EmptyState";
import SEOHead from "../../../../components/common/SEOHead";
import { useFlocks } from "../../../../hooks/useFlocksQuery";
import { useActivities } from "../../../../hooks/useActivitiesQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useSyncFilters, evictFilterFromCache } from "../../../../utils/filter";
import { encodeId } from "../../../../utils/idEncoder";

const HOME_FAQS = [
  {
    question: "What is FlocknGo and how does it work?",
    answer:
      "FlocknGo is a community and event discovery platform in India. It connects people with local community flocks (interest-based clubs and social groups) and scheduled activities ranging from weekend treks and creative workshops to fitness runs and cultural gatherings.",
  },
  {
    question: "How do I discover communities and events near me?",
    answer:
      "You can explore activities and communities directly on FlocknGo by selecting your city or using location-based search (such as Pune or Mumbai). You can also filter by interests like Adventure, Fitness, Social, Tech, Wellness, and Culinary to find experiences that match your passions.",
  },
  {
    question: "Which cities in India are supported on FlocknGo?",
    answer:
      "FlocknGo features discoverable communities and activities across India, with active groups in major hubs including Pune, Mumbai, Bangalore, and Delhi NCR, as well as emerging outdoor and cultural destinations.",
  },
  {
    question: "How can I join a community or attend an activity?",
    answer:
      "Browse any public community or activity listing on FlocknGo to review schedules, venue locations, and member details. Click 'Join Activity' or 'Join Community' to participate and connect directly with organizers and members.",
  },
  {
    question: "Is FlocknGo free for visitors to discover events?",
    answer:
      "Yes, discovering local community flocks, browsing upcoming public activities, and exploring event schedules on FlocknGo is completely free.",
  },
];

const Home = () => {
  useSyncFilters();
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState(() => sessionStorage.getItem("home_activity_filter") || "");
  const [searchParams] = useSearchParams();

  const handleSetSelectedFilter = useCallback((value: React.SetStateAction<string>) => {
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
  }, [queryClient]);

  const flockQueryString = useMemo(() => {
    const params = new URLSearchParams();
    const loc = searchParams.get("location");
    const interest = selectedFilter || searchParams.get("interest");
    const date = searchParams.get("created_date");
    if (loc) params.set("location", loc);
    if (interest) params.set("interest", interest);
    if (date) params.set("created_date", date);
    return params.toString() ? `?${params.toString()}` : "";
  }, [searchParams, selectedFilter]);

  const activityQueryString = useMemo(() => {
    const params = new URLSearchParams();
    const loc = searchParams.get("location");
    const interest = selectedFilter || searchParams.get("interest");
    const date = searchParams.get("created_date");
    if (loc) params.set("location", loc);
    if (date) params.set("created_date", date);
    if (interest) params.set("interest", interest);
    return params.toString() ? `?${params.toString()}` : "";
  }, [searchParams, selectedFilter]);

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
      <SEOHead
        title="FlocknGo Events | Discover Events & Activities Near You"
        description="Discover upcoming events, local activities, workshops and community gatherings near you or across India. Explore event details and ticket options on FlocknGo."
        canonicalPath="/"
        domain="events"
        schemaType="WebSite"
        schemaData={{ faqs: HOME_FAQS }}
      />
      <h1 className="sr-only">FlocknGo Events</h1>
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
            No activities match your current search/location. Showing recommendations:
          </p>
        )}

        {nearbyActivityLoading ? (
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

        {flockLoading ? (
          <ResponsiveBentoFlockListSkeleton />
        ) : filteredCommunityFlocks.length === 0 ? (
          <EmptyState message="No flocks found" />
        ) : (
          <>
            {/* Mobile Carousel */}
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:hidden">
              {filteredCommunityFlocks.slice(0, 5).map((flock, index) => (
                <div key={flock.id} className="min-w-[45%] flex-shrink-0 snap-start sm:min-w-[65%]">
                  <CommunityFlocksCard card={flock} index={index} isUniform={filteredCommunityFlocks.length < 5} />
                </div>
              ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden auto-rows-auto grid-cols-1 gap-4 lg:grid lg:grid-cols-12">
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

      {/* Platform Overview & Frequently Asked Questions */}
      <section className="hidden mb-20 lg:mb-8 border-t border-slate-200/60 pt-10">
        <div className="mb-6">
          <h2 className="text-primary-dark text-xl sm:text-2xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-secondary/70 text-xs sm:text-sm mt-1">
            Everything you need to know about discovering communities and activities on FlocknGo.
          </p>
        </div>

        <div className="flex flex-col gap-3 max-w-4xl">
          {HOME_FAQS.map((faq, idx) => (
            <details
              key={idx}
              className="group border border-slate-200/80 rounded-2xl p-4 sm:p-5 bg-white shadow-xs open:bg-orange-50/20 transition-all"
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-primary-dark text-sm sm:text-base list-none">
                <span>{faq.question}</span>
                <span className="text-btn01 transition-transform duration-200 group-open:rotate-180 text-xs ml-3">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-secondary/80 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        {/* Popular Destination Links */}
        <div className="mt-8 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-secondary/70">
          <span className="font-semibold text-primary-dark">Popular City Hubs:</span>
          <Link
            to="/flocks/location/pune"
            className="text-btn01 hover:underline font-medium"
          >
            Communities in Pune
          </Link>
          <span>•</span>
          <Link
            to="/activities/location/mumbai"
            className="text-btn01 hover:underline font-medium"
          >
            Activities in Mumbai
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
