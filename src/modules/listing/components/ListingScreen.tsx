import { Outlet } from "react-router";
import TopNav from "./TopNav";

const ListingScreen = () => {
  return (
    <div>
      <TopNav />
      <Outlet />
    </div>
  );
};

export default ListingScreen;
