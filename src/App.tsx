import { useMemo, useState } from "react";
import ClassSelector from "./components/ClassSelector";
import WeekendSchedule from "./components/WeekendSchedule";
import { scheduleData } from "./data/scheduleData";
import type { ClassGroup } from "./types";
import { filterAllDaysByClass } from "./utils/filterSchedule";
import { groupIntoWeekends } from "./utils/groupWeekends";

function LegendItem({
  swatch,
  label,
}: {
  swatch: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
      <span className={`h-2 w-2 shrink-0 rounded-sm ${swatch}`} aria-hidden />
      {label}
    </span>
  );
}

export default function App() {
  const [selectedClass, setSelectedClass] = useState<ClassGroup>("A");

  const weekends = useMemo(() => {
    const filtered = filterAllDaysByClass(scheduleData, selectedClass);
    return groupIntoWeekends(filtered);
  }, [selectedClass]);

  const legendItems =
    selectedClass === "A"
      ? "\u8ca1\u52d9 A \u00b7 \u884c\u92b7\uff08\u4e0d\u5206\u73ed\uff09 \u00b7 \u9023\u5047"
      : "\u8ca1\u52d9 B \u00b7 \u884c\u92b7\uff08\u4e0d\u5206\u73ed\uff09 \u00b7 \u9023\u5047";

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="border-b border-emerald-950/80 bg-zinc-900/95">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
          <p className="text-xs font-medium tracking-wide text-emerald-600/90 sm:text-sm">
            National Taiwan University
          </p>
          <h1 className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
            {"\u53f0\u5927 PMBA \u8ab2\u8868"}
          </h1>
          <p className="mt-1 text-xs text-[#9CA3AF] sm:text-sm">
            {"\u9031\u672b\u96d9\u6b04\u5c0d\u7167 \u00b7 \u6df1\u8272\u6a21\u5f0f"}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
        <section className="mb-4 rounded-lg border border-zinc-700/70 bg-zinc-800/60 px-3 py-3 sm:px-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white">
                {"\u9078\u64c7\u73ed\u5225"}
              </h2>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">{legendItems}</p>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                <LegendItem
                  swatch="bg-red-900/80 ring-1 ring-red-800/60"
                  label={"\u9023\u5047\uff0f\u7279\u6b8a"}
                />
                <LegendItem
                  swatch="bg-amber-500"
                  label={"\u7af9\u5317\u4e0a\u8ab2"}
                />
                <LegendItem
                  swatch="bg-amber-900/50 ring-1 ring-amber-800/40"
                  label={"\u4e0d\u5206\u73ed"}
                />
              </div>
            </div>
            <ClassSelector
              value={selectedClass}
              onChange={setSelectedClass}
            />
          </div>
        </section>

        <section aria-live="polite">
          <WeekendSchedule weekends={weekends} />
        </section>

        <footer className="mt-6 border-t border-zinc-800 pt-3 text-center text-[11px] text-zinc-500">
          {"\u8ab2\u7a0b\u8cc7\u8a0a\u4ee5\u5b98\u65b9\u516c\u544a\u70ba\u6e96"}
        </footer>
      </main>
    </div>
  );
}
