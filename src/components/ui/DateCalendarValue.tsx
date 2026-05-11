// DateCalendarValue.tsx

import * as React from "react";
import dayjs, { Dayjs } from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

type Props = {
  value: Dayjs | null;
  setValue: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  onClose: () => void;
};

export default function DateCalendarValue({ value, setValue, onClose }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={value}
        onChange={(newValue) => {
          setValue(newValue);

          if (newValue) {
            onClose();
          }
        }}
        sx={{
          "&.MuiDateCalendar-root": {
            borderRadius: "20px",
          },

          "& .MuiPickersCalendarHeader-label": {
            color: "#EF7F23",
            fontWeight: "bold",
            fontSize: "18px",
          },

          // Remove dropdown arrow
          "& .MuiPickersCalendarHeader-switchViewButton": {
            display: "none",
          },

          // Navigation arrows
          "& .MuiPickersArrowSwitcher-button": {
            color: "#EF7F23",
          },

          // Selected date
          "& .Mui-selected": {
            backgroundColor: "#EF7F23 !important",
            color: "#fff !important",
          },

          "& .Mui-selected:hover": {
            backgroundColor: "#d96f1d !important",
          },

          // Today's date
          "& .MuiPickersDay-today": {
            border: "1px solid #EF7F23",
          },
        }}
      />
    </LocalizationProvider>
  );
}
