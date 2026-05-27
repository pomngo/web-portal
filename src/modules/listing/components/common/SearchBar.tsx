import { useState, lazy, Suspense, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Popover from "@mui/material/Popover";

import { useUserLocation } from "../../../../hooks/useUserLocation";
import SearchIcon from "../../../../components/icons/SearchIcon";
import CalendarIcon from "../../../../components/icons/CalendarIcon";
import LocationIcon from "../../../../components/icons/LocationIcon";
import HeartIcon from "../../../../components/icons/HeartIcon";
import { Icons } from "../../../../constants/icons";

const DateCalendarValue = lazy(() => import("../../../../components/ui/DateCalendarValue"));

const SearchBar = () => {
  const { location } = useUserLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [locInput, setLocInput] = useState(searchParams.get("location") || "");
  const [interestInput, setInterestInput] = useState(searchParams.get("interest") || "");
  
  // Set date from URL if present
  const urlDate = searchParams.get("created_date");
  const [value, setValue] = useState<Dayjs | null>(urlDate ? dayjs(urlDate) : null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (!searchParams.get("location") && location?.city) {
      setLocInput(location.city.split(" ")[0]);
    }
  }, [location, searchParams]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    if (locInput) newParams.set("location", locInput);
    else newParams.delete("location");

    if (interestInput) newParams.set("interest", interestInput);
    else newParams.delete("interest");

    if (value) newParams.set("created_date", value.format("YYYY-MM-DD"));
    else newParams.delete("created_date");

    setSearchParams(newParams);

    if (window.location.pathname.includes("/detail")) {
      navigate(`/activities?${newParams.toString()}`);
    }
  };

  return (
    <div className="itecms-center mt-6 flex w-full justify-center">
      <div className="from-btn01/10 to-btn02/10 hidden w-fit items-center justify-center rounded-full bg-linear-to-r p-0.5 sm:flex">
        <div className="bg-primary flex items-center justify-between gap-10 rounded-full p-5 sm:min-w-xl lg:min-w-4xl">
          {/* Search Option */}
          <div className="flex cursor-pointer gap-2 px-5 py-2 transition-all duration-300 hover:scale-105">
            {/* {Icons && <Icons.map className="text-btn01" />} */}
            <LocationIcon />
            <div className={`flex flex-col`}>
              <p className="text-primary-dark text-sm font-medium">Location</p>
              <div className="text-secondary/40 text-xs font-medium">
                <input
                  type="search"
                  value={locInput}
                  onChange={(e) => setLocInput(e.target.value)}
                  className="text-secondary rounded-md bg-white p-0.5 text-xs font-medium outline-none"
                  placeholder="Search Location"
                  list="interest-suggestions"
                />

                <datalist id="interest-suggestions">
                  <option value="Mumbai" />
                  <option value="Pune" />
                  <option value="Delhi" />
                  <option value="Bangalore" />
                  <option value="Hyderabad" />
                  <option value="Chennai" />
                  <option value="Kolkata" />
                  <option value="Ahmedabad" />
                  <option value="Jaipur" />
                  <option value="Surat" />
                  <option value="Lucknow" />
                </datalist>
              </div>
            </div>
          </div>
          <div className="flex cursor-pointer gap-2 border-l px-5 py-2 transition-all duration-300 hover:scale-105">
            {/* {Icons && <Icons.heart className="text-btn01" />} */}

            <HeartIcon />

            <div className={`flex flex-col`}>
              <p className="text-primary-dark text-sm font-medium">Interest</p>
              <div className="text-secondary/40 text-xs font-medium">
                <input
                  type="search"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  className="text-secondary/70 bg-transparent p-0.5 px-0 text-xs font-medium text-nowrap outline-none"
                  placeholder="Search Interest"
                  list="interest-suggestions"
                />
                <datalist id="interest-suggestions" className="bg-white">
                  <option value="Travel" />
                  <option value="Adventure" />
                  <option value="Music" />
                  <option value="Gaming" />
                  <option value="Photography" />
                  <option value="Fitness" />
                  <option value="Food" />
                  <option value="Movies" />
                  <option value="Technology" />
                  <option value="Nature" />
                </datalist>
              </div>
            </div>
          </div>
          <div
            onClick={handleOpen}
            className="flex cursor-pointer gap-2 border-l px-5 py-2 transition-all duration-300 hover:scale-105"
          >
            {/* {Icons && <Icons.calendar className="text-btn01" />} */}
            <CalendarIcon />
            <div className={`flex flex-col`}>
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

          <button
            onClick={handleSearch}
            className="bg-btn-light/20 text-primary flex h-12 w-12 animate-pulse cursor-pointer items-center justify-center rounded-full p-2 transition-all duration-200 active:scale-95"
          >
            {/* <Icons.search className="text-btn01" /> */}
            <SearchIcon />
          </button>
        </div>
      </div>

      <div className="from-btn01/10 to-btn02/10 flex w-full items-center justify-center rounded-full bg-linear-to-r p-0.5 shadow-md sm:hidden">
        <div className="bg-primary flex w-full items-center gap-2 rounded-full p-2">
          <Link
            to={"/"}
            className="bg-btn-light/20 text-secondary flex h-12 w-12 animate-pulse cursor-pointer items-center justify-center rounded-full transition-all duration-200 active:scale-95"
          >
            <Icons.serarch1 />
          </Link>
          <h3 className="">Start Your Search</h3>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
