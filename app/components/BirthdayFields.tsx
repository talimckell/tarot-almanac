"use client";

import { useState } from "react";

// Explicit Month / Day / Year selects that compose a zero-padded YYYY-MM-DD value
// into a hidden input. This replaces the native <input type="date"> for birthday
// entry: that control renders unreliably in mobile in-app webviews (Gmail's
// in-app browser was showing a month/year-only picker with no day, so a birthday
// could never be completed). Three plain selects render identically everywhere.
// The composed string matches BIRTHDAY_RE / parseDateSlug exactly; the server
// still re-validates age and calendar-validity, so this is purely the input layer.

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function splitYMD(value: string): { y: string; m: string; d: string } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  return match ? { y: match[1], m: match[2], d: match[3] } : { y: "", m: "", d: "" };
}

// Real day count for the chosen month, so Feb 30 / Apr 31 can't be picked. Falls
// back to a leap year (2000) when the year isn't set yet, so Feb 29 stays offered.
function daysInMonth(m: string, y: string): number {
  if (!m) return 31;
  return new Date(y ? Number(y) : 2000, Number(m), 0).getDate();
}

export default function BirthdayFields({
  name,
  id,
  defaultValue = "",
  required = false,
  selectClassName = "",
  className = "",
}: {
  name: string;
  id?: string;
  defaultValue?: string;
  required?: boolean;
  selectClassName?: string;
  className?: string;
}) {
  const init = splitYMD(defaultValue);
  const [m, setM] = useState(init.m);
  const [d, setD] = useState(init.d);
  const [y, setY] = useState(init.y);

  const composed = m && d && y ? `${y}-${m}-${d}` : "";

  const thisYear = new Date().getFullYear();
  const maxDay = daysInMonth(m, y);

  // If a shorter month (or non-leap year) makes the chosen day invalid, drop it.
  function reconcileDay(nextM: string, nextY: string) {
    if (d && Number(d) > daysInMonth(nextM, nextY)) setD("");
  }

  const selectStyle = { flex: 1, minWidth: 0 } as const;

  return (
    <div className={`birthday-fields ${className}`.trim()} style={{ display: "flex", gap: 8 }}>
      <select
        id={id}
        aria-label="Birth month"
        className={selectClassName}
        style={selectStyle}
        required={required}
        value={m}
        onChange={(e) => {
          setM(e.target.value);
          reconcileDay(e.target.value, y);
        }}
      >
        <option value="">Month</option>
        {MONTHS.map((label, i) => (
          <option key={label} value={pad(i + 1)}>{label}</option>
        ))}
      </select>
      <select
        aria-label="Birth day"
        className={selectClassName}
        style={selectStyle}
        required={required}
        value={d}
        onChange={(e) => setD(e.target.value)}
      >
        <option value="">Day</option>
        {Array.from({ length: maxDay }, (_, i) => i + 1).map((day) => (
          <option key={day} value={pad(day)}>{day}</option>
        ))}
      </select>
      <select
        aria-label="Birth year"
        className={selectClassName}
        style={selectStyle}
        required={required}
        value={y}
        onChange={(e) => {
          setY(e.target.value);
          reconcileDay(m, e.target.value);
        }}
      >
        <option value="">Year</option>
        {Array.from({ length: 121 }, (_, i) => thisYear - i).map((yr) => (
          <option key={yr} value={String(yr)}>{yr}</option>
        ))}
      </select>
      <input type="hidden" name={name} value={composed} />
    </div>
  );
}
