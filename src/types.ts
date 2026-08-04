export type Grade = "114" | "115";
export type Semester = "1150" | "1151";

export type ClassGroup =
  | "PMBA_A"
  | "PMBA_B"
  | "PMLBA_A"
  | "PMLBA_B"
  | "PMBM_A"
  | "PMBM_B";

export type Course = {
  name: string;
  teacher: string;
  hours: number;
  classroom: string;
  // 將 classType 改為 string，以相容 "PMBA"、"PMBM"、"PMLBA"、"A"、"B"、"ALL" 等所有班別標籤
  classType: string;
  isSpecial?: boolean;
  isHoliday?: boolean;
};

export type ScheduleDay = {
  date: string;
  day: string;
  grade: Grade;          // 114 或 115
  semester: Semester;    // 1150 或 1151
  courses: Course[];
};

export type Weekend = {
  saturday?: ScheduleDay;
  sunday?: ScheduleDay;
};
