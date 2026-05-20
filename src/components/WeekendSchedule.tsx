import type { WeekendRow } from "../utils/groupWeekends";
import DayCell from "./DayCell";

function weekendRangeLabel(row: WeekendRow): string {
  const sat = row.saturday.date;
  const sun = row.sunday.date;
  if (sat !== "\u2014" && sun !== "\u2014") return `${sat} \u2013 ${sun}`;
  if (sat !== "\u2014") return sat;
  return sun;
}

type Props = {
  weekends: WeekendRow[];
};

export default function WeekendSchedule({ weekends }: Props) {
  if (weekends.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-600/60 bg-zinc-800/30 px-4 py-10 text-center text-sm text-[#9CA3AF]">
        {"\u6b64\u73ed\u7d1a\u76ee\u524d\u6c92\u6709\u8ab2\u7a0b\u8cc7\u8a0a"}
      </p>
    );
  }

  return (
    <div>
      {/* Desktop: \u96d9\u6b04\u9031\u672b\u5c0d\u7167 */}
      <div className="hidden lg:block">
        <div className="mb-3 grid grid-cols-2 gap-4 border-b border-zinc-700/80 pb-2">
          <p className="text-center text-xs font-semibold tracking-wide text-[#9CA3AF]">
            {"\u661f\u671f\u516d"}
          </p>
          <p className="text-center text-xs font-semibold tracking-wide text-[#9CA3AF]">
            {"\u661f\u671f\u65e5"}
          </p>
        </div>
        <ul className="space-y-3">
          {weekends.map((row) => (
            <li
              key={row.key}
              className="grid grid-cols-2 gap-4 rounded-lg border border-zinc-700/60 bg-zinc-800/40 p-3"
            >
              <DayCell day={row.saturday} compactHeader />
              <DayCell day={row.sunday} compactHeader />
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: \u55ae\u6b04\u6642\u9593\u8ef8 */}
      <ul className="space-y-4 lg:hidden">
        {weekends.map((row) => (
          <li
            key={row.key}
            className="overflow-hidden rounded-lg border border-zinc-700/60 bg-zinc-800/50"
          >
            <div className="border-b border-zinc-700/50 px-3 py-2">
              <p className="text-[11px] font-medium text-[#9CA3AF]">
                {weekendRangeLabel(row)}
              </p>
            </div>
            <div className="space-y-3 p-3">
              <DayCell day={row.saturday} compactHeader />
              <div className="border-t border-zinc-700/40 pt-3">
                <DayCell day={row.sunday} compactHeader />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
