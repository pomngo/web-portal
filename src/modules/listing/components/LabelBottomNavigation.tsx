import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { navItems } from "../../../constants/data";
import { useNavigate } from "react-router";

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState("/");
  const navigate = useNavigate();

  const actionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const [sliderStyle, setSliderStyle] = React.useState({
    width: 0,
    left: 0,
  });

  React.useEffect(() => {
    const activeIndex = navItems.findIndex((item) => item.name === value);

    const activeItem = actionRefs.current[activeIndex];

    if (activeItem) {
      setSliderStyle({
        width: activeItem.offsetWidth,
        left: activeItem.offsetLeft,
      });
    }
  }, [value]);

  return (
    <div className="fixed bottom-5 right-0 left-0 bg-linear-to-b from-nav01 to-nav02 to-60% p-2 w-[80%] mx-auto rounded-full h-20 z-50">
      {/* Sliding Background */}
      <div
        className="absolute top-1 h-[56px] rounded-xl bg-orange-100 transition-all duration-300 ease-in-out"
        style={{
          width: sliderStyle.width,
          transform: `translateX(${sliderStyle.left}px)`,
        }}
      />

      <BottomNavigation
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
        sx={{
          width: "100%",
          backgroundColor: "transparent",
          position: "relative",
          zIndex: 10,
        }}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <BottomNavigationAction
              key={item.name}
              ref={(el) => {
                actionRefs.current[index] = el;
              }}
              label={item.name}
              value={item.path}
              onClick={() => navigate(item.path)}
              icon={
                <Icon
                  className={`h-5 w-5 transition-colors duration-300 stroke-2 ${
                    value === item.path ? "text-orange-500" : "text-gray-500"
                  }`}
                />
              }
              sx={{
                borderRadius: "12px",
                minWidth: "auto",

                transition: "all 0.3s ease",

                "&.Mui-selected": {
                  color: "#f97316",
                },
              }}
            />
          );
        })}
      </BottomNavigation>
    </div>
  );
}
