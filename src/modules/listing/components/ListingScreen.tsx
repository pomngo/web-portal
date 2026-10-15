import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import Footer from "./Footer";
import LabelBottomNavigation from "./LabelBottomNavigation";

const ListingScreen = () => {
  return (
    <div className="min-h-screen pb-24 sm:pb-0 relative flex flex-col justify-between">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <div className="sm:hidden">
        <LabelBottomNavigation />
      </div>
    </div>
  );
};

export default ListingScreen;


