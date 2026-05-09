import { Route, Routes } from "react-router";
import Home from "../pages/home/Home";
import ListingScreen from "../components/ListingScreen";
import Flocks from "../pages/flocks/Flocks";
import Activities from "../pages/activities/Activities";

const ListingRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<ListingScreen />}>
        <Route index element={<Home />} />
        <Route path="flocks" element={<Flocks />} />
        <Route path="activities" element={<Activities />} />
      </Route>
    </Routes>
  );
};

export default ListingRoute;
