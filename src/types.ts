export type Grade = "114" | "115";
export type Semester = "1150" | "1151";

export type ClassGroup = 
  | "PMBA_A" | "PMBA_B" 
  | "PMLBA_A" | "PMLBA_B" 
  | "PMBM_A" | "PMBM_B";

export type Course = {
  name: string;
  teacher: string;
  hours: number;
  classroom: string;
  classType: "A" | "B" | "ALL" | "PMLBA" | "all";
  isSpecial?: boolean;
};

export type ScheduleDay = {
  date: string;
  day: string;
  grade: Grade;          // 新增：114 或 115
  semester: Semester;    // 新增：1150 或 1151
  courses: Course[];
};
