import { Link, useParams, useSearchParams } from "react-router-dom";
import NearbyActivities from "../../components/home/NearbyActivities";
import HomeLoader, { CardSkeleton } from "../../../../components/common/HomeLoader";
import PageHeader from "../../../../components/common/PageHeader";
import InfiniteScroll from "react-infinite-scroll-component";
import ErrorState from "../../../../components/common/ErrorState";
import SEOHead from "../../../../components/common/SEOHead";
import { useInfiniteActivities } from "../../../../hooks/useActivitiesQuery";
import { useSyncFilters } from "../../../../utils/filter";
import { encodeId } from "../../../../utils/idEncoder";

const getSlugMeta = (slug?: string) => {
  const s = (slug || "").toLowerCase();
  if (s === "weekend-activities" || s === "this-weekend" || s === "things-to-do-this-weekend") {
    return {
      title: "Things to Do This Weekend | Weekend Activities Near Me | FlocknGo",
      description: "Looking for things to do this weekend? Discover top weekend activities near me, fun local events, and book event tickets online with FlocknGo.",
      h1: "Things to Do This Weekend & Weekend Activities Near Me",
    };
  }
  if (s === "workshops" || s === "workshops-near-me" || s === "hobby-classes") {
    return {
      title: "Workshops Near Me | Creative & Hobby Classes | FlocknGo Events",
      description: "Find exciting workshops near me, hobby classes, and creative skill sessions. Book workshop and event tickets online on FlocknGo.",
      h1: "Workshops & Learning Activities Near Me",
    };
  }
  if (s === "community-events" || s === "community-activities" || s === "group-activities") {
    return {
      title: "Community Events Near Me | Local Community Activities | FlocknGo",
      description: "Join vibrant community events near me, group activities, and local social gatherings. Connect with people in your city on FlocknGo.",
      h1: "Community Events & Local Group Activities Near Me",
    };
  }
  if (s === "upcoming-events-india" || s === "events-in-india" || s === "cultural-events") {
    return {
      title: "Upcoming Events in India | Cultural, Live & Networking Events | FlocknGo",
      description: "Browse top upcoming events in India, cultural events, live entertainment, and networking meetups. Book event tickets online.",
      h1: "Upcoming Events in India",
    };
  }
  if (s === "explore-activities" || s === "explore") {
    return {
      title: "Upcoming Events Near Me | Events This Weekend & City Activities | FlocknGo",
      description: "Explore upcoming events near me and activities in your city. Find things to do this weekend, workshops, and book event tickets online.",
      h1: "Explore Upcoming Events & Activities Near Me",
    };
  }
  if (s === "nearby-activities" || s === "nearby" || s === "events-near-me") {
    return {
      title: "Activities Near Me | Events Happening Today & Fun Things to Do | FlocknGo",
      description: "Discover fun activities near me and events happening today. Browse local events near you and book event tickets online with FlocknGo.",
      h1: "Activities Near Me & Local Events",
    };
  }
  const formatted = slug
    ? slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
    : "Activities";
  return {
    title: `${formatted} - Upcoming Events & Activities Near Me | FlocknGo`,
    description: `Discover ${formatted} and upcoming events in India. Find activities near me, workshops, and book event tickets online on FlocknGo.`,
    h1: `${formatted} - Upcoming Events & Activities`,
  };
};

const AllActivities = () => {
  useSyncFilters();
  const { search_by } = useParams();
  const slugMeta = getSlugMeta(search_by);
  const [searchParams] = useSearchParams();
  const activityQueryString = (() => {
    const params = new URLSearchParams();
    const loc = searchParams.get("location");
    const interest = searchParams.get("interest");
    const date = searchParams.get("created_date");
    if (loc) params.set("location", loc);
    if (interest) params.set("interest", interest);
    if (date) params.set("created_date", date);
    return params.toString() ? `?${params.toString()}` : "";
  })();

  const {
    data,
    isLoading: loading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteActivities(activityQueryString, 5);

  const activityList = data?.pages.flatMap((page) => page.items) || [];

  const filteredActivityList = activityList;

  const skeletonCount = isFetchingNextPage
    ? (filteredActivityList.length % 2 !== 0 ? 3 : 2)
    : (hasNextPage && filteredActivityList.length % 2 !== 0 ? 1 : 0);

  const handleRetry = () => {
    refetch();
  };



  if (error && activityList.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-16 py-10">
        <ErrorState title="Unable to load Activities" message={error.message} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col gap-16 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <SEOHead
        title={slugMeta.title}
        description={slugMeta.description}
        canonicalPath={`/activities/${search_by || "nearby-activities"}`}
        domain="events"
      />
      <h1 className="sr-only">{slugMeta.h1}</h1>
      {/* Nearby Flocks */}
      <section className="">
        <PageHeader slug={search_by} />

        {loading && activityList.length === 0 ? (
          <HomeLoader type="all-activities" />
         ) : (
          <InfiniteScroll
            dataLength={filteredActivityList.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={null}
            endMessage={
              <p className="text-secondary my-6 py-4 text-center text-sm font-medium">No more activities to load.</p>
            }
          >
            <div className="grid grid-cols-2 gap-2.5 gap-y-8 sm:gap-4 sm:gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {filteredActivityList.map((activity) => (
                <Link key={activity.id} to={`/flocks/${encodeId(activity.flock_id || activity.id)}/activities/${encodeId(activity.id)}/detail`}>
                  <NearbyActivities activity={activity} />
                </Link>
              ))}
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <CardSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </section>
    </main>
  );
};

export default AllActivities;
