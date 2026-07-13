export type ClassGroup = "PMBA_A" | "PMBA_B" | "PMLBA_A" | "PMLBA_B" | "PMBM_A" | "PMBM_B";

export type Course = {
  name: string;
  teacher: string;
  hours: number;
  classroom: string;
  // 這裡把 classType 擴充，允許接收 "A"、"B"、"ALL" 和 "PMLBA"
  classType: "A" | "B" | "ALL" | "PMLBA" | "all"; 
  isSpecial?: boolean;
};

export type ScheduleDay = {
  date: string;
  day: string;
  courses: Course[];
};
