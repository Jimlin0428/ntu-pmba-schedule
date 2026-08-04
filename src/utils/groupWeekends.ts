import type { ScheduleDay, Weekend } from "../types";

/**
 * 將篩選後的 ScheduleDay[] 依週末（週六+週日）進行分組。
 * 如果某個週末只有其中一天有課，另一天會補上空的 ScheduleDay 結構以保持雙欄對齊。
 */
export function groupIntoWeekends(days: ScheduleDay[]): Weekend[] {
  const map = new Map<string, { saturday?: ScheduleDay; sunday?: ScheduleDay }>();

  days.forEach((day) => {
    // 假設 date 格式為 "6月27日" 或 "10月4日" 等
    // 這裡用簡易邏輯群組，如果已經有對應的 weekend key 就放進去
    const key = day.date; 

    if (!map.has(key)) {
      map.set(key, {});
    }

    const current = map.get(key)!;
    if (day.day === "Sat") {
      current.saturday = day;
    } else if (day.day === "Sun") {
      current.sunday = day;
    }
  });

  // 整理成 Weekend 陣列
  const weekends: Weekend[] = [];
  
  // 依原始日期順序組合
  days.forEach((day) => {
    // 透過比對確保不重複加入已處理的週末
    const existing = map.get(day.date);
    if (existing) {
      weekends.push({
        saturday: existing.saturday || {
          date: day.date,
          day: "Sat",
          grade: day.grade,
          semester: day.semester,
          courses: [],
        },
        sunday: existing.sunday || {
          date: day.date,
          day: "Sun",
          grade: day.grade,
          semester: day.semester,
          courses: [],
        },
      });
      map.delete(day.date);
    }
  });

  return weekends;
}
