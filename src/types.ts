export type ClassGroup = "A" | "B";

export type Course = {
  name: string;
  teacher: string;
  hours: number;
  classroom: string;
  classType: "A" | "B" | "all";
  isSpecial?: boolean;
};

export type ScheduleDay = {
  date: string;
  day: string;
  courses: Course[];
};
