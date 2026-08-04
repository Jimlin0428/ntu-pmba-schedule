import type { ClassGroup, Course, ScheduleDay, Grade, Semester } from "../types";

export function courseMatchesClass(
  course: Course,
  selectedClass: ClassGroup,
): boolean {
  // 1. 放假、連假或標示全體 (ALL / all)，大家都看得到
  if (
    course.isSpecial ||
    course.classType === "ALL" ||
    course.classType === "all" ||
    course.name.includes("連假") ||
    course.name.includes("放假")
  ) {
    return true;
  }

  // 解析當前選中的是哪個學程、哪一個班（例如選 "PMBA_A" 會拆出 "PMBA" 與 "A"）
  const [targetProgram, targetClass] = selectedClass.split("_");

  // 2. 財務管理或策略管理：依據 A 班 / B 班 進行篩選
  if (course.name.includes("財務管理") || course.name.includes("策略管理")) {
    return course.classType === targetClass;
  }

  // 3. 行銷管理：PMBA 和 PMBM 全體同學都要上 (不分 A/B 班都顯示)
  if (course.name.includes("行銷管理")) {
    return targetProgram === "PMBA" || targetProgram === "PMBM";
  }

  // 4. 通用比對：檢查課程的 classType 是否匹配學程 (PMBA/PMLBA/PMBM) 或 班別 (A/B)
  if (course.classType === targetProgram || course.classType === targetClass) {
    return true;
  }

  return false;
}

/** 依班別過濾當日課程 */
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

/** 依班別、年級、學期篩選所有日期 (帶預設值，完全相容舊寫法) */
export function filterAllDaysByClass(
  days: ScheduleDay[],
  selectedClass: ClassGroup,
  selectedGrade: Grade = "115",
  selectedSemester: Semester = "1150",
): ScheduleDay[] {
  return days
    .filter((day) => {
      // 進行年級與學期比對，如果資料缺少該欄位則自動通過
      const matchGrade = day.grade ? day.grade === selectedGrade : true;
      const matchSemester = day.semester ? day.semester === selectedSemester : true;
      return matchGrade && matchSemester;
    })
    .map((day) => filterDayByClass(day, selectedClass))
    .filter((day) => day.courses.length > 0);
}
