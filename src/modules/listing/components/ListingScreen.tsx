import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import LabelBottomNavigation from "./LabelBottomNavigation";

const ListingScreen = () => {
  return (
    <div className="min-h-screen pb-28 sm:pb-0 relative">
      <TopNav />
      <main>
        <Outlet />
      </main>
      <div className="sm:hidden">
        <LabelBottomNavigation />
      </div>
    </div>
  );
};

export default ListingScreen;

