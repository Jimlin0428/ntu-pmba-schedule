import React from "react";
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
  
  // 📅 核心功能：動態將目前的 weekends 資料打包下載為 .ics 檔案
  const handleDownloadICS = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // 阻斷預設行為，防止行動端重複觸發
    
    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//NTU PMBA//Schedule//ZH",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:台大115級PMBA課表",
      "X-WR-TIMEZONE:Asia/Taipei"
    ];

    // 遍歷目前的週六日資料
    weekends.forEach((row) => {
      const days = [row.saturday, row.sunday];
      
      days.forEach((day) => {
        // 排除無課程、連假或空檔的日子，只抓有真實課程的 row
        if (!day || day.date === "\u2014" || !day.courses || day.courses.length === 0) return;

        day.courses.forEach((course) => {
          // 排除無課名或特殊放假字眼
          if (!course.name || course.name.includes("連假") || course.name.includes("放假")) return;

          // 解析日期：將 "6月27日" 這種格式轉換成 2026 年的日曆專用八碼格式 20260627
          const match = day.date.match(/(\d+)月(\d+)日/);
          if (!match) return;
          const month = match[1].padStart(2, "0");
          const dateStr = match[2].padStart(2, "0");
          const cleanDate = `2026${month}${dateStr}`;

          // 判斷下課時間（時數為 6 小時的課到 16:00，其餘預設 17:00）
          const endTime = course.hours === 6 ? "160000" : "170000";
          
          // 組合教授名稱
          const teacherInfo = course.teacher ? ` (${course.teacher})` : "";

          icsContent.push("BEGIN:VEVENT");
          icsContent.push(`SUMMARY:${course.name}${teacherInfo}`);
          icsContent.push(`DTSTART;TZID=Asia/Taipei:${cleanDate}T090000`);
          icsContent.push(`DTEND;TZID=Asia/Taipei:${cleanDate}T${endTime}`);
          if (course.classroom) {
            icsContent.push(`LOCATION:${course.classroom}`);
          }
          icsContent.push("END:VEVENT");
        });
      });
    });

    icsContent.push("END:VCALENDAR");

    // 轉為 Blob 並觸發網頁下載
    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "NTU_PMBA_Schedule.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (weekends.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-600/60 bg-zinc-800/30 px-4 py-10 text-center text-sm text-[#9CA3AF]">
        {"\u6b64\u73ed\u7d1a\u76ee\u524d\u6c92\u6709\u8ab2\u7a0b\u8cc7\u8a0a"}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* 🚀 下載日曆功能列：相容 LINE 瀏覽器的標準 button 元素，同時綁定 onClick 與 onTouchEnd */}
      <div className="flex justify-end px-1">
        <button
          type="button"
          onClick={handleDownloadICS}
          onTouchEnd={handleDownloadICS}
          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow transition-all flex items-center justify-center gap-1.5 border border-emerald-500/30"
        >
          📅 匯入此班級 Google 日曆 (.ics)
        </button>
      </div>

      {/* Desktop: 雙欄週末對照 */}
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

      {/* Mobile: 單欄時間軸 */}
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
                <div className="pt-1">
                  <DayCell day={row.sunday} compactHeader />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}