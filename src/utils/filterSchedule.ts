import type { ClassGroup, Course, ScheduleDay, Grade, Semester } from "../types";

// 將 "10月17日" 解析為可比較的數值，並處理 1151 學期的 1 月（隔年）跨年邏輯
function getDateWeight(dateStr: string, semester: Semester): number {
  const match = dateStr.match(/(\d+)月(\d+)日/);
  if (!match) return 0;

  let month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);

  if (semester === "1151" && month === 1) {
    month = 13;
  }

  return month * 100 + day;
}

export function courseMatchesClass(
  course: Course,
  selectedClass: ClassGroup,
): boolean {
  const [targetProgram, targetClass] = selectedClass.split("_");

  // 🚨【最高優先級 1】所有放假、連假、國定假日、選舉，不論年級與班別，直接放行顯示！
  if (
    course.isSpecial ||
    course.isHoliday ||
    course.classType === "ALL" ||
    course.classType === "all" ||
    course.name.includes("連假") ||
    course.name.includes("放假") ||
    course.name.includes("假") ||
    course.name.includes("選舉")
  ) {
    return true;
  }

  // 2. 行銷管理：只有 PMBA 與 PMBM 可以看，PMLBA 強制剔除！
  if (course.name.includes("行銷管理")) {
    return targetProgram === "PMBA" || targetProgram === "PMBM";
  }

  // 3. 法律/民刑法/行政法專題：只有 PMLBA 可以看，其他學程剔除！
  if (
    course.name.includes("民刑法") ||
    course.name.includes("行政法") ||
    course.name.includes("法務專題") ||
    (course.name.includes("專題") && course.classType === "PMLBA")
  ) {
    return targetProgram === "PMLBA";
  }

  // 4. 財務管理與策略管理：依據 A 班 / B 班 進行篩選
  if (course.name.includes("財務管理") || course.name.includes("策略管理")) {
    return course.classType === targetClass;
  }

  // 5. 比對學程 (PMBA, PMBM, PMLBA)
  if (course.classType === targetProgram) {
    return true;
  }

  // 6. 比對班別 (A, B)
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

/** 依班別、年級、學期篩選所有日期並依照「時間先後」精準排序 */
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
    .filter((day) => day.courses.length > 0)
    .sort((a, b) => {
      const weightA = getDateWeight(a.date, selectedSemester);
      const weightB = getDateWeight(b.date, selectedSemester);
      return weightA - weightB;
    });
}
