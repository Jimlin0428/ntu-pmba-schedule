import type { ClassGroup, Course, ScheduleDay } from "../types";

export function courseMatchesClass(
  course: Course,
  selectedClass: ClassGroup,
): boolean {
  if (course.isSpecial || course.classType === "all") {
    return true;
  }
  return course.classType === selectedClass;
}

/** 依班別篩選當日課程，保留無課日期 */
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
  return days.map((day) => filterDayByClass(day, selectedClass));
}
