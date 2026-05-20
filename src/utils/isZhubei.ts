import type { Course } from "../types";

export function isZhubeiClassroom(course: Course): boolean {
  return course.classroom.includes("\u7af9\u5317");
}
