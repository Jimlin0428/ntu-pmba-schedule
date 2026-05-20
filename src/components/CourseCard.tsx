import type { Course } from "../types";
import { isZhubeiClassroom } from "../utils/isZhubei";

type Props = {
  course: Course;
};

export default function CourseCard({ course }: Props) {
  const isSpecial = course.isSpecial === true;
  const isShared = course.classType === "all";
  const isZhubei = isZhubeiClassroom(course);

  if (isSpecial) {
    return (
      <div className="rounded border border-red-900/50 bg-red-950/35 px-2 py-1.5">
        <p className="text-sm font-semibold leading-snug text-red-300/95">
          {course.name}
        </p>
        <p className="text-[10px] font-medium text-red-400/70">
          {"\u9023\u5047\uff0f\u7279\u6b8a"}
        </p>
      </div>
    );
  }

  const zhubeiAccent = isZhubei
    ? "border-l-[3px] border-l-amber-500 bg-amber-950/25"
    : "border-l-[3px] border-l-transparent";

  const sharedStyle = isShared
    ? "border-amber-900/40 bg-amber-950/15"
    : "border-zinc-700/80 bg-zinc-800/80";

  const meta = [
    course.teacher && `\u6559\u5e2b ${course.teacher}`,
    course.classroom && course.classroom,
  ]
    .filter(Boolean)
    .join(" \u00b7 ");

  return (
    <div
      className={`rounded border px-2 py-1.5 ${zhubeiAccent} ${sharedStyle}`}
    >
      <div className="flex items-start justify-between gap-1.5">
        <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-white">
          {course.name}
          {isShared && (
            <span className="ml-1.5 inline-block rounded bg-amber-900/50 px-1 py-px text-[10px] font-medium text-amber-200/90">
              {"\u4e0d\u5206\u73ed"}
            </span>
          )}
          {isZhubei && (
            <span className="ml-1.5 inline-block rounded bg-amber-600/25 px-1 py-px text-[10px] font-medium text-amber-300">
              {"\u7af9\u5317"}
            </span>
          )}
        </h3>
        {course.hours > 0 && (
          <span className="shrink-0 text-[11px] font-medium tabular-nums text-[#9CA3AF]">
            {course.hours}h
          </span>
        )}
      </div>
      {meta && (
        <p className="mt-0.5 truncate text-[11px] leading-tight text-[#9CA3AF]">
          {meta}
        </p>
      )}
    </div>
  );
}
