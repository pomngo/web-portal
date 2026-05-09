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
        <div className="rounded-full bg-primary p-5 min-w-xl lg:min-w-4xl flex justify-between items-center gap-10">
          {/* Search Option */}
          <div className="px-5 py-2 transition-all duration-300 hover:scale-105 flex gap-3 cursor-pointer ">
            {Icons && <Icons.map className="text-btn01" />}
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
          <div className=" px-5 py-2 transition-all duration-300 hover:scale-105 flex gap-3 cursor-pointer border-l ">
            {Icons && <Icons.heart className="text-btn01" />}
            <div className={`flex flex-col`}>
              <p className="text-sm font-medium text-primary-dark">Interest</p>
              <div className="text-xs font-medium text-secondary/40">
                <input
                  type="search"
                  className="p-0.5 px-0 outline-none text-xs font-medium text-secondary/70 bg-transparent"
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
            className="px-5 py-2 transition-all duration-300 hover:scale-105 flex gap-3 cursor-pointer border-l"
          >
            {Icons && <Icons.calendar className="text-btn01" />}
            <div className={`flex flex-col`}>
              <p className="text-sm font-medium text-primary-dark">Date</p>
              <span className="text-xs font-medium text-secondary/40">
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
            <Icons.search className="text-btn01" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
