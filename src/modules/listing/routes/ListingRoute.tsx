import { Route, Routes } from "react-router";
import Home from "../pages/home/Home";
import ListingScreen from "../components/ListingScreen";
import Flocks from "../pages/flocks/Flocks";
import Activities from "../pages/activities/Activities";
import AllFlocks from "../pages/flocks/AllFlocks";
import AllActivities from "../pages/activities/AllActivities";
import FlocksDetails from "../pages/flocks/FlocksDetails";
import ActivitiesDetails from "../pages/activities/ActivitiesDetails";

const ListingRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<ListingScreen />}>
        <Route index element={<Home />} />
        <Route path="flocks" element={<Flocks />} />
        <Route path="activities" element={<Activities />} />
        <Route path="flocks/:search_by" element={<AllFlocks />} />
        <Route path="activities/:search_by" element={<AllActivities />} />
      </Route>
      <Route path="/flocks/:id/detail" element={<FlocksDetails />} />
      <Route
        path="/flocks/:id/activities/:id/detail"
        element={<ActivitiesDetails />}
      />
    </Routes>
  );
};

export default ListingRoute;
