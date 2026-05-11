import { Route, Routes } from "react-router";
import ListingRoute from "../modules/listing/routes/ListingRoute";

const MainRouting = () => {
  return (
    <Routes>
      <Route path="/*" element={<ListingRoute />} />
    </Routes>
  );
};

export default MainRouting;
