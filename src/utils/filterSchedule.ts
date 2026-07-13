import type { ClassGroup, Course, ScheduleDay } from "../types";

export function courseMatchesClass(
  course: Course,
  selectedClass: ClassGroup,
): boolean {
  // 1. 如果是放假或連假，大家都看得到
  if (course.name.includes("連假") || course.name.includes("放假")) {
    return true;
  }

  // 解析當前選中的是哪個學程、哪一個班（例如選 "PMBA_A" 會拆出 "PMBA" 與 "A"）
  const [targetProgram, targetClass] = selectedClass.split("_");

  // 2. 財務管理：檢查 classType 與當前選取的班別 (A或B) 是否一致
  if (course.name.includes("財務管理")) {
    return course.classType === targetClass;
  }

  // 3. 行銷管理：PMBA 和 PMBM 全體同學都要上 (不分 A/B 班都顯示)
  if (course.name.includes("行銷管理")) {
    return targetProgram === "PMBA" || targetProgram === "PMBM";
  }

  // 4. 企業相關民刑法專題：PMLBA 專屬要上
  if (course.name.includes("民刑法專題")) {
    return targetProgram === "PMLBA";
  }

  return false;
}

/** 依班別篩選當日課程 */
export function filterDayByClass(
  day: ScheduleDay,
  selectedClass: ClassGroup,
): ScheduleDay {
  return {
    ...day,
    courses: day.courses.filter((course) =>
      courseMatchesClass(course, selectedClass),
    ),
  };
}

export function filterAllDaysByClass(
  days: ScheduleDay[],
  selectedClass: ClassGroup,
): ScheduleDay[] {
  return days
    .map((day) => filterDayByClass(day, selectedClass))
    // 額外過濾掉篩選後當天完全沒有課的日子，畫面才不會留下一堆空白卡片
    .filter((day) => day.courses.length > 0);
}
