import type { ClassGroup, Course, ScheduleDay, Grade, Semester } from "../types";

export function courseMatchesClass(
  course: Course,
  selectedClass: ClassGroup,
): boolean {
  // 解析當前選中的是哪個學程與班別（例如 "PMBM_A" 會拆出 targetProgram = "PMBM", targetClass = "A"）
  const [targetProgram, targetClass] = selectedClass.split("_");

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

  // 2. 特殊課程規則：行銷管理（只有 PMBA 與 PMBM 上，PMLBA 排除）
  if (course.name.includes("行銷管理")) {
    return targetProgram === "PMBA" || targetProgram === "PMBM";
  }

  // 3. 特殊課程規則：法律/民刑法/行政法專題（只有 PMLBA 上）
  if (
    course.name.includes("民刑法") ||
    course.name.includes("行政法") ||
    course.classType === "PMLBA"
  ) {
    return targetProgram === "PMLBA";
  }

  // 4. 財務管理與策略管理：依據 A 班 / B 班 進行篩選
  if (course.name.includes("財務管理") || course.name.includes("策略管理")) {
    return course.classType === targetClass;
  }

  // 5. 學程專屬課程比對（如 classType 為 "PMBA", "PMBM", "PMLBA"）：
  // 直接精準比對是否符合當前選取的學程
  if (course.classType === targetProgram) {
    return true;
  }

  // 6. 班別比對（如 classType 為 "A" 或 "B"）
  if (course.classType === targetClass) {
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

/** 依班別、年級、學期篩選所有日期 */
export function filterAllDaysByClass(
  days: ScheduleDay[],
  selectedClass: ClassGroup,
  selectedGrade: Grade = "115",
  selectedSemester: Semester = "1150",
): ScheduleDay[] {
  return days
    .filter((day) => {
      const matchGrade = day.grade ? day.grade === selectedGrade : true;
      const matchSemester = day.semester ? day.semester === selectedSemester : true;
      return matchGrade && matchSemester;
    })
    .map((day) => filterDayByClass(day, selectedClass))
    .filter((day) => day.courses.length > 0);
}
