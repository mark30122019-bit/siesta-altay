"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

export type DateRangeValue = {
  start: Date | null;
  end: Date | null;
};

type DateRangePickerProps = {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  name?: string;
  required?: boolean;
  className?: string;
};

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBeforeDay(a: Date, b: Date) {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function isAfterDay(a: Date, b: Date) {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

function addMonths(date: Date, amount: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** Monday-first weekday index: 0 = Mon … 6 = Sun */
function mondayFirstWeekday(date: Date) {
  return (date.getDay() + 6) % 7;
}

function nightsBetween(start: Date, end: Date) {
  const ms = startOfDay(end).getTime() - startOfDay(start).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function pluralNights(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  const labels = UI_CONFIG.base.datePicker;
  if (mod10 === 1 && mod100 !== 11) return labels.nightsOne;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return labels.nightsFew;
  }
  return labels.nightsMany;
}

function formatDayMonth(date: Date) {
  const months = UI_CONFIG.base.datePicker.monthsShort;
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

export function formatDateRangeLabel(value: DateRangeValue): string {
  if (!value.start && !value.end) return "";
  if (value.start && !value.end) return formatDayMonth(value.start);
  if (value.start && value.end) {
    const sameYear = value.start.getFullYear() === value.end.getFullYear();
    const startLabel = formatDayMonth(value.start);
    const endLabel = formatDayMonth(value.end);
    if (sameYear) {
      return `${startLabel} — ${endLabel} ${value.end.getFullYear()}`;
    }
    return `${startLabel} ${value.start.getFullYear()} — ${endLabel} ${value.end.getFullYear()}`;
  }
  return "";
}

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DateRangePicker({
  value,
  onChange,
  name = "dates",
  required,
  className,
}: DateRangePickerProps) {
  const labels = UI_CONFIG.base.datePicker;
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState(() =>
    startOfDay(value.start ?? new Date())
  );

  const today = useMemo(() => startOfDay(new Date()), []);
  const displayValue = formatDateRangeLabel(value);
  const complete = Boolean(value.start && value.end);
  const selectingEnd = Boolean(value.start && !value.end);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setHoverDate(null);
      }
    }

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setHoverDate(null);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstWeekday = mondayFirstWeekday(new Date(year, month, 1));
  const totalDays = daysInMonth(year, month);

  const cells = useMemo(() => {
    const items: Array<{ date: Date | null; key: string }> = [];
    for (let i = 0; i < firstWeekday; i += 1) {
      items.push({ date: null, key: `pad-${i}` });
    }
    for (let day = 1; day <= totalDays; day += 1) {
      items.push({
        date: new Date(year, month, day),
        key: `day-${year}-${month}-${day}`,
      });
    }
    while (items.length % 7 !== 0) {
      items.push({ date: null, key: `trail-${items.length}` });
    }
    return items;
  }, [firstWeekday, totalDays, year, month]);

  const previewEnd =
    selectingEnd && hoverDate && value.start && !isBeforeDay(hoverDate, value.start)
      ? hoverDate
      : value.end;

  function isInRange(date: Date) {
    if (!value.start || !previewEnd) return false;
    return !isBeforeDay(date, value.start) && !isAfterDay(date, previewEnd);
  }

  function isRangeEdge(date: Date) {
    return isSameDay(date, value.start) || isSameDay(date, previewEnd);
  }

  function handleSelect(date: Date) {
    if (isBeforeDay(date, today)) return;

    if (!value.start || (value.start && value.end)) {
      onChange({ start: startOfDay(date), end: null });
      setHoverDate(null);
      return;
    }

    if (isBeforeDay(date, value.start) || isSameDay(date, value.start)) {
      onChange({ start: startOfDay(date), end: null });
      setHoverDate(null);
      return;
    }

    onChange({ start: value.start, end: startOfDay(date) });
    setHoverDate(null);
  }

  function handleClear() {
    onChange({ start: null, end: null });
    setHoverDate(null);
    setViewMonth(startOfDay(new Date()));
  }

  function handleApply() {
    if (!complete) return;
    setOpen(false);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((prev) => !prev);
    }
  }

  const nights =
    value.start && value.end ? nightsBetween(value.start, value.end) : 0;

  const hint = !value.start
    ? labels.selectCheckIn
    : !value.end
      ? labels.selectCheckOut
      : `${nights} ${pluralNights(nights)}`;

  const hiddenValue =
    value.start && value.end
      ? `${toIsoDate(value.start)}_${toIsoDate(value.end)}`
      : "";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <input
        type="text"
        name={name}
        value={hiddenValue}
        required={required}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-xl border border-black/[0.06] bg-gradient-to-b from-white/90 to-[#FAF7F2] px-4 py-3 text-left font-sans text-sm shadow-[var(--shadow-input)] transition-[border-color,box-shadow,background-color] duration-300",
          "outline-none focus:border-[#BC5434]/35 focus:bg-white focus:shadow-[var(--shadow-input-focus)]",
          open && "border-[#BC5434]/35 bg-white shadow-[var(--shadow-input-focus)]",
          complete &&
            !open &&
            "border-[#5c6b3a]/35 bg-[#F4F7F0] text-[#1A241C]",
          displayValue && !complete ? "text-[#1A241C]" : null,
          !displayValue && "text-[#9A9288]"
        )}
      >
        <span className="min-w-0 truncate">
          {displayValue || labels.triggerLabel}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <Icon
            name="calendar"
            size={18}
            className={cn(
              "transition-colors",
              open
                ? "text-[#BC5434]"
                : complete
                  ? "text-[#3D4F40]"
                  : "text-[#A89F94]"
            )}
          />
          {complete && !open ? (
            <span className="flex size-6 items-center justify-center rounded-full bg-[#E8ECDF] text-[#3D4F40]">
              <Icon name="check" size={14} />
            </span>
          ) : null}
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label={labels.triggerLabel}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 z-40 mt-2 origin-top"
          >
            <div className="surface-card overflow-hidden rounded-2xl border border-[#E8E0D4]/95 p-4 shadow-[0_18px_50px_rgba(42,36,28,0.16)] md:p-5">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4A24A]/45 to-transparent"
                aria-hidden
              />

              <div className="mb-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setViewMonth((prev) => addMonths(prev, -1))}
                  className="btn-tactile flex size-9 items-center justify-center rounded-full border border-[#E8E0D4] bg-white/70 text-[#3A3A34] transition-colors hover:bg-white"
                  aria-label={labels.prevMonth}
                >
                  <Icon name="chevronLeft" size={18} />
                </button>

                <Typography
                  variant="h3"
                  className="font-serif text-base font-normal capitalize tracking-[0.04em] text-[#1A241C] md:text-lg"
                >
                  {labels.months[month]} {year}
                </Typography>

                <button
                  type="button"
                  onClick={() => setViewMonth((prev) => addMonths(prev, 1))}
                  className="btn-tactile flex size-9 items-center justify-center rounded-full border border-[#E8E0D4] bg-white/70 text-[#3A3A34] transition-colors hover:bg-white"
                  aria-label={labels.nextMonth}
                >
                  <Icon name="chevron" size={18} />
                </button>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1">
                {labels.weekdays.map((day) => (
                  <div
                    key={day}
                    className="py-1 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A8278]"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map((cell) => {
                  if (!cell.date) {
                    return <div key={cell.key} className="aspect-square" />;
                  }

                  const date = cell.date;
                  const disabled = isBeforeDay(date, today);
                  const selectedEdge = isRangeEdge(date);
                  const inRange = isInRange(date);
                  const isStart = isSameDay(date, value.start);
                  const isEnd = isSameDay(date, previewEnd);
                  const isToday = isSameDay(date, today);
                  const isWeekend =
                    mondayFirstWeekday(date) >= 5 && !selectedEdge && !inRange;

                  return (
                    <button
                      key={cell.key}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleSelect(date)}
                      onMouseEnter={() => {
                        if (selectingEnd && !disabled) setHoverDate(date);
                      }}
                      onMouseLeave={() => setHoverDate(null)}
                      className={cn(
                        "relative flex aspect-square items-center justify-center rounded-xl font-sans text-[13px] transition-all duration-200 md:text-sm",
                        disabled && "cursor-not-allowed text-[#C4BBB0]/70",
                        !disabled &&
                          !selectedEdge &&
                          !inRange &&
                          "text-[#2A2A24] hover:bg-[#E8ECDF]/80",
                        isWeekend && !disabled && "text-[#8A6A4A]",
                        inRange &&
                          !selectedEdge &&
                          "bg-[#D5E2B8] text-[#2F3B22]",
                        selectedEdge &&
                          "bg-gradient-to-b from-[#6B8244] to-[#5C6B3A] font-semibold text-white shadow-[0_6px_16px_rgba(92,107,58,0.28)]",
                        isStart &&
                          value.end &&
                          "rounded-r-md",
                        isEnd &&
                          value.start &&
                          !isSameDay(value.start, previewEnd) &&
                          "rounded-l-md",
                        isToday &&
                          !selectedEdge &&
                          "ring-1 ring-inset ring-[#5c6b3a]/40"
                      )}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-[#E8E0D4]/90 pt-4">
                <Typography
                  variant="caption"
                  className="text-center text-[12px] tracking-wide text-[#6B635A]"
                >
                  {hint}
                </Typography>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={handleClear}
                    className="flex-1 border border-[#E8E0D4] bg-white/50 text-[#6B635A] hover:bg-white"
                  >
                    {labels.clear}
                  </Button>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={handleApply}
                    className={cn(
                      "flex-1 border-0 bg-gradient-to-b from-[#c86648] to-[#a8482c] font-semibold text-white shadow-[0_6px_18px_rgba(188,84,52,0.28)] hover:from-[#d07050] hover:to-[#b04e30] hover:text-white",
                      !complete && "pointer-events-none opacity-45"
                    )}
                  >
                    {labels.apply}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
