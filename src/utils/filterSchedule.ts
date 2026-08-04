import type { ClassGroup, Course, ScheduleDay, Grade, Semester } from "../types";

export function courseMatchesClass(
  course: Course,
  selectedClass: ClassGroup,
): boolean {
  // 1. 放假、連假或標示全體 classType === "ALL" / "all"，大家都看得到
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

  // 4. 通用比對：檢查課程的 classType 是否直接匹配當前學程 (如 "PMBA", "PMLBA", "PMBM")
  if (course.classType === targetProgram) {
    return true;
  }

  // 5. 特殊相容：例如 classType 為 "A" 或 "B" 的通用課程
  if (course.classType === targetClass) {
    return true;
  }

  return false;
}

/** 依年級、學期、班別篩選當日課程 */
export function filterDayByConditions(
  day: ScheduleDay,
  selectedGrade: Grade,
  selectedSemester: Semester,
  selectedClass: ClassGroup,
): ScheduleDay | null {
  // 1. 先檢查當天是否符合選擇的 年級 與 學期
  if (day.grade !== selectedGrade || day.semester !== selectedSemester) {
    return null;
  }

  // 2. 過濾當天符合該班別/學程的課程
  const filteredCourses = day.courses.filter((course) =>
    courseMatchesClass(course, selectedClass),
  );

  if (filteredCourses.length === 0) {
    return null;
  }

  return {
    ...day,
    courses: filteredCourses,
  };
}

export function filterAllDaysByClass(
  days: ScheduleDay[],
  selectedClass: ClassGroup,
  selectedGrade: Grade = "115",
  selectedSemester: Semester = "1150",
): ScheduleDay[] {
  return days
    .map((day) => filterDayByConditions(day, selectedGrade, selectedSemester, selectedClass))
    .filter((day): day is ScheduleDay => day !== null);
}
