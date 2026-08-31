import { useState, lazy, Suspense, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Popover from "@mui/material/Popover";
import * as Dialog from "@radix-ui/react-dialog";

import { locationService } from "../../../../services/location.service";
import LocationPermissionPopup from "./LocationPermissionPopup";
import SearchIcon from "../../../../components/icons/SearchIcon";
import LocationIcon from "../../../../components/icons/LocationIcon";
import HeartIcon from "../../../../components/icons/HeartIcon";
import { Icons } from "../../../../constants/icons";
import { keywordMap } from "../../../../utils/filter";

const DateCalendarValue = lazy(() => import("../../../../components/ui/DateCalendarValue"));

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

const INTEREST_CATEGORIES = [
  { value: "adventure", label: "Adventure", description: "Trekking, camping, hiking, rides" },
  { value: "social", label: "Social", description: "Meetups, parties, clubs, campfires" },
  { value: "creative", label: "Creative", description: "Art, crafts, paint, design" },
  { value: "tech", label: "Technology", description: "Hackathons, coding, web, apps" },
  { value: "wellness", label: "Wellness", description: "Yoga, meditation, healthy lifestyles" },
  { value: "culinary", label: "Culinary", description: "Food trips, street food, cooking" },
  { value: "history", label: "History", description: "Forts, heritage, museums" },
  { value: "music", label: "Music", description: "Concerts, acoustic jams, bands" },
  { value: "photography", label: "Photography", description: "Photo walks, camera shoots" },
  { value: "travel", label: "Travel", description: "Tours, beaches, road trips" },
  { value: "fitness", label: "Fitness", description: "Workouts, runs, cycling, sports" },
  { value: "gaming", label: "Gaming", description: "Board games, video games, play" },
  { value: "movies", label: "Movies & Shows", description: "Cinema, films, theaters" },
  { value: "nature", label: "Nature", description: "Lake visits, sunsets, parks, gardens" }
];

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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Sync inputs with URL search parameters
  useEffect(() => {
    setLocInput(searchParams.get("location") || "");
    setInterestInput(searchParams.get("interest") || "");
    const dateParam = searchParams.get("created_date");
    setValue(dateParam ? dayjs(dateParam) : null);
  }, [searchParams]);

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

  const openPermissionPopup = () => {
    setLocationAnchorEl(null);
    setInterestAnchorEl(null);
    setAnchorEl(null);
    setIsMobileSearchOpen(false);
    setIsPermissionPopupOpen(true);
  };

  const handleLocationClick = (e: React.MouseEvent<HTMLElement>) => {
    setIsPermissionPopupOpen(false);
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
    <div className="bg-primary flex w-full items-center justify-between gap-4 sm:gap-6 rounded-full p-2.5 sm:p-3 sm:min-w-xl lg:min-w-4xl shadow-sm">
      {/* Location */}
      <div
        onClick={handleLocationClick}
        className="flex cursor-pointer gap-2 px-4 py-1.5 transition-all duration-300 hover:scale-105 items-center flex-1 min-w-0"
      >
        <LocationIcon className="text-btn01 h-5 w-5 flex-shrink-0" />
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-primary-dark text-xs sm:text-sm font-semibold">Location</p>
          <div className="text-secondary/40 text-xs font-medium flex items-center gap-1.5 min-w-0">
            {locLoading ? (
              <div className="flex items-center gap-1.5 text-btn01 font-semibold text-xs animate-pulse truncate py-0.5">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-btn01 border-t-transparent flex-shrink-0" />
                <span className="truncate">Detecting location...</span>
              </div>
            ) : (
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
            )}
            {locInput && !locLoading && (
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
        className="flex cursor-pointer gap-2 border-l border-slate-200/80 pl-4 sm:pl-5 px-4 py-1.5 transition-all duration-300 hover:scale-105 items-center flex-1 min-w-0"
      >
        <HeartIcon className="text-btn01 h-5 w-5 flex-shrink-0" />
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-primary-dark text-xs sm:text-sm font-semibold">Interest</p>
          <div className="text-secondary/40 text-xs font-medium min-w-0">
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

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="from-btn02 to-btn01 text-white flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-linear-to-tr to-75% p-3 shadow-md transition-all duration-200 active:scale-95 cursor-pointer hover:scale-105 flex-shrink-0"
        aria-label="Search"
      >
        <SearchIcon className="text-white h-5 w-5 flex-shrink-0" />
      </button>
    </div>
  );

  const activeFiltersCount = (locInput ? 1 : 0) + (interestInput ? 1 : 0);

  return (
    <div className="items-center mt-4 sm:mt-6 flex w-full flex-col justify-center gap-4 px-2">
      {/* Mobile Compact Search Trigger Bar (< sm) */}
      <div className="sm:hidden w-full">
        <div
          onClick={() => setIsMobileSearchOpen(true)}
          className="from-btn01/10 to-btn02/10 bg-linear-to-r p-0.5 rounded-full shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
        >
          <div className="bg-primary flex items-center justify-between rounded-full px-4 py-2.5 gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-9 w-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                <SearchIcon className="text-btn01 h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-primary-dark text-xs font-bold truncate">
                  {locLoading ? (
                    <span className="flex items-center gap-1.5 text-btn01 font-semibold truncate animate-pulse">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-btn01 border-t-transparent flex-shrink-0" />
                      <span className="truncate">Detecting location...</span>
                    </span>
                  ) : locInput || interestInput ? (
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="text-primary-dark font-semibold truncate">{locInput || "Any Location"}</span>
                      <span className="text-secondary/40">•</span>
                      <span className="text-btn01 font-semibold truncate">{interestInput || "Any Interest"}</span>
                    </span>
                  ) : (
                    "Where & What do you want to explore?"
                  )}
                </span>
                <span className="text-secondary/60 text-[11px] font-medium truncate">
                  {activeFiltersCount > 0 ? `${activeFiltersCount} filter(s) applied • Tap to change` : "Tap to search location, interest"}
                </span>
              </div>
            </div>
            <div className="from-btn02 to-btn01 text-white flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-tr shadow-xs flex-shrink-0">
              <SearchIcon className="text-white h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Expanded Search Bar (>= sm) */}
      <div className="hidden sm:flex from-btn01/10 to-btn02/10 w-full items-center justify-center rounded-full bg-linear-to-r p-0.5 shadow-md md:w-fit flex-1 max-w-4xl">
        {searchBarContent}
      </div>

      {/* Mobile Radix UI Search Dialog Popup */}
      <Dialog.Root open={isMobileSearchOpen && !isPermissionPopupOpen} onOpenChange={setIsMobileSearchOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[90vh] flex-col rounded-t-3xl bg-white p-5 shadow-2xl transition-transform duration-300 sm:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom overflow-hidden border-t border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center">
                  <SearchIcon className="text-btn01 h-4 w-4" />
                </div>
                <div>
                  <Dialog.Title className="text-primary-dark text-base font-bold">
                    Search & Filter
                  </Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Filter events and flocks by location and interest
                  </Dialog.Description>
                  <p className="text-secondary/60 text-[11px] font-medium">Find experiences near you</p>
                </div>
              </div>
              <Dialog.Close className="text-secondary/60 hover:text-primary-dark cursor-pointer rounded-full p-2 hover:bg-slate-100 transition-colors">
                <Icons.close size={18} />
              </Dialog.Close>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
              {/* Location Input Section */}
              <div className="space-y-2">
                <label className="text-primary-dark text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <LocationIcon className="text-btn01 h-4 w-4" />
                  <span>Location</span>
                </label>
                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-btn01 focus-within:ring-2 focus-within:ring-btn01/20 transition-all">
                  {locLoading ? (
                    <div className="flex items-center gap-2 text-btn01 font-bold text-xs animate-pulse py-0.5">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-btn01 border-t-transparent flex-shrink-0" />
                      <span>Detecting location...</span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={locInput}
                      onChange={(e) => setLocInput(e.target.value)}
                      placeholder="Search city or location..."
                      className="w-full bg-transparent text-sm font-semibold text-primary-dark outline-none placeholder:text-secondary/40"
                    />
                  )}
                  {locInput && !locLoading && (
                    <button
                      type="button"
                      onClick={() => setLocInput("")}
                      className="text-secondary/50 hover:text-secondary p-1"
                    >
                      <Icons.close size={16} />
                    </button>
                  )}
                </div>

                {/* GPS Detect Location Button */}
                <button
                  type="button"
                  onClick={openPermissionPopup}
                  disabled={locLoading}
                  className="w-full flex items-center justify-between p-2.5 bg-orange-50/80 border border-orange-200/60 rounded-xl text-left active:scale-[0.99] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <LocationIcon className="text-btn01 h-4.5 w-4.5" />
                    <div>
                      <p className="text-xs font-bold text-primary-dark">Use Current Location</p>
                      <p className="text-[10px] text-secondary/60">GPS automatic location detection</p>
                    </div>
                  </div>
                  <span className="text-btn01 text-xs font-bold">Detect →</span>
                </button>

                {/* Popular Cities Quick Select Chips */}
                <div className="pt-1">
                  <p className="text-[11px] font-semibold text-secondary/60 mb-2">Popular Cities</p>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                    {POPULAR_CITIES.filter((city) =>
                      city.toLowerCase().includes(locInput.toLowerCase().trim())
                    ).map((city) => {
                      const isSelected = locInput.toLowerCase() === city.toLowerCase();
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => setLocInput(city)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                            isSelected
                              ? "bg-btn01 text-white shadow-xs"
                              : "bg-slate-100 text-secondary hover:bg-slate-200"
                          }`}
                        >
                          {city}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Interest Input Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-primary-dark text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <HeartIcon className="text-btn01 h-4 w-4" />
                  <span>Interest</span>
                </label>
                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-btn01 focus-within:ring-2 focus-within:ring-btn01/20 transition-all">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    placeholder="Search interest category..."
                    className="w-full bg-transparent text-sm font-semibold text-primary-dark outline-none placeholder:text-secondary/40"
                  />
                  {interestInput && (
                    <button
                      type="button"
                      onClick={() => setInterestInput("")}
                      className="text-secondary/50 hover:text-secondary p-1"
                    >
                      <Icons.close size={16} />
                    </button>
                  )}
                </div>

                {/* Interest Quick Select Cards / Chips */}
                <div className="pt-1">
                  <p className="text-[11px] font-semibold text-secondary/60 mb-2">Categories</p>
                  <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                    {INTEREST_CATEGORIES.filter((cat) => {
                      const q = interestInput.toLowerCase().trim();
                      if (!q) return true;
                      if (cat.label.toLowerCase().includes(q)) return true;
                      const keywords = keywordMap[cat.value] || [];
                      return keywords.some((kw: string) => kw.includes(q));
                    }).map((category) => {
                      const isSelected = interestInput.toLowerCase() === category.label.toLowerCase();
                      return (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => setInterestInput(category.label)}
                          className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all cursor-pointer active:scale-95 border ${
                            isSelected
                              ? "bg-orange-50 border-btn01 text-btn01 font-bold shadow-xs"
                              : "bg-slate-50 border-slate-100 text-secondary hover:bg-slate-100"
                          }`}
                        >
                          <HeartIcon className="text-btn01 h-4 w-4 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate">{category.label}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              {(locInput || interestInput) && (
                <button
                  type="button"
                  onClick={() => {
                    setLocInput("");
                    setInterestInput("");
                    localStorage.removeItem("user_location");
                  }}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-secondary font-semibold text-xs hover:bg-slate-50 active:scale-95 transition-all"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  handleSearch();
                  setIsMobileSearchOpen(false);
                }}
                className="flex-1 from-btn02 to-btn01 text-white font-bold text-sm py-3 px-4 rounded-xl bg-linear-to-tr shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <SearchIcon className="text-white h-4 w-4" />
                <span>Search Now</span>
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Location Popover (Desktop) */}
      <Popover
        open={Boolean(locationAnchorEl) && !isPermissionPopupOpen}
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
            onClick={openPermissionPopup}
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
                {city}
              </button>
            ));
          })()}
        </div>
      </Popover>

      {/* Interest Popover (Desktop) */}
      <Popover
        open={Boolean(interestAnchorEl) && !isPermissionPopupOpen}
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
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 shadow-xs flex-shrink-0">
                  <HeartIcon className="text-btn01 h-4 w-4" />
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

      {/* Date Popover (Desktop) */}
      <Popover
        open={open && !isPermissionPopupOpen}
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
