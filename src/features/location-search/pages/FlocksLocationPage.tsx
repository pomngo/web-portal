import React from "react";
import { Link, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import PageHeader from "../../../components/common/PageHeader";
import NearbyFlock from "../../../modules/listing/components/home/NearbyFlock";
import HomeLoader, { CardSkeleton } from "../../../components/common/HomeLoader";
import ErrorState from "../../../components/common/ErrorState";
import EmptyState from "../../../components/common/EmptyState";
import SEOHead from "../../../components/common/SEOHead";
import { useLocationFlocks } from "../hooks/useLocationSearchQuery";
import { normalizeLocationSlug } from "../utils/locationNormalizer";
import { encodeId } from "../../../utils/idEncoder";

const FlocksLocationPage: React.FC = () => {
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
  } = useLocationFlocks(norm.query, 10);

  const flockList = data?.pages.flatMap((page) => page.items) || [];
  const isFallback = data?.pages.some((page) => page.isFallback) ?? false;

  // SEO metadata calculation
  const seoTitle = isFallback
    ? `Community Flocks & Groups | FlocknGo`
    : `Community Flocks & Groups in ${norm.displayName} | FlocknGo`;

  const seoDescription = isFallback
    ? `Discover popular community flocks and social groups on FlocknGo. Connect with like-minded people across India.`
    : `Join local community flocks, social groups, and meetup clubs in ${norm.displayName}. Connect with like-minded people on FlocknGo.`;

  const canonicalPath = `/flocks/location/${norm.canonicalSlug}`;
  const robotsSetting = isFallback ? "noindex, follow" : "index, follow, max-image-preview:large";

  // Invalid location format check
  if (!norm.isValid) {
    return (
      <main className="flex min-h-screen flex-col gap-10 px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <PageHeader title="Discover Communities" />
        <div className="flex flex-col items-center justify-center py-16">
          <EmptyState message="Please specify a valid city or location name to view community flocks." />
          <Link
            to="/flocks"
            className="from-btn02 to-btn01 mt-6 rounded-full bg-linear-to-tr px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Explore All Communities
          </Link>
        </div>
      </main>
    );
  }

  // Error state
  if (error && flockList.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 md:px-8">
        <ErrorState
          title="Unable to load Communities"
          message={error.message || "Failed to retrieve flocks for this location."}
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
          items: flockList.map((f) => ({
            name: f.name || f.flock_name || "Community Flock",
            url: `https://events.flockngo.com/flocks/${encodeId(f.id)}/detail`,
          })),
        }}
      />

      <h1 className="sr-only">
        {isFallback ? `Community Flocks and Groups` : `Community Flocks in ${norm.displayName}`}
      </h1>

      <section className="space-y-6">
        <PageHeader
          title={isFallback ? "Recommended Communities" : `Communities in ${norm.displayName}`}
        />

        {/* City Location Hero Showcase */}
        {!isFallback && (
          <div className="rounded-3xl bg-gradient-to-r from-orange-50 via-white to-amber-50/50 p-6 sm:p-8 border border-orange-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-btn01 uppercase tracking-wider bg-orange-100/70 px-2.5 py-0.5 rounded-full">
                  City Hub
                </span>
                <span className="text-xs font-semibold text-slate-500">📍 {norm.displayName}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Community Flocks in {norm.displayName}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl">
                Join active passion circles, hobby groups, and sports clubs meeting regularly across {norm.displayName}.
              </p>
            </div>

            {/* Dual Mode Switcher Pill */}
            <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl w-fit shrink-0">
              <Link
                to={`/activities/location/${norm.canonicalSlug}`}
                className="text-slate-500 hover:text-slate-800 font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl transition"
              >
                ⚡ Activities
              </Link>
              <span className="bg-white text-slate-800 shadow-xs font-bold text-xs sm:text-sm px-4 py-2 rounded-xl">
                👥 Flocks ({flockList.length})
              </span>
            </div>
          </div>
        )}

        {/* Fallback Notice: Shown when backend returns fallback recommendations */}
        {isFallback && !isLoading && (
          <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50/80 p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col gap-1">
              <span className="text-xs sm:text-sm font-bold text-btn01">
                No matching communities found in &ldquo;{norm.displayName}&rdquo;
              </span>
              <p className="text-xs text-secondary/80 font-medium">
                We couldn&apos;t find communities matching &ldquo;{norm.displayName}&rdquo;. Here are general recommendations you might like:
              </p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && flockList.length === 0 ? (
          <HomeLoader type="all-flocks" />
        ) : flockList.length === 0 ? (
          <div className="py-12">
            <EmptyState message={`No communities currently available for ${norm.displayName}.`} />
          </div>
        ) : (
          <InfiniteScroll
            dataLength={flockList.length}
            next={fetchNextPage}
            hasMore={Boolean(hasNextPage)}
            scrollThreshold={0.8}
            loader={
              <div className="my-8 flex justify-center items-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-[#E75B28]" />
              </div>
            }
            endMessage={
              <p className="text-secondary/70 my-8 py-4 text-center text-xs sm:text-sm font-medium">
                {isFallback
                  ? "End of recommended communities."
                  : `You've viewed all communities in ${norm.displayName}.`}
              </p>
            }
          >
            <div className="grid grid-cols-2 gap-2.5 gap-y-8 sm:grid-cols-2 sm:gap-4 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {flockList.map((flock) => (
                <Link key={flock.id} to={`/flocks/${encodeId(flock.id)}/detail`}>
                  <NearbyFlock flock={flock} />
                </Link>
              ))}
              {isFetchingNextPage &&
                Array.from({ length: 5 }).map((_, i) => (
                  <CardSkeleton key={`skeleton-loading-${i}`} />
                ))}
            </div>
          </InfiniteScroll>
        )}
      </section>
    </main>
  );
};

export default FlocksLocationPage;
