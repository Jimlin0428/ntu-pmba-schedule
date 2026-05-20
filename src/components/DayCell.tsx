import type { ScheduleDay } from "../types";
import CourseCard from "./CourseCard";

const DAY_LABEL: Record<string, string> = {
  Sat: "\u9031\u516d",
  Sun: "\u9031\u65e5",
};

type Props = {
  day: ScheduleDay;
  compactHeader?: boolean;
};

export default function DayCell({ day, compactHeader }: Props) {
  const hasCourses = day.courses.length > 0;
  const isPlaceholder = day.date === "\u2014";

  return (
    <article className="flex min-h-0 flex-col">
      <header
        className={`mb-1.5 flex items-baseline gap-2 ${compactHeader ? "" : "lg:mb-2"}`}
      >
        <time
          className={`font-bold text-white ${compactHeader ? "text-sm" : "text-sm lg:text-base"}`}
        >
          {isPlaceholder ? "\u2014" : day.date}
        </time>
        {!isPlaceholder && (
          <span className="text-[11px] font-medium text-[#9CA3AF]">
            {DAY_LABEL[day.day] ?? day.day}
          </span>
        )}
      </header>

      {hasCourses ? (
        <div className="flex flex-col gap-1.5">
          {day.courses.map((course, index) => (
            <CourseCard
              key={`${course.name}-${course.classType}-${index}`}
              course={course}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[3.25rem] flex-1 items-center justify-center rounded border border-dashed border-zinc-600/50 bg-zinc-800/20 px-2 py-2">
          <span className="text-[11px] text-zinc-500">
            {"\u7121\u8ab2\u7a0b"}
          </span>
        </div>
      )}
    </article>
  );
}
