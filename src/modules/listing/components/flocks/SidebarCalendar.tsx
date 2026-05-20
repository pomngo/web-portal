import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Plus } from "lucide-react";

import { DayPicker } from "react-day-picker";

import "react-day-picker/dist/style.css";

const holidayDates = [
  new Date(2025, 9, 9),
  new Date(2025, 9, 10),
  new Date(2025, 9, 11),
];

const activityDates = [new Date(2025, 9, 9), new Date(2025, 9, 17)];

const draftDates = [new Date(2025, 9, 11), new Date(2025, 9, 23)];

const events = {
  Holiday: [
    {
      title: "Diwali",
      date: "Oct 9",
    },
    {
      title: "Goverdhan Pooja",
      date: "Oct 10",
    },
    {
      title: "Bhai Dooj",
      date: "Oct 11",
    },
  ],

  Activity: [
    {
      title: "Road Trip Meetup",
      date: "Oct 17",
    },
  ],
};

const SidebarCalendar = () => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  const [month, setMonth] = useState(new Date());

  const modifiers = useMemo(
    () => ({
      holiday: holidayDates,
      activity: activityDates,
      draft: draftDates,
    }),
    [],
  );

  return (
    <div className="w-full max-w-md rounded-xl bg-primary p-8">
      {/* HEADER */}
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-base font-medium bg-linear-to-br from-btn01 to-btn-light to-65% bg-clip-text text-transparent">
          {month.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1))
            }
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 cursor-pointer active:scale-95 transition-all duration-200"
          >
            <ChevronLeft className="h-8 w-8 stroke-[1.5] text-secondary" />
          </button>

          <button
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1))
            }
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 cursor-pointer active:scale-95 transition-all duration-200"
          >
            <ChevronRight className="h-8 w-8 stroke-[1.5] text-secondary" />
          </button>
        </div>
      </div>

      {/* CALENDAR */}
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        month={month}
        onMonthChange={setMonth}
        showOutsideDays
        modifiers={modifiers}
        className="w-full"
        classNames={{
          months: "w-full",
          month: "w-full",

          weekdays: "grid grid-cols-7 mb-5",

          week: "grid grid-cols-7 mb-0",

          weekday:
            "flex items-center justify-center text-[15px] font-semibold text-black/60",

          day: "relative flex h-[40px] w-[40px] items-center justify-center rounded-full text-[16px] font-medium text-[#333] transition-all m-1 mx-2",

          today: "border border-[#FF5B2E]",

          selected: "!bg-[#C9C2FF] !text-black",

          outside: "text-[#B8B8B8]",

          hidden: "invisible",

          nav: "hidden",

          month_caption: "hidden",
        }}
        modifiersClassNames={{
          holiday: "bg-[#F8D5E5] text-black hover:bg-[#F8D5E5]",

          activity: "bg-[#C9C2FF] text-black hover:bg-[#C9C2FF]",

          draft: "bg-[#F8E6D5] text-black hover:bg-[#F8E6D5]",
        }}
      />

      {/* LEGEND */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-[#F8E6D5]" />

          <span className="text-[14px] text-black/75">Draft</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-[#C9C2FF]" />

          <span className="text-[14px] text-black/75">Activity</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-[#F8D5E5]" />

          <span className="text-[14px] text-black/75">Holiday</span>
        </div>
      </div>

      {/* EVENTS */}
      <div className="mt-12">
        <h3 className="text-[16px] font-semibold text-secondary">
          Events List
        </h3>

        {/* HOLIDAY */}
        <div className="mt-7">
          <h4 className="text-[14px] font-semibold text-[#0066FF]">Holiday</h4>

          <div className="mt-5 rounded-xl bg-secondary/5 px-5 py-1">
            {events.Holiday.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between border-b border-black/10 py-3 last:border-none"
              >
                <div className="flex items-center gap-4">
                  <span className="h-4 w-4 rounded-full border-2 border-pink-300" />

                  <p className="text-[14px] font-medium text-black/80">
                    {item.date} - {item.title}
                  </p>
                </div>

                <button className="text-[#FF5B2E] transition hover:scale-110">
                  <Plus className="h-6 w-6 stroke-1" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="mt-9">
          <h4 className="text-[14px] font-semibold text-[#0066FF]">Activity</h4>

          <div className="mt-5 rounded-xl bg-secondary/5 px-5 py-1">
            {events.Activity.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between py-3"
              >
                <div className="flex gap-4">
                  <span className="h-4 w-4 rounded-full bg-[#C9C2FF]" />

                  <p className="text-[14px] flex flex-col font-medium">
                    <span className="text-primary-dark/80">{item.title}</span>
                    <span className="text-[12px] text-secondary/80">
                      {item.date}
                    </span>
                  </p>
                </div>

                <button className="text-[#FF5B2E] transition hover:scale-110">
                  <Eye className="h-6 w-6 stroke-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarCalendar;
