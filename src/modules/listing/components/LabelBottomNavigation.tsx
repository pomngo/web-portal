import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import { navItems } from "../../../constants/data";

export default function LabelBottomNavigation() {
  const location = useLocation();
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [sliderStyle, setSliderStyle] = useState({
    width: 0,
    left: 0,
  });

  useEffect(() => {
    const updateSlider = () => {
      const activeIndex = navItems.findIndex((item) => {
        if (item.path === "/") {
          return location.pathname === "/";
        }
        return location.pathname.startsWith(item.path);
      });

      const activeItem = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;

      if (activeItem) {
        setSliderStyle({
          width: activeItem.offsetWidth,
          left: activeItem.offsetLeft,
        });
      }
    };

    // Small delay to ensure DOM dimensions are ready on initial load
    const timer = setTimeout(updateSlider, 50);
    window.addEventListener("resize", updateSlider);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateSlider);
    };
  }, [location.pathname]);

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex h-16 w-[92%] max-w-sm items-center justify-around rounded-full bg-white/95 p-1.5 shadow-xl shadow-black/10 backdrop-blur-md border border-slate-200/80 transition-all duration-300">
        {/* Sliding Active Pill Background */}
        <div
          className="absolute top-1.5 left-0 h-[52px] rounded-full bg-orange-50/90 border border-orange-200/60 transition-all duration-300 ease-out pointer-events-none"
          style={{
            width: sliderStyle.width,
            transform: `translateX(${sliderStyle.left}px)`,
          }}
        />

        {/* Nav Items */}
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <Tooltip.Root key={item.path}>
              <Tooltip.Trigger asChild>
                <NavLink
                  to={item.path}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="relative z-10 flex flex-1 flex-col items-center justify-center py-1 text-center transition-all duration-300 active:scale-95 cursor-pointer rounded-full"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    {Icon && (
                      <Icon
                        className={`h-5 w-5 transition-all duration-300 ${
                          isActive
                            ? "text-btn01 scale-110"
                            : "text-secondary/60 hover:text-primary-dark"
                        }`}
                      />
                    )}
                    <span
                      className={`text-[11px] font-semibold transition-all duration-300 ${
                        isActive
                          ? "from-btn01 to-btn02 bg-linear-to-tr bg-clip-text text-transparent font-bold"
                          : "text-secondary/70 font-medium"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </NavLink>
              </Tooltip.Trigger>

              <Tooltip.Portal>
                <Tooltip.Content
                  className="z-50 rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-white shadow-md animate-in fade-in-0 zoom-in-95"
                  sideOffset={6}
                  side="top"
                >
                  {item.name}
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}
      </div>
    </Tooltip.Provider>
  );
}


