import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ListingScreen from "../components/ListingScreen";
import HomeLoader from "../../../components/common/HomeLoader";
import FlockDetailsLoader from "../../../components/common/FlockDetailsLoader";
import ActivityDetailsLoader from "../../../components/common/ActivityDetailsLoader";

const Home = lazy(() => import("../pages/home/Home"));
const Flocks = lazy(() => import("../pages/flocks/Flocks"));
const Activities = lazy(() => import("../pages/activities/Activities"));
const AllFlocks = lazy(() => import("../pages/flocks/AllFlocks"));
const AllActivities = lazy(() => import("../pages/activities/AllActivities"));
const FlocksDetails = lazy(() => import("../pages/flocks/FlocksDetails"));
const ActivitiesDetails = lazy(() => import("../pages/activities/ActivitiesDetails"));

const ListingRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<ListingScreen />}>
        <Route
          index
          element={
            <Suspense fallback={<HomeLoader type="home" />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="flocks"
          element={
            <Suspense fallback={<HomeLoader type="flocks" />}>
              <Flocks />
            </Suspense>
          }
        />
        <Route
          path="activities"
          element={
            <Suspense fallback={<HomeLoader type="activities" />}>
              <Activities />
            </Suspense>
          }
        />
        <Route
          path="flocks/:search_by"
          element={
            <Suspense fallback={<HomeLoader type="all-flocks" />}>
              <AllFlocks />
            </Suspense>
          }
        />
        <Route
          path="activities/:search_by"
          element={
            <Suspense fallback={<HomeLoader type="all-activities" />}>
              <AllActivities />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/flocks/:id/detail"
        element={
          <Suspense fallback={<FlockDetailsLoader />}>
            <FlocksDetails />
          </Suspense>
        }
      />
      <Route
        path="/flocks/:id/activities/:id/detail"
        element={
          <Suspense fallback={<ActivityDetailsLoader />}>
            <ActivitiesDetails />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default ListingRoute;
