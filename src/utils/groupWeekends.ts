import type { ScheduleDay } from "../types";

export type WeekendRow = {
  key: string;
  saturday: ScheduleDay;
  sunday: ScheduleDay;
};

/** 將連續的週六、週日配成週末列（與原始課表順序一致） */
export function groupIntoWeekends(days: ScheduleDay[]): WeekendRow[] {
  const rows: WeekendRow[] = [];
  let i = 0;

  while (i < days.length) {
    const current = days[i];

    if (current.day === "Sat") {
      const next = days[i + 1];
      if (next?.day === "Sun") {
        rows.push({
          key: `${current.date}-${next.date}`,
          saturday: current,
          sunday: next,
        });
        i += 2;
        continue;
      }
      rows.push({
        key: current.date,
        saturday: current,
        sunday: { date: "—", day: "Sun", courses: [] },
      });
      i += 1;
      continue;
    }

    if (current.day === "Sun") {
      rows.push({
        key: current.date,
        saturday: { date: "—", day: "Sat", courses: [] },
        sunday: current,
      });
    }
    i += 1;
  }

  return rows;
}
