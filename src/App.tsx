import { useMemo, useState } from "react";
import ClassSelector from "./components/ClassSelector";
import WeekendSchedule from "./components/WeekendSchedule";
import { scheduleData } from "./data/scheduleData";
import type { ClassGroup, Grade, Semester } from "./types";
import { filterAllDaysByClass } from "./utils/filterSchedule";
import { groupIntoWeekends } from "./utils/groupWeekends";
import { downloadICS } from "./utils/exportCalendar";

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
  const [selectedGrade, setSelectedGrade] = useState<Grade>("115");
  const [selectedSemester, setSelectedSemester] = useState<Semester>("1150");
  const [selectedClass, setSelectedClass] = useState<ClassGroup>("PMBA_A");

  const weekends = useMemo(() => {
    const filtered = filterAllDaysByClass(
      scheduleData,
      selectedClass,
      selectedGrade,
      selectedSemester,
    );
    return groupIntoWeekends(filtered);
  }, [selectedClass, selectedGrade, selectedSemester]);

  const legendItems = useMemo(() => {
    if (selectedClass.startsWith("PMBA")) {
      return selectedClass === "PMBA_A"
        ? "財務/策略 A · 行銷/組織（不分班） · 連假"
        : "財務/策略 B · 行銷/組織（不分班） · 連假";
    }
    if (selectedClass.startsWith("PMLBA")) {
      return selectedClass === "PMLBA_A"
        ? "財務/策略 A · 法律專題 · 連假"
        : "財務/策略 B · 法律專題 · 連假";
    }
    if (selectedClass.startsWith("PMBM")) {
      return selectedClass === "PMBM_A"
        ? "財務/策略 A · 生醫專題 · 連假"
        : "財務/策略 B · 生醫專題 · 連假";
    }
    return "";
  }, [selectedClass]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="border-b border-emerald-950/80 bg-zinc-900/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-emerald-600/90 sm:text-sm">
              National Taiwan University
            </p>
            <h1 className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
              台大 PM 課程行事曆
            </h1>
            <p className="mt-1 text-xs text-[#9CA3AF] sm:text-sm">
              週末雙欄對照 · 深色模式
            </p>
          </div>

          {/* 右上角快捷下載行事曆按鈕 */}
          <button
            type="button"
            onClick={() => downloadICS(weekends, selectedClass)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-500 active:scale-95"
          >
            📅 下載行事曆 (.ics)
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
        {/* 控制面板卡片 */}
        <section className="mb-4 rounded-lg border border-zinc-700/70 bg-zinc-800/60 p-3 sm:p-4">
          <div className="flex flex-col gap-4">
            
            {/* 第一列：年級與學期切換鍵 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-700/60 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400">屆別：</span>
                {(["115", "114"] as Grade[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrade(g)}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                      selectedGrade === g
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-700/80 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    {g} 級
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400">學期：</span>
                {(["1150", "1151"] as Semester[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSemester(s)}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                      selectedSemester === s
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-700/80 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    {s} 學期
                  </button>
                ))}
              </div>
            </div>

            {/* 第二列：班別 / 學程選擇鍵 */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">
                  選擇班別 / 學程
                </h2>
                <p className="mt-0.5 text-xs text-[#9CA3AF]">{legendItems}</p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  <LegendItem
                    swatch="bg-red-900/80 ring-1 ring-red-800/60"
                    label="連假／特殊"
                  />
                  <LegendItem
                    swatch="bg-amber-500"
                    label="竹北上課"
                  />
                  <LegendItem
                    swatch="bg-amber-900/50 ring-1 ring-amber-800/40"
                    label="不分班"
                  />
                </div>
              </div>
              <ClassSelector
                value={selectedClass}
                onChange={setSelectedClass}
              />
            </div>

          </div>
        </section>

        <section aria-live="polite">
          <WeekendSchedule weekends={weekends} />
        </section>

        <footer className="mt-6 border-t border-zinc-800 pt-3 text-center text-[11px] text-zinc-500">
          課程資訊以官方公告為準
        </footer>
      </main>
    </div>
  );
}
