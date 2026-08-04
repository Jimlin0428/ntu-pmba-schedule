import type { ScheduleDay, Weekend } from "../types";

/**
 * 將篩選後的 ScheduleDay[] 正確依「週末（週六與相鄰週日）」進行分組。
 */
export function groupIntoWeekends(days: ScheduleDay[]): Weekend[] {
  const result: Weekend[] = [];
  const processedIndices = new Set<number>();

  for (let i = 0; i < days.length; i++) {
    if (processedIndices.has(i)) continue;

    const currentDay = days[i];

    if (currentDay.day === "Sat") {
      // 檢查下一筆是否為對應的週日
      const nextDay = days[i + 1];
      if (nextDay && nextDay.day === "Sun") {
        result.push({
          saturday: currentDay,
          sunday: nextDay,
        });
        processedIndices.add(i);
        processedIndices.add(i + 1);
      } else {
        // 只有週六，無對應週日
        result.push({
          saturday: currentDay,
          sunday: undefined,
        });
        processedIndices.add(i);
      }
    } else if (currentDay.day === "Sun") {
      // 獨立出現的週日（前一天無週六）
      result.push({
        saturday: undefined,
        sunday: currentDay,
      });
      processedIndices.add(i);
    }
  }

  return result;
}
