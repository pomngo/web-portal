import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

import { images } from "../../../constants/images";
import { navItems } from "../../../constants/data";
import SearchBar from "./common/SearchBar";
import LoginPopup from "./common/LoginPopup";

const TopNav = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [sliderStyle, setSliderStyle] = useState({
    width: 0,
    left: 0,
  });

  useEffect(() => {
    const activeIndex = navItems.findIndex((item) => {
      if (item.path === "/") {
        return location.pathname === "/";
      }

      return location.pathname.startsWith(item.path);
    });

    const activeItem = activeIndex >= 0 ? navRefs.current[activeIndex] : null;

    if (activeItem) {
      setSliderStyle({
        width: activeItem.offsetWidth,
        left: activeItem.offsetLeft,
      });
    }
  }, [location.pathname]);

  return (
    <div className="bg-linear-to-b from-nav01 via-nav02 to-[10%_15%] px-4  sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4">
      {/* top */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to={"/"}>
          <img src={images.logo} alt="Logo" className="h-16" />
        </Link>

        {/* Navigation */}
        <div className="relative">
          {/* Dynamic Sliding Background */}
          <div
            className="absolute top-2 h-10 rounded-full bg-btn-light/20 transition-all duration-300 ease-in-out"
            style={{
              width: sliderStyle.width,
              transform: `translateX(${sliderStyle.left}px)`,
            }}
          />

          {/* Nav Items */}
          <div className="hidden relative sm:flex items-center gap-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  ref={(el) => {
                    navRefs.current[index] = el as HTMLAnchorElement | null;
                  }}
                  className={({ isActive }) =>
                    `group relative z-10 flex h-14 items-center justify-center rounded-full px-6 text-sm font-medium transition-all duration-300 ${
                      isActive ? "" : "text-secondary/70 hover:text-black"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {Icon && (
                        <Icon
                          className={`mr-2 h-5 w-5 transition-all duration-300 ${
                            isActive
                              ? "text-btn01"
                              : "text-secondary/70 group-hover:text-black"
                          }`}
                        />
                      )}

                      <span
                        className={`transition-all text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] duration-300 ${
                          isActive
                            ? "bg-linear-to-tr from-btn01 to-btn02 bg-clip-text text-transparent font-semibold"
                            : "text-secondary/70 group-hover:text-black text-[15px] font-medium"
                        }`}
                      >
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Button */}
        <div className="relative">
          <button
            onClick={() => setOpen(true)}
            className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[17px] text-nowrap  rounded-full bg-linear-to-tr from-btn02 to-btn01 to-75% px-5 py-2 text-primary transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Become Organizer
          </button>
          <LoginPopup isOpen={open} onClose={() => setOpen(false)} />
        </div>
      </div>

      {/* bottom */}
      <SearchBar />
    </div>
  );
};

export default TopNav;
