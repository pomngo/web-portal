import React from "react";
import { Link, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import PageHeader from "../../../components/common/PageHeader";
import NearbyActivities from "../../../modules/listing/components/home/NearbyActivities";
import HomeLoader, { CardSkeleton } from "../../../components/common/HomeLoader";
import ErrorState from "../../../components/common/ErrorState";
import EmptyState from "../../../components/common/EmptyState";
import SEOHead from "../../../components/common/SEOHead";
import { useLocationActivities } from "../hooks/useLocationSearchQuery";
import { normalizeLocationSlug } from "../utils/locationNormalizer";
import { encodeId } from "../../../utils/idEncoder";

const ActivitiesLocationPage: React.FC = () => {
  const { location: rawLocation } = useParams<{ location: string }>();
  const norm = normalizeLocationSlug(rawLocation);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useLocationActivities(norm.query, 6);

  const activityList = data?.pages.flatMap((page) => page.items) || [];
  const isFallback = data?.pages.some((page) => page.isFallback) ?? false;

  const skeletonCount = isFetchingNextPage
    ? activityList.length % 2 !== 0 ? 3 : 2
    : hasNextPage && activityList.length % 2 !== 0 ? 1 : 0;

  // SEO metadata calculation
  const seoTitle = isFallback
    ? `Upcoming Activities & Local Events | FlocknGo`
    : `Upcoming Activities & Events in ${norm.displayName} | FlocknGo`;

  const seoDescription = isFallback
    ? `Explore popular activities, weekend events, and workshops across India on FlocknGo. Book tickets online.`
    : `Discover upcoming activities, weekend events, and workshops in ${norm.displayName}. Book event tickets online on FlocknGo.`;

  const canonicalPath = `/activities/location/${norm.canonicalSlug}`;
  const robotsSetting = isFallback ? "noindex, follow" : "index, follow, max-image-preview:large";

  // Invalid location format check
  if (!norm.isValid) {
    return (
      <main className="flex min-h-screen flex-col gap-10 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <PageHeader title="Discover Activities" />
        <div className="flex flex-col items-center justify-center py-16">
          <EmptyState message="Please specify a valid city or location name to view activities." />
          <Link
            to="/activities"
            className="from-btn02 to-btn01 mt-6 rounded-full bg-linear-to-tr px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Explore All Activities
          </Link>
        </div>
      </main>
    );
  }

  // Error state
  if (error && activityList.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 md:px-8">
        <ErrorState
          title="Unable to load Activities"
          message={error.message || "Failed to retrieve activities for this location."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col gap-10 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalPath={canonicalPath}
        domain="events"
        robots={robotsSetting}
        schemaType="ItemList"
        schemaData={{
          items: activityList.map((act) => ({
            name: act.name || act.title || "Activity",
            url: `https://events.flockngo.com/flocks/${encodeId(act.flock_id || act.id)}/activities/${encodeId(act.id)}/detail`,
          })),
        }}
      />

      <h1 className="sr-only">
        {isFallback ? `Upcoming Activities and Events` : `Upcoming Activities in ${norm.displayName}`}
      </h1>

      <section>
        <PageHeader
          title={isFallback ? "Recommended Activities" : `Activities in ${norm.displayName}`}
        />

        {/* Fallback Notice: Shown when backend returns fallback recommendations */}
        {isFallback && !isLoading && (
          <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50/80 p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col gap-1">
              <span className="text-xs sm:text-sm font-bold text-btn01">
                No matching activities found in &ldquo;{norm.displayName}&rdquo;
              </span>
              <p className="text-xs text-secondary/80 font-medium">
                We couldn&apos;t find activities matching &ldquo;{norm.displayName}&rdquo;. Here are general recommendations you might like:
              </p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && activityList.length === 0 ? (
          <HomeLoader type="all-activities" />
        ) : activityList.length === 0 ? (
          <div className="py-12">
            <EmptyState message={`No activities currently available for ${norm.displayName}.`} />
          </div>
        ) : (
          <InfiniteScroll
            dataLength={activityList.length}
            next={fetchNextPage}
            hasMore={Boolean(hasNextPage)}
            loader={null}
            endMessage={
              <p className="text-secondary/70 my-8 py-4 text-center text-xs sm:text-sm font-medium">
                {isFallback
                  ? "End of recommended activities."
                  : `You've viewed all activities in ${norm.displayName}.`}
              </p>
            }
          >
            <div className="grid grid-cols-2 gap-2.5 gap-y-8 sm:grid-cols-2 sm:gap-4 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-5">
              {activityList.map((activity) => (
                <Link
                  key={activity.id}
                  to={`/flocks/${encodeId(activity.flock_id || activity.id)}/activities/${encodeId(activity.id)}/detail`}
                >
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

export default ActivitiesLocationPage;
