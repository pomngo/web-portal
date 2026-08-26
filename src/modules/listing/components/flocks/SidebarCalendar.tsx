import { useMemo, useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Eye, Plus } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { ActivityItem } from "../../../../types";
import dayjs from "dayjs";

const holidayDates = [new Date(2025, 9, 9), new Date(2025, 9, 10), new Date(2025, 9, 11)];
const fallbackActivityDates = [new Date(2025, 9, 9), new Date(2025, 9, 17)];
const fallbackDraftDates = [new Date(2025, 9, 11), new Date(2025, 9, 23)];

const mockHolidays = [
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
];

const CustomDayButton = (props: any) => {
  const { day, modifiers, className, ...buttonProps } = props;

  const modifierClasses: string[] = [];
  if (modifiers.holiday) modifierClasses.push("!bg-[#F8D5E5] !text-black hover:!bg-[#F8D5E5]");
  if (modifiers.activity) modifierClasses.push("!bg-[#C9C2FF] !text-black hover:!bg-[#C9C2FF] rounded-full");
  if (modifiers.draft) modifierClasses.push("!bg-[#F8E6D5] !text-black hover:!bg-[#F8E6D5]");
  if (modifiers.selected) modifierClasses.push("!bg-[#f97316] !text-black");
  if (modifiers.today) modifierClasses.push("border border-[#f97316]");

  const combinedClassName = [
    // "relative flex w-full aspect-square max-w-[32px] sm:max-w-[32px] lg:max-w-[32px] xl:max-w-[32px] mx-auto items-center justify-center rounded-full text-xs sm:text-sm lg:text-xs xl:text-sm font-semibold text-[#333] transition-all hover:bg-black/5 focus:outline-none flex-shrink-0",
    ...modifierClasses,
    className
  ]
    .filter(Boolean)
    .join(" ");

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      className={combinedClassName}
      {...buttonProps}
    />
  );
};

interface SidebarCalendarProps {
  activities?: ActivityItem[];
}

const SidebarCalendar = ({ activities }: SidebarCalendarProps) => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  const { derivedActivityDates, derivedDraftDates } = useMemo(() => {
    const act: Date[] = [];
    const drf: Date[] = [];
    if (activities && activities.length > 0) {
      activities.forEach((activity) => {
        const d = new Date(activity.created_at);
        if (!isNaN(d.getTime())) {
          const status = (activity.status || activity.current_tab || "").toLowerCase();
          if (status === "draft") {
            drf.push(d);
          } else {
            act.push(d);
          }
        }
      });
    }
    return { derivedActivityDates: act, derivedDraftDates: drf };
  }, [activities]);

  const finalActivityDates = activities && activities.length > 0 ? derivedActivityDates : fallbackActivityDates;
  const finalDraftDates = activities && activities.length > 0 ? derivedDraftDates : fallbackDraftDates;

  const initialMonth = useMemo(() => {
    if (activities && activities.length > 0) {
      const firstActDate = new Date(activities[0].created_at);
      if (!isNaN(firstActDate.getTime())) {
        return firstActDate;
      }
    }
    return new Date(2025, 9, 1); // fallback to Oct 2025 for mock data
  }, [activities]);

  const [month, setMonth] = useState(initialMonth);

  useEffect(() => {
    setMonth(initialMonth);
  }, [initialMonth]);

  const modifiers = useMemo(
    () => ({
      holiday: holidayDates,
      activity: finalActivityDates,
      draft: finalDraftDates,
    }),
    [finalActivityDates, finalDraftDates]
  );

  return (
    <div className="w-full p-4 sm:p-6 lg:p-0">
      {/* HEADER */}
      <div className="mb-10 flex items-center justify-between">
        <h2 className="from-btn01 to-btn-light bg-linear-to-br to-65% bg-clip-text text-base font-medium text-transparent">
          {month.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95"
          >
            <ChevronLeft className="text-secondary h-8 w-8 stroke-[1.5]" />
          </button>

          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95"
          >
            <ChevronRight className="text-secondary h-8 w-8 stroke-[1.5]" />
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
        components={{
          DayButton: CustomDayButton
        }}
        classNames={{
          months: "w-full",
          month: "w-full",

          weekdays: "grid grid-cols-7 mb-4 sm:mb-5 gap-1 xl:gap-2",

          week: "grid grid-cols-7 mb-2 sm:mb-3 gap-1 xl:gap-2",

          weekday: "flex items-center justify-center text-xs sm:text-[15px] font-semibold text-black/60",

          // day: "p-0 text-center align-middle relative",

          outside: "text-[#B8B8B8] opacity-50",

          hidden: "invisible",

          nav: "hidden",

          month_caption: "hidden",
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
        <h3 className="text-secondary text-[16px] font-semibold">Events List</h3>

        {/* HOLIDAY */}
        <div className="mt-7">
          <h4 className="text-[14px] font-semibold text-[#0066FF]">Holiday</h4>

          <div className="bg-secondary/5 mt-5 rounded-xl px-5 py-1">
            {mockHolidays.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between border-b border-black/10 py-3 last:border-none"
              >
                <div className="flex items-center gap-4">
                  <span className="h-4 w-4 rounded-full border-2 border-pink-300 flex-shrink-0" />

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

          <div className="bg-secondary/5 mt-5 rounded-xl px-5 py-1">
            {activities && activities.length > 0 ? (
              activities
                .filter((item) => (item.status || item.current_tab || "").toLowerCase() !== "draft")
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-black/10 py-3 last:border-none"
                  >
                    <div className="flex gap-4">
                      <span className="h-4 w-4 rounded-full bg-[#C9C2FF] flex-shrink-0" />

                      <p className="flex flex-col text-[14px] font-medium">
                        <span className="text-primary-dark/80">{item.name}</span>
                        <span className="text-secondary/80 text-[12px]">
                          {dayjs(item.created_at).format("MMM D")}
                        </span>
                      </p>
                    </div>

                    <button className="text-[#FF5B2E] transition hover:scale-110">
                      <Eye className="h-6 w-6 stroke-1" />
                    </button>
                  </div>
                ))
            ) : (
              <div className="flex items-center justify-between py-3">
                <div className="flex gap-4">
                  <span className="h-4 w-4 rounded-full bg-[#C9C2FF] flex-shrink-0" />

                  <p className="flex flex-col text-[14px] font-medium">
                    <span className="text-primary-dark/80">Road Trip Meetup</span>
                    <span className="text-secondary/80 text-[12px]">Oct 17</span>
                  </p>
                </div>

                <button className="text-[#FF5B2E] transition hover:scale-110">
                  <Eye className="h-6 w-6 stroke-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarCalendar;
