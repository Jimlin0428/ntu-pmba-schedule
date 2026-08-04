import type { ClassGroup, Course, ScheduleDay, Grade, Semester } from "../types";

export function courseMatchesClass(
  course: Course,
  selectedClass: ClassGroup,
): boolean {
  if (
    course.isSpecial ||
    course.classType === "ALL" ||
    course.classType === "all" ||
    course.name.includes("連假") ||
    course.name.includes("放假")
  ) {
    return true;
  }

  const [targetProgram, targetClass] = selectedClass.split("_");

  if (course.name.includes("財務管理") || course.name.includes("策略管理")) {
    return course.classType === targetClass;
  }

  if (course.name.includes("行銷管理")) {
    return targetProgram === "PMBA" || targetProgram === "PMBM";
  }

  if (course.classType === targetProgram || course.classType === targetClass) {
    return true;
  }

  return false;
}

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

/** 依班別、年級、學期篩選所有日期 (帶有預設值以完全相容舊寫法) */
export function filterAllDaysByClass(
  days: ScheduleDay[],
  selectedClass: ClassGroup,
  selectedGrade: Grade = "115",
  selectedSemester: Semester = "1150",
): ScheduleDay[] {
  return days
    .filter((day) => {
      // 如果 day 資料有 grade 與 semester 屬性，就進行比對
      const matchGrade = day.grade ? day.grade === selectedGrade : true;
      const matchSemester = day.semester ? day.semester === selectedSemester : true;
      return matchGrade && matchSemester;
    })
    .map((day) => filterDayByClass(day, selectedClass))
    .filter((day) => day.courses.length > 0);
}
