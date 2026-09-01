import { useMemo, useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Eye, Plus } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { ActivityItem } from "../../../../types";
import dayjs from "dayjs";

const CustomDayButton = (props: any) => {
  const { day, modifiers, className, ...buttonProps } = props;

  const modifierClasses: string[] = [];
  if (modifiers.holiday) modifierClasses.push("!bg-[#FCE4EC] !text-[#D81B60] font-bold rounded-full");
  if (modifiers.activity) modifierClasses.push("!bg-[#E8E5FF] !text-[#5B4EFF] font-bold rounded-full");
  if (modifiers.draft) modifierClasses.push("!bg-[#FFF0E6] !text-[#E75B28] font-bold rounded-full");
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
  onActionClick?: (label: string) => void;
}

const SidebarCalendar = ({ activities, onActionClick }: SidebarCalendarProps) => {
  // Default selected date to CURRENT DATE
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  // Default month to CURRENT DATE
  const [month, setMonth] = useState<Date>(new Date());

  const { derivedActivityDates, derivedDraftDates } = useMemo(() => {
    const act: Date[] = [];
    const drf: Date[] = [];
    if (activities && activities.length > 0) {
      activities.forEach((activity) => {
        const dateStr = activity.start_date_time || activity.created_at;
        if (dateStr) {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            const status = (activity.status || activity.current_tab || "").toLowerCase();
            if (status === "draft") {
              drf.push(d);
            } else {
              act.push(d);
            }
          }
        }
      });
    }
    return { derivedActivityDates: act, derivedDraftDates: drf };
  }, [activities]);

  const modifiers = useMemo(
    () => ({
      activity: derivedActivityDates,
      draft: derivedDraftDates,
    }),
    [derivedActivityDates, derivedDraftDates]
  );

  // Activities on the selected day
  const selectedDayActivities = useMemo(() => {
    if (!selected || !activities) return [];
    const selYear = selected.getFullYear();
    const selMonth = selected.getMonth();
    const selDate = selected.getDate();

    return activities.filter((act) => {
      const dateStr = act.start_date_time || act.created_at;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d.getFullYear() === selYear && d.getMonth() === selMonth && d.getDate() === selDate;
    });
  }, [selected, activities]);

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
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-100 text-slate-600 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2]" />
          </button>

          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-100 text-slate-600 active:scale-95"
          >
            <ChevronRight className="h-5 w-5 stroke-[2]" />
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
          <span className="h-3 w-3 rounded-full bg-[#FFF0E6] border border-[#E75B28]/30" />
          <span>Draft</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#E8E5FF] border border-[#5B4EFF]/30" />
          <span>Activity</span>
        </div>
      </div>

      {/* EVENTS LIST */}
      <div className="mt-8 pt-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Events on {selected ? dayjs(selected).format("MMM D, YYYY") : "Selected Date"}
          </h3>
          {onActionClick && (
            <button
              onClick={() => onActionClick("Create Event")}
              className="text-[#E75B28] hover:text-orange-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Event</span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          {selectedDayActivities.length > 0 ? (
            selectedDayActivities.map((act) => {
              const status = (act.status || act.current_tab || "ONGOING").toUpperCase();
              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between bg-white rounded-xl px-3.5 py-2.5 border border-slate-100 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        status === "DRAFT" ? "bg-[#E75B28]" : "bg-[#5B4EFF]"
                      } flex-shrink-0`}
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{act.name || act.title}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{status}</p>
                    </div>
                  </div>

                  {onActionClick && (
                    <button
                      onClick={() => onActionClick(act.name || "Activity Details")}
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
              No activities scheduled on this date.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarCalendar;
