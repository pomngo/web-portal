import { useState } from "react";
import DateCalendarValue from "../../../../components/ui/DateCalendarValue";
import { Icons } from "../../../../constants/icons";
import { useUserLocation } from "../../../../hooks/useUserLocation";
import dayjs, { Dayjs } from "dayjs";
import Popover from "@mui/material/Popover";

const SearchBar = () => {
  const { location } = useUserLocation();
  const [value, setValue] = useState<Dayjs | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="mt-6 w-full flex justify-center itecms-center">
      <div className="rounded-full flex justify-center items-center bg-linear-to-r from-btn01/10 to-btn02/10  p-0.5 w-fit ">
        <div className="rounded-full bg-primary p-5 sm:min-w-xl lg:min-w-4xl flex justify-between items-center gap-10 ">
          {/* Search Option */}
          <div className="px-5 py-2 transition-all duration-300 hover:scale-105 flex gap-2 cursor-pointer ">
            {/* {Icons && <Icons.map className="text-btn01" />} */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="relative top-0.5"
            >
              <path
                d="M7.99991 0.160156C4.5994 0.164013 1.8437 2.91971 1.83984 6.32022C1.83984 11.5913 7.4399 15.5722 7.67861 15.7388C7.87149 15.8739 8.12832 15.8739 8.32121 15.7388C8.55991 15.5722 14.16 11.5913 14.16 6.32022C14.1561 2.91971 11.4004 0.164013 7.99991 0.160156ZM7.99991 4.08019C9.72428 4.08019 10.802 5.94688 9.93983 7.44023C9.07764 8.93357 6.92218 8.93357 6.05999 7.44023C5.86339 7.0997 5.75988 6.71343 5.75988 6.32022C5.75988 5.08305 6.76274 4.08014 7.99991 4.08019Z"
                fill="#575757"
              />
            </svg>
            <div className={`flex flex-col`}>
              <p className="text-sm font-medium text-primary-dark">Location</p>
              <div className="text-xs font-medium text-secondary/40">
                <input
                  type="search"
                  defaultValue={location?.city?.split(" ")[0] || ""}
                  className="p-0.5 outline-none text-xs font-medium text-secondary bg-white rounded-md"
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
          <div className=" px-5 py-2 transition-all duration-300 hover:scale-105 flex gap-2 cursor-pointer border-l ">
            {/* {Icons && <Icons.heart className="text-btn01" />} */}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="relative top-0.5"
            >
              <g clip-path="url(#clip0_5130_4775)">
                <path
                  d="M15.8399 5.62125C15.8399 10.5212 8.57461 14.4874 8.26521 14.6512C8.09957 14.7404 7.90026 14.7404 7.73461 14.6512C7.42521 14.4874 0.159912 10.5212 0.159912 5.62125C0.162612 3.22545 2.10412 1.28395 4.49991 1.28125C5.94541 1.28125 7.21101 1.90285 7.99991 2.95355C8.78881 1.90285 10.0544 1.28125 11.4999 1.28125C13.8957 1.28395 15.8372 3.22545 15.8399 5.62125Z"
                  fill="#575757"
                />
              </g>
              <defs>
                <clipPath id="clip0_5130_4775">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <div className={`flex flex-col`}>
              <p className="text-sm font-medium text-primary-dark">Interest</p>
              <div className="text-xs font-medium text-secondary/40">
                <input
                  type="search"
                  className="p-0.5 px-0 outline-none text-xs font-medium text-secondary/70 bg-transparent text-nowrap"
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
            className="px-5 py-2 transition-all duration-300 hover:scale-105 flex gap-2 cursor-pointer border-l"
          >
            {/* {Icons && <Icons.calendar className="text-btn01" />} */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="top-0.5 relative"
            >
              <path
                d="M14.0309 1.36623H12.2216V0.763153C12.2216 0.298903 11.7191 0.00875252 11.317 0.240878C11.1304 0.348603 11.0155 0.547696 11.0155 0.763153V1.36623H4.98472V0.763153C4.98472 0.298903 4.48216 0.00875252 4.08011 0.240878C3.89351 0.348603 3.77857 0.547696 3.77857 0.763153V1.36623H1.96934C1.3032 1.36623 0.763184 1.90625 0.763184 2.57238V14.6339C0.763184 15.3001 1.3032 15.8401 1.96934 15.8401H14.0309C14.697 15.84 15.237 15.3 15.237 14.6339V2.57238C15.237 1.90622 14.697 1.3662 14.0309 1.36623ZM14.0309 4.98469H1.96934V2.57238H3.77857V3.17546C3.77857 3.63971 4.28113 3.92987 4.68318 3.69774C4.86978 3.59002 4.98472 3.39092 4.98472 3.17546V2.57238H11.0155V3.17546C11.0155 3.63971 11.5181 3.92987 11.9201 3.69774C12.1067 3.59002 12.2216 3.39092 12.2216 3.17546V2.57238H14.0309V4.98469Z"
                fill="#575757"
              />
            </svg>
            <div className={`flex flex-col`}>
              <p className="text-sm font-medium text-primary-dark">Date</p>
              <span className="text-xs font-medium text-secondary/40 text-nowrap">
                {!value ? "Select Date" : value.format("DD MMM YYYY")}
              </span>
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
            <DateCalendarValue
              value={value}
              setValue={setValue}
              onClose={handleClose}
            />
          </Popover>

          <button className="h-12 w-12 p-2 bg-btn-light/20 text-primary rounded-full flex justify-center items-center">
            {/* <Icons.search className="text-btn01" /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <g clip-path="url(#clip0_5130_4789)">
                <path
                  d="M23.4952 22.2169L17.8395 16.5624C22.7429 10.6757 19.4348 1.68842 11.8851 0.385386C4.33533 -0.917636 -1.79383 6.44081 0.852587 13.6306C3.22817 20.0846 11.2777 22.2415 16.562 17.8399L22.2165 23.4956C22.7087 23.9877 23.549 23.7625 23.7292 23.0902C23.8128 22.7782 23.7236 22.4453 23.4952 22.2169ZM2.07222 10.2053C2.07222 3.94477 8.84948 0.0319111 14.2713 3.1622C19.6931 6.29249 19.6931 14.1182 14.2713 17.2485C13.0351 17.9622 11.6324 18.338 10.2049 18.3381C5.71543 18.3331 2.0772 14.6949 2.07222 10.2053Z"
                  fill="url(#paint0_linear_5130_4789)"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_5130_4789"
                  x1="23.76"
                  y1="11.9977"
                  x2="0.226074"
                  y2="11.9977"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#EF7F23" />
                  <stop offset="1" stop-color="#E74728" />
                </linearGradient>
                <clipPath id="clip0_5130_4789">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
