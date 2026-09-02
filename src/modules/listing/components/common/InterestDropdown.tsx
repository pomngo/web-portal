import { useState } from "react";
import Popover from "@mui/material/Popover";
import { ChevronDown, X } from "lucide-react";
import { Icons } from "../../../../constants/icons";

// List of categories matching the keys in keywordMap
const CATEGORIES = [
  { value: "adventure", label: "Adventure", description: "Obstacles, treks, rides, camping", icon: Icons.users, color: "bg-orange-50 text-orange-600 border-orange-100" },
  { value: "social", label: "Social", description: "Meetups, parties, clubs, campfires", icon: Icons.watch, color: "bg-pink-50 text-pink-600 border-pink-100" },
  { value: "creative", label: "Creative", description: "Art, crafts, paint, design", icon: Icons.heart, color: "bg-purple-50 text-purple-600 border-purple-100" },
  { value: "tech", label: "Tech", description: "Hackathons, coding, web, apps", icon: Icons.mapPinned, color: "bg-blue-50 text-blue-600 border-blue-100" },
  { value: "wellness", label: "Wellness", description: "Yoga, meditation, health", icon: Icons.flag, color: "bg-green-50 text-green-600 border-green-100" },
  { value: "culinary", label: "Culinary", description: "Feasts, food, street food, dining", icon: Icons.utensils, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { value: "history", label: "History", description: "Forts, heritage, museums", icon: Icons.calendar, color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  { value: "music", label: "Music", description: "Concerts, acoustic jams, bands", icon: Icons.music, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { value: "photography", label: "Photography", description: "Photo walks, camera shoots", icon: Icons.camera, color: "bg-teal-50 text-teal-600 border-teal-100" },
  { value: "travel", label: "Travel", description: "Tours, beaches, road trips", icon: Icons.plane, color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  { value: "fitness", label: "Fitness", description: "Workouts, runs, cycling, sports", icon: Icons.dumbbell, color: "bg-red-50 text-red-600 border-red-100" },
  { value: "gaming", label: "Gaming", description: "Board games, video games, play", icon: Icons.gamepad, color: "bg-violet-50 text-violet-600 border-violet-100" },
  { value: "movies", label: "Movies", description: "Cinema, films, shows, theater", icon: Icons.film, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { value: "nature", label: "Nature", description: "Lakes, sunsets, parks, gardens", icon: Icons.trees, color: "bg-lime-50 text-lime-700 border-lime-100" },
];

interface InterestDropdownProps {
  selectedFilter: string;
  setSelectedFilter: (value: React.SetStateAction<string>) => void;
}

const InterestDropdown = ({ selectedFilter, setSelectedFilter }: InterestDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (label: string) => {
    setSelectedFilter(label);
    handleClose();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFilter("");
  };

  const isOpen = Boolean(anchorEl);
  const selectedCategory = CATEGORIES.find(
    (c) => c.label.toLowerCase() === selectedFilter.toLowerCase()
  );

  return (
    <div className="mt-8 flex w-full justify-start items-center px-1">
      {/* Dropdown Trigger Button */}
      <div className="relative">
        <button
          onClick={handleClick}
          className={`flex items-center gap-3.5 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 shadow-sm border outline-hidden cursor-pointer backdrop-blur-md hover:scale-[1.03] active:scale-[0.98] ${
            selectedFilter
              ? "bg-primary-dark text-white border-primary-dark/30 shadow-md"
              : "bg-white/80 text-secondary border-slate-200/60 hover:bg-slate-50/90"
          }`}
        >
          {selectedFilter ? (
            <>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs`}>
                {selectedCategory ? (
                  <selectedCategory.icon size={14} className="text-white" />
                ) : (
                  "✨"
                )}
              </span>
              <span className="tracking-wide">{selectedCategory ? selectedCategory.label : selectedFilter}</span>
              <span
                onClick={handleClear}
                className="ml-1 rounded-full p-0.5 hover:bg-white/20 transition-colors cursor-pointer"
                title="Clear filter"
              >
                <X size={14} />
              </span>
            </>
          ) : (
            <>
              <span className="text-secondary/50 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs">
                ✨
              </span>
              <span className="tracking-wide text-primary-dark">All Interests</span>
              <ChevronDown
                size={16}
                className={`text-secondary/60 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </>
          )}
        </button>

        {/* Dropdown Menu Popover */}
        <Popover
          open={isOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          slotProps={{
            paper: {
              className: "mt-2 p-3 overflow-y-auto scrollbar-hide border border-slate-100 bg-white/95 backdrop-blur-md shadow-2xl",
              style: {
                borderRadius: "24px",
                maxHeight: "420px",
                width: "480px",
                maxWidth: "calc(100vw - 32px)",
              },
            },
          }}
          disableAutoFocus={true}
          disableEnforceFocus={true}
        >
          <div>
            <div className="mb-2 flex items-center justify-between px-2.5 py-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Filter by Category
              </span>
              {selectedFilter && (
                <button
                  onClick={handleClear}
                  className="text-xs font-semibold text-[#EF7F23] hover:underline cursor-pointer transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIES.map((category) => {
                const CategoryIcon = category.icon;
                const isSelected = selectedFilter.toLowerCase() === category.label.toLowerCase();

                return (
                  <button
                    key={category.value}
                    onClick={() => handleSelect(category.label)}
                    className={`flex items-center gap-3.5 rounded-2xl p-2.5 text-left border transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-98 ${
                      isSelected
                        ? "bg-slate-50 border-slate-200/80 shadow-xs"
                        : "bg-transparent border-transparent hover:bg-slate-50/50 hover:border-slate-100"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-xs transition-transform duration-300 group-hover:scale-105 ${category.color} ${
                        isSelected ? "scale-105" : ""
                      }`}
                    >
                      <CategoryIcon size={18} />
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-xs font-bold transition-colors ${
                          isSelected ? "text-primary-dark" : "text-slate-700 group-hover:text-primary-dark"
                        }`}
                      >
                        {category.label}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 truncate mt-0.5">
                        {category.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default InterestDropdown;
