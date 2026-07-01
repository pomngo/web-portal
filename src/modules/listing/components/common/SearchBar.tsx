import { useState, lazy, Suspense, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Popover from "@mui/material/Popover";

import { locationService } from "../../../../services/location.service";
import LocationPermissionPopup from "./LocationPermissionPopup";
import SearchIcon from "../../../../components/icons/SearchIcon";
import CalendarIcon from "../../../../components/icons/CalendarIcon";
import LocationIcon from "../../../../components/icons/LocationIcon";
import HeartIcon from "../../../../components/icons/HeartIcon";
import { Icons } from "../../../../constants/icons";
import { keywordMap } from "../../../../utils/filter";

const DateCalendarValue = lazy(() => import("../../../../components/ui/DateCalendarValue"));

const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [locInput, setLocInput] = useState(searchParams.get("location") || "");
  const [interestInput, setInterestInput] = useState(searchParams.get("interest") || "");

  // Set date from URL if present
  const urlDate = searchParams.get("created_date");
  const [value, setValue] = useState<Dayjs | null>(urlDate ? dayjs(urlDate) : null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [interestAnchorEl, setInterestAnchorEl] = useState<null | HTMLElement>(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState<null | HTMLElement>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [isPermissionPopupOpen, setIsPermissionPopupOpen] = useState(false);

  // Sync inputs with URL search parameters
  useEffect(() => {
    setLocInput(searchParams.get("location") || "");
    setInterestInput(searchParams.get("interest") || "");
    const dateParam = searchParams.get("created_date");
    setValue(dateParam ? dayjs(dateParam) : null);
  }, [searchParams]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    if (locInput) {
      newParams.set("location", locInput);
    } else {
      newParams.delete("location");
      localStorage.removeItem("user_location");
    }

    if (interestInput) newParams.set("interest", interestInput);
    else newParams.delete("interest");

    if (value) newParams.set("created_date", value.format("YYYY-MM-DD"));
    else newParams.delete("created_date");

    setSearchParams(newParams);

    const path = window.location.pathname;
    const isListingPage = path === "/" || path === "/flocks" || path === "/activities" || path.includes("/flocks/") || path.includes("/activities/");
    if (!isListingPage || path.includes("/detail")) {
      navigate(`/?${newParams.toString()}`);
    }
  };

  const handleLocationClick = (e: React.MouseEvent<HTMLElement>) => {
    setLocationAnchorEl(e.currentTarget);
  };

  const handleGetCurrentLocation = async () => {
    setLocLoading(true);
    try {
      const currentLoc = await locationService.getCurrentLocation();
      if (currentLoc.city) {
        setLocInput(currentLoc.city);
      } else if (currentLoc.lat && currentLoc.lng) {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${currentLoc.lat}&longitude=${currentLoc.lng}&localityLanguage=en`
        );
        if (res.ok) {
          const data = await res.json();
          const resolvedCity = data.city || data.locality || data.principalSubdivision;
          if (resolvedCity) {
            setLocInput(resolvedCity);
          } else {
            setLocInput(`${currentLoc.lat.toFixed(2)}, ${currentLoc.lng.toFixed(2)}`);
          }
        } else {
          setLocInput(`${currentLoc.lat.toFixed(2)}, ${currentLoc.lng.toFixed(2)}`);
        }
      }
    } catch (err) {
      console.error("Failed to detect location:", err);
    } finally {
      setLocLoading(false);
      setLocationAnchorEl(null);
    }
  };

  const searchBarContent = (
    <div className="bg-primary flex w-full flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6 rounded-3xl sm:rounded-full p-4 sm:p-3 sm:min-w-xl lg:min-w-4xl">
      {/* Location */}
      <div
        onClick={handleLocationClick}
        className="flex cursor-pointer gap-2 px-5 py-2 transition-all duration-300 hover:scale-105 items-center flex-1"
      >
        <LocationIcon />
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-primary-dark text-sm font-medium">Location</p>
          <div className="text-secondary/40 text-xs font-medium flex items-center gap-1.5">
            <input
              type="text"
              value={locInput}
              onChange={(e) => {
                const val = e.target.value;
                setLocInput(val);
                if (!val) {
                  localStorage.removeItem("user_location");
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete("location");
                  setSearchParams(newParams);
                } else if (!locationAnchorEl) {
                  setLocationAnchorEl(e.currentTarget.parentElement?.parentElement?.parentElement || e.currentTarget);
                }
              }}
              onFocus={(e) => {
                setLocationAnchorEl(e.currentTarget.parentElement?.parentElement?.parentElement || e.currentTarget);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                  setLocationAnchorEl(null);
                }
              }}
              className="text-secondary w-full bg-transparent text-xs font-medium outline-none truncate flex-1"
              placeholder="Search Location"
            />
            {locInput && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLocInput("");
                  localStorage.removeItem("user_location");
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete("location");
                  setSearchParams(newParams);
                }}
                className="text-secondary/60 hover:text-secondary cursor-pointer rounded-full p-0.5 transition-colors hover:bg-slate-100 flex-shrink-0"
                title="Clear Location"
              >
                <Icons.close size={14} className="text-btn01 h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interest */}
      <div
        onClick={(e) => {
          setInterestAnchorEl(e.currentTarget);
        }}
        className="flex cursor-pointer gap-2 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-5 px-5 py-2 transition-all duration-300 hover:scale-105 items-center flex-1"
      >
        <HeartIcon />
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-primary-dark text-sm font-medium">Interest</p>
          <div className="text-secondary/40 text-xs font-medium">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => {
                setInterestInput(e.target.value);
                if (!interestAnchorEl) {
                  setInterestAnchorEl(e.currentTarget.parentElement?.parentElement?.parentElement || e.currentTarget);
                }
              }}
              onFocus={(e) => {
                setInterestAnchorEl(e.currentTarget.parentElement?.parentElement?.parentElement || e.currentTarget);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                  setInterestAnchorEl(null);
                }
              }}
              className="text-secondary/70 bg-transparent w-full text-xs font-medium outline-none truncate"
              placeholder="Search Interest"
            />
          </div>
        </div>
      </div>

      {/* Date */}
      <div
        onClick={handleOpen}
        className="flex cursor-pointer gap-2 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-5 px-5 py-2 transition-all duration-300 hover:scale-105 items-center"
      >
        <CalendarIcon />
        <div className="flex flex-col">
          <p className="text-primary-dark text-sm font-medium">Date</p>
          <div className="flex items-center gap-1.5">
            <span className="text-secondary/40 text-xs font-medium text-nowrap">
              {!value ? "Select Date" : value.format("DD MMM YYYY")}
            </span>
            {value && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setValue(null);
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete("created_date");
                  setSearchParams(newParams);
                }}
                className="text-secondary/60 hover:text-secondary cursor-pointer rounded-full p-0.5 transition-colors hover:bg-slate-100"
                title="Clear Date"
              >
                <Icons.close size={14} className="text-btn01 h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="from-btn02 to-btn01 text-white flex h-12 items-center justify-center gap-2 rounded-2xl bg-linear-to-tr to-75% p-3.5 shadow-md transition-all duration-200 active:scale-95 sm:h-12 sm:w-12 sm:rounded-full cursor-pointer hover:scale-105 flex-shrink-0"
      >
        <SearchIcon className="text-white h-5 w-5 flex-shrink-0" />
        <span className="sm:hidden text-sm font-semibold">Search Now</span>
      </button>
    </div>
  );

  return (
    <div className="items-center mt-6 flex w-full flex-col sm:flex-row justify-center gap-4 px-2">
      {/* Search Inputs */}
      <div className="from-btn01/10 to-btn02/10 flex w-full items-center justify-center rounded-3xl sm:rounded-full bg-linear-to-r p-0.5 shadow-md md:w-fit flex-1 max-w-4xl">
        {searchBarContent}
      </div>

      {/* Location Popover */}
      <Popover
        open={Boolean(locationAnchorEl)}
        anchorEl={locationAnchorEl}
        onClose={() => setLocationAnchorEl(null)}
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
            sx: {
              borderRadius: "20px",
              marginTop: "8px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              maxHeight: "360px",
              width: "320px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
            },
          },
        }}
        disableAutoFocus={true}
        disableEnforceFocus={true}
      >
        <div className="scrollbar-hide overflow-y-auto p-2">
          <button
            onClick={() => {
              setLocationAnchorEl(null);
              setIsPermissionPopupOpen(true);
            }}
            disabled={locLoading}
            className="hover:bg-slate-50 flex w-full cursor-pointer items-center gap-3.5 rounded-xl px-3.5 py-3 text-left transition-all duration-200 hover:scale-[1.01] active:scale-98 border-b border-slate-100"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-xl shadow-xs">
              {locLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#EF7F23] border-t-transparent"></div>
              ) : (
                <LocationIcon className="text-btn01 h-5 w-5" />
              )}
            </span>
            <div className="flex flex-col">
              <span className="text-primary-dark text-xs font-semibold">
                {locLoading ? "Locating..." : "Use Current Location"}
              </span>
              <span className="text-secondary/60 text-[10px] font-medium">
                Using GPS or IP Address
              </span>
            </div>
          </button>

          <p className="text-secondary/60 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider">
            Popular Locations
          </p>

          {(() => {
            const POPULAR_CITIES = [
              "Mumbai",
              "Pune",
              "Delhi",
              "Bangalore",
              "Hyderabad",
              "Chennai",
              "Kolkata",
              "Ahmedabad",
              "Jaipur",
              "Surat",
              "Lucknow",
            ];
            const query = locInput.toLowerCase().trim();
            const filtered = POPULAR_CITIES.filter((city) =>
              city.toLowerCase().includes(query)
            );

            if (filtered.length === 0) {
              return (
                <div className="text-secondary/60 px-3 py-4 text-center text-xs">
                  No matching locations found
                </div>
              );
            }

            return filtered.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setLocInput(city);
                  setLocationAnchorEl(null);
                }}
                className="hover:bg-slate-50 flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2 text-left text-xs font-semibold text-primary-dark transition-all duration-200 active:scale-98"
              >
                📍 {city}
              </button>
            ));
          })()}
        </div>
      </Popover>

      {/* Interest Popover */}
      <Popover
        open={Boolean(interestAnchorEl)}
        anchorEl={interestAnchorEl}
        onClose={() => setInterestAnchorEl(null)}
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
            sx: {
              borderRadius: "20px",
              marginTop: "8px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              maxHeight: "360px",
              width: "320px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
            },
          },
        }}
        disableAutoFocus={true}
        disableEnforceFocus={true}
      >
        <div className="scrollbar-hide overflow-y-auto p-2">
          <p className="text-secondary/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider">
            Select or Search Interest
          </p>
          {(() => {
            const INTEREST_CATEGORIES = [
              { value: "adventure", label: "Adventure", description: "Trekking, camping, hiking, rides", icon: "🚵" },
              { value: "social", label: "Social", description: "Meetups, parties, clubs, campfires", icon: "🎉" },
              { value: "creative", label: "Creative", description: "Art, crafts, paint, design", icon: "🎨" },
              { value: "tech", label: "Technology", description: "Hackathons, coding, web, apps", icon: "💻" },
              { value: "wellness", label: "Wellness", description: "Yoga, meditation, healthy lifestyles", icon: "🧘" },
              { value: "culinary", label: "Culinary", description: "Food trips, street food, cooking", icon: "🍽️" },
              { value: "history", label: "History", description: "Forts, heritage, museums", icon: "🏛️" },
              { value: "music", label: "Music", description: "Concerts, acoustic jams, bands", icon: "🎵" },
              { value: "photography", label: "Photography", description: "Photo walks, camera shoots", icon: "📷" },
              { value: "travel", label: "Travel", description: "Tours, beaches, road trips", icon: "✈️" },
              { value: "fitness", label: "Fitness", description: "Workouts, runs, cycling, sports", icon: "💪" },
              { value: "gaming", label: "Gaming", description: "Board games, video games, play", icon: "🎮" },
              { value: "movies", label: "Movies & Shows", description: "Cinema, films, theaters", icon: "🎬" },
              { value: "nature", label: "Nature", description: "Lake visits, sunsets, parks, gardens", icon: "🌳" }
            ];
            const query = interestInput.toLowerCase().trim();
            const filtered = INTEREST_CATEGORIES.filter((category) => {
              if (!query) return true;
              if (category.label.toLowerCase().includes(query)) return true;
              if (category.description.toLowerCase().includes(query)) return true;
              const keywords = keywordMap[category.value] || [];
              return keywords.some((kw: string) => kw.includes(query));
            });

            if (filtered.length === 0) {
              return (
                <div className="text-secondary/60 px-3 py-4 text-center text-xs">
                  No matching interests found
                </div>
              );
            }

            return filtered.map((category) => (
              <button
                key={category.value}
                onClick={() => {
                  setInterestInput(category.label);
                  setInterestAnchorEl(null);
                }}
                className="hover:bg-slate-50 flex w-full cursor-pointer items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-98"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-xl shadow-xs">
                  {category.icon}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-primary-dark text-xs font-semibold">{category.label}</span>
                  <span className="text-secondary/60 truncate text-[10px] font-medium">
                    {category.description}
                  </span>
                </div>
              </button>
            ));
          })()}
        </div>
      </Popover>

      {/* Date Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
            },
          },
        }}
      >
        {open && (
          <Suspense
            fallback={
              <div className="flex h-[340px] w-[320px] items-center justify-center p-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#EF7F23] border-t-transparent"></div>
              </div>
            }
          >
            <DateCalendarValue value={value} setValue={setValue} onClose={handleClose} />
          </Suspense>
        )}
      </Popover>
      {/* Location Permission Modal */}
      <LocationPermissionPopup
        isOpen={isPermissionPopupOpen}
        onClose={() => setIsPermissionPopupOpen(false)}
        onAllow={handleGetCurrentLocation}
      />
    </div>
  );
};

export default SearchBar;
