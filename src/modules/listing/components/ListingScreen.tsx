import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import LabelBottomNavigation from "./LabelBottomNavigation";

const ListingScreen = () => {
  return (
    <div>
      <TopNav />
      <Outlet />
      <div className="sm:hidden">
        <LabelBottomNavigation />
      </div>
    </div>
  );
};

export default ListingScreen;
