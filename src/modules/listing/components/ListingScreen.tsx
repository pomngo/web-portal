import { Outlet, useLocation } from "react-router-dom";
import TopNav from "./TopNav";
import Footer from "./Footer";
import LabelBottomNavigation from "./LabelBottomNavigation";

const ListingScreen = () => {
  const location = useLocation();
  const hideFooter =
    location.pathname.startsWith("/activities") ||
    location.pathname.startsWith("/flocks");

  return (
    <div className="min-h-screen relative flex flex-col justify-between">
      <TopNav />
      <main className={`flex-1 ${hideFooter ? "pb-24 sm:pb-8" : ""}`}>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      <div className="sm:hidden">
        <LabelBottomNavigation />
      </div>
    </div>
  );
};

export default ListingScreen;


