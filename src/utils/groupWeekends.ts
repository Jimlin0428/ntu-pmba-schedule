import type { ScheduleDay, Weekend } from "../types";

// 將 "8月15日" 轉成可比對的月份與日期數字
function parseMonthDay(dateStr: string): { month: number; day: number } | null {
  const match = dateStr.match(/(\d+)月(\d+)日/);
  if (!match) return null;
  return {
    month: parseInt(match[1], 10),
    day: parseInt(match[2], 10),
  };
}

// 判斷週日是否為週六的「隔天」
function isNextDay(satStr: string, sunStr: string): boolean {
  const sat = parseMonthDay(satStr);
  const sun = parseMonthDay(sunStr);
  if (!sat || !sun) return false;

  // 同一個月，週日日期比週六大 1 天
  if (sat.month === sun.month && sun.day === sat.day + 1) {
    return true;
  }

  // 跨月處理 (例如 8/31 隔天是 9/1，或是 7/31 隔天是 8/1)
  if (sun.month === sat.month + 1 && sun.day === 1) {
    return true;
  }

  return false;
}

/**
 * 精準依照「真實日曆隔天關係」組合週末，絕不跨週混湊！
 */
export function groupIntoWeekends(days: ScheduleDay[]): Weekend[] {
  const result: Weekend[] = [];
  const processedIndices = new Set<number>();

  for (let i = 0; i < days.length; i++) {
    if (processedIndices.has(i)) continue;

    const currentDay = days[i];

    if (currentDay.day === "Sat") {
      const nextDay = days[i + 1];

      // 嚴格檢查下一筆資料是否為週日，且日期恰好是隔天！
      if (nextDay && nextDay.day === "Sun" && isNextDay(currentDay.date, nextDay.date)) {
        result.push({
          saturday: currentDay,
          sunday: nextDay,
        });
        processedIndices.add(i);
        processedIndices.add(i + 1);
      } else {
        // 隔天沒課（或沒有符合條件的課），週日顯示留空
        result.push({
          saturday: currentDay,
          sunday: undefined,
        });
        processedIndices.add(i);
      }
    } else if (currentDay.day === "Sun") {
      // 獨立出現的週日（前一天週六沒課）
      result.push({
        saturday: undefined,
        sunday: currentDay,
      });
      processedIndices.add(i);
    }
  }

  return result;
}
