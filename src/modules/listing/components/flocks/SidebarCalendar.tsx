import { useMemo, useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { ActivityItem } from "../../../../types";
import dayjs from "dayjs";

const CustomDayButton = (props: any) => {
  const { day, modifiers, className, ...buttonProps } = props;

  const modifierClasses: string[] = [];
  if (modifiers.activity) modifierClasses.push("!bg-[#E8E5FF] !text-[#5B4EFF] font-bold rounded-full");
  if (modifiers.selected) modifierClasses.push("!bg-[#E75B28] !text-white !font-extrabold rounded-full shadow-xs");
  if (modifiers.today) modifierClasses.push("border border-[#E75B28]");

  const combinedClassName = [
    modifierClasses.join(" "),
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
  selectedDate?: Date | undefined;
  onSelectDate?: (date: Date | undefined) => void;
  monthDate?: Date;
  onMonthChange?: (month: Date) => void;
  onActionClick?: (label: string) => void;
  onActivityClick?: (activityId: number | string) => void;
}

const SidebarCalendar = ({
  activities,
  selectedDate,
  onSelectDate,
  monthDate,
  onMonthChange,
  onActionClick,
  onActivityClick,
}: SidebarCalendarProps) => {
  // Internal state if selectedDate is not controlled
  const [internalSelected, setInternalSelected] = useState<Date | undefined>(new Date());
  const selected = selectedDate !== undefined ? selectedDate : internalSelected;

  const handleSelect = (date: Date | undefined) => {
    // Toggle: if clicking the already selected date, clear date filter
    if (selected && date && dayjs(selected).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD")) {
      if (onSelectDate) onSelectDate(undefined);
      else setInternalSelected(undefined);
      return;
    }

    if (onSelectDate) {
      onSelectDate(date);
    } else {
      setInternalSelected(date);
    }
  };

  // Month state (controlled by parent or internal)
  const [internalMonth, setInternalMonth] = useState<Date>(selected || monthDate || new Date());
  const month = monthDate !== undefined ? monthDate : internalMonth;

  const handleMonthChange = (newMonth: Date) => {
    if (onMonthChange) {
      onMonthChange(newMonth);
    } else {
      setInternalMonth(newMonth);
    }
  };

  // Derive Activity Dates for calendar highlighting (excluding draft activities)
  const derivedActivityDates = useMemo(() => {
    const actDates: Date[] = [];
    if (activities && activities.length > 0) {
      activities.forEach((activity) => {
        const status = (activity.status || activity.current_tab || "").toLowerCase();
        if (status === "draft") return;

        const dateStr = activity.start_date_time || activity.start_date || activity.end_date_time || activity.created_at;
        if (dateStr) {
          const d = dayjs(dateStr).toDate();
          if (!isNaN(d.getTime())) {
            actDates.push(d);
          }
        }
      });
    }
    return actDates;
  }, [activities]);

  const modifiers = useMemo(
    () => ({
      activity: derivedActivityDates,
    }),
    [derivedActivityDates]
  );

  // Activities list for current selection or current month
  const displayedActivities = useMemo(() => {
    if (!activities) return [];

    if (selected) {
      const selectedFormat = dayjs(selected).format("YYYY-MM-DD");
      return activities.filter((act) => {
        const status = (act.status || act.current_tab || "").toLowerCase();
        if (status === "draft") return false;

        const dateStr = act.start_date_time || act.start_date || act.end_date_time || act.created_at;
        if (!dateStr) return false;
        return dayjs(dateStr).format("YYYY-MM-DD") === selectedFormat;
      });
    }

    // If no specific date selected, filter activities for current displayed month
    const currentMonthNum = dayjs(month).month();
    const currentYearNum = dayjs(month).year();

    return activities.filter((act) => {
      const status = (act.status || act.current_tab || "").toLowerCase();
      if (status === "draft") return false;

      const dateStr = act.start_date_time || act.start_date || act.end_date_time || act.created_at;
      if (!dateStr) return true;
      const d = dayjs(dateStr);
      return d.month() === currentMonthNum && d.year() === currentYearNum;
    });
  }, [selected, month, activities]);

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[#E75B28] font-bold text-base tracking-wide">
          {month.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMonthChange(new Date(month.getFullYear(), month.getMonth() - 1))}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-100 text-slate-600 active:scale-95"
            title="Previous Month"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2]" />
          </button>

          <button
            onClick={() => handleMonthChange(new Date(month.getFullYear(), month.getMonth() + 1))}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-100 text-slate-600 active:scale-95"
            title="Next Month"
          >
            <ChevronRight className="h-5 w-5 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* CALENDAR */}
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        month={month}
        onMonthChange={handleMonthChange}
        showOutsideDays
        modifiers={modifiers}
        className="w-full"
        components={{
          DayButton: CustomDayButton
        }}
        classNames={{
          months: "w-full",
          month: "w-full",
          weekdays: "grid grid-cols-7 mb-3 gap-1",
          week: "grid grid-cols-7 mb-2 gap-1",
          weekday: "flex items-center justify-center text-xs font-semibold text-slate-400 uppercase",
          outside: "text-slate-300 opacity-50",
          hidden: "invisible",
          nav: "hidden",
          month_caption: "hidden",
        }}
      />

      {/* LEGEND */}
      <div className="mt-5 flex items-center justify-center gap-5 text-xs font-semibold text-slate-600 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#E8E5FF] border border-[#5B4EFF]/30" />
          <span>Activity</span>
        </div>
      </div>

      {/* EVENTS LIST */}
      <div className="mt-8 pt-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            {selected
              ? `Events on ${dayjs(selected).format("MMM D, YYYY")}`
              : `Events in ${dayjs(month).format("MMMM YYYY")}`}
          </h3>
          {selected && (
            <button
              onClick={() => handleSelect(undefined)}
              className="text-[11px] font-bold text-[#E75B28] hover:underline cursor-pointer"
            >
              Clear Date
            </button>
          )}
        </div>

        <div className="space-y-2">
          {displayedActivities.length > 0 ? (
            displayedActivities.map((act) => {
              const status = (act.status || act.current_tab || "ONGOING").toUpperCase();
              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between bg-white rounded-xl px-3.5 py-2.5 border border-slate-100 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#5B4EFF] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{act.name || act.title}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{status}</p>
                    </div>
                  </div>

                  {(onActivityClick || onActionClick) && (
                    <button
                      onClick={() =>
                        onActivityClick
                          ? onActivityClick(act.id)
                          : onActionClick && onActionClick(act.name || "Activity Details")
                      }
                      className="text-[#E75B28] hover:text-orange-700 transition cursor-pointer p-1 rounded-full hover:bg-orange-50"
                      title="View Activity Details"
                    >
                      <Eye className="h-4 w-4 stroke-[2]" />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 font-medium py-2">
              {selected
                ? `No activities scheduled on ${dayjs(selected).format("MMM D, YYYY")}.`
                : `No activities scheduled in ${dayjs(month).format("MMMM YYYY")}.`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarCalendar;
