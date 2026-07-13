import RegistrationChecklist from "./components/RegistrationChecklist";
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
  // 1. 將預設初始狀態設定為最新的組合型別 "PMBA_A"
  const [selectedClass, setSelectedClass] = useState<ClassGroup>("PMBA_A");

  const weekends = useMemo(() => {
    const filtered = filterAllDaysByClass(scheduleData, selectedClass);
    return groupIntoWeekends(filtered);
  }, [selectedClass]);

  // 2. 讓下方的小文字提示根據切換的學程與班別動態調整（直接使用清晰的中文）
  const legendItems = useMemo(() => {
    if (selectedClass.startsWith("PMBA")) {
      return selectedClass === "PMBA_A" 
        ? "財務 A · 行銷（不分班） · 連假" 
        : "財務 B · 行銷（不分班） · 連假";
    }
    if (selectedClass.startsWith("PMLBA")) {
      return selectedClass === "PMLBA_A"
        ? "財務 A · 民刑法專題 · 連假"
        : "財務 B · 民刑法專題 · 連假";
    }
    if (selectedClass.startsWith("PMBM")) {
      return selectedClass === "PMBM_A"
        ? "財務 A · 行銷（不分班） · 連假"
        : "財務 B · 行銷（不分班） · 連假";
    }
    return "";
  }, [selectedClass]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="border-b border-emerald-950/80 bg-zinc-900/95">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
          <p className="text-xs font-medium tracking-wide text-emerald-600/90 sm:text-sm">
            National Taiwan University
          </p>
          {/* 3. 將大標題由「台大 PMBA 課表」改為更包容全體的「台大 PM 課程行事曆」 */}
          <h1 className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
            台大 PM 課程行事曆
          </h1>
          <p className="mt-1 text-xs text-[#9CA3AF] sm:text-sm">
            週末雙欄對照 · 深色模式
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
        <section className="mb-4 rounded-lg border border-zinc-700/70 bg-zinc-800/60 px-3 py-3 sm:px-4">
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
        </section>

        <section aria-live="polite">
          <RegistrationChecklist />
          <WeekendSchedule weekends={weekends} />
        </section>

        <footer className="mt-6 border-t border-zinc-800 pt-3 text-center text-[11px] text-zinc-500">
          課程資訊以官方公告為準
        </footer>
      </main>
    </div>
  );
}
