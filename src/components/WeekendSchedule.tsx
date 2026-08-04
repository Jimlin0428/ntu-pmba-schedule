import type { Weekend, Course } from "../types";

function CourseCard({ course }: { course: Course }) {
  const isSpecial = course.isSpecial || course.isHoliday;

  return (
    <div
      className={`rounded-md border p-3 transition-colors ${
        isSpecial
          ? "border-red-900/60 bg-red-950/30 text-red-200"
          : "border-zinc-700/80 bg-zinc-800/80 hover:border-zinc-600"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-white">{course.name}</h4>
        {course.hours > 0 && (
          <span className="shrink-0 rounded bg-zinc-700/80 px-1.5 py-0.5 text-[10px] text-zinc-300">
            {course.hours}h
          </span>
        )}
      </div>

      {(course.teacher || course.classroom) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
          {course.teacher && <span>👨‍🏫 {course.teacher}</span>}
          {course.classroom && <span>📍 {course.classroom}</span>}
        </div>
      )}
    </div>
  );
}

export default function WeekendSchedule({
  weekends,
}: {
  weekends: Weekend[];
}) {
  if (weekends.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-zinc-700 p-8 text-center text-zinc-400">
        目前選取的條件下沒有排定課程
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {weekends.map((weekend, idx) => {
        const satDate = weekend.saturday?.date;
        const sunDate = weekend.sunday?.date;

        return (
          <div
            key={idx}
            className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60"
          >
            {/* 週末卡片標頭 */}
            <div className="border-b border-zinc-800 bg-zinc-800/40 px-4 py-2 text-xs font-semibold text-zinc-400">
              週末對照：{satDate || ""} {sunDate ? `/ ${sunDate}` : ""}
            </div>

            {/* 雙欄對照區域 */}
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
              {/* 週六 */}
              <div className="flex flex-col gap-2">
                <div className="text-xs font-bold text-emerald-500">
                  週六 ({weekend.saturday?.date || "無課程"})
                </div>
                {weekend.saturday?.courses && weekend.saturday.courses.length > 0 ? (
                  weekend.saturday.courses.map((course: Course, cIdx: number) => (
                    <CourseCard key={cIdx} course={course} />
                  ))
                ) : (
                  <div className="rounded-md border border-zinc-800/60 bg-zinc-900/30 p-3 text-xs text-zinc-500">
                    本日無課程安排
                  </div>
                )}
              </div>

              {/* 週日 */}
              <div className="flex flex-col gap-2">
                <div className="text-xs font-bold text-emerald-500">
                  週日 ({weekend.sunday?.date || "無課程"})
                </div>
                {weekend.sunday?.courses && weekend.sunday.courses.length > 0 ? (
                  weekend.sunday.courses.map((course: Course, cIdx: number) => (
                    <CourseCard key={cIdx} course={course} />
                  ))
                ) : (
                  <div className="rounded-md border border-zinc-800/60 bg-zinc-900/30 p-3 text-xs text-zinc-500">
                    本日無課程安排
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
