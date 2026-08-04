import type { Weekend, Course } from "../types";

// 將日期字串（例如 "8月23日"）解析為西元年月日格式
function parseDateString(dateStr: string, year: number = 2026): { year: number; month: number; day: number } | null {
  const match = dateStr.match(/(\d+)月(\d+)日/);
  if (!match) return null;
  return {
    year,
    month: parseInt(match[1], 10),
    day: parseInt(match[2], 10),
  };
}

// 格式化為 iCalendar 需要的 YYYYMMDDTHHMMSSZ 格式
function formatDateToICS(year: number, month: number, day: number, hour: number, minute: number): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
}

export function downloadICS(weekends: Weekend[], selectedClassName: string = "PMBA") {
  let icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NTU PMBA Schedule//TW",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:台大 PM 課程表",
    "X-WR-TIMEZONE:Asia/Taipei",
  ];

  weekends.forEach((weekend) => {
    const days = [weekend.saturday, weekend.sunday].filter(Boolean);

    days.forEach((dayObj) => {
      if (!dayObj || !dayObj.courses) return;

      const dateParsed = parseDateString(dayObj.date);
      if (!dateParsed) return;

      dayObj.courses.forEach((course: Course) => {
        if (course.isHoliday || course.name.includes("連假")) return;

        // 預設上課時間為 09:00 - 16:00
        const startTime = formatDateToICS(dateParsed.year, dateParsed.month, dateParsed.day, 9, 0);
        const endTime = formatDateToICS(dateParsed.year, dateParsed.month, dateParsed.day, 16, 0);

        icsContent.push(
          "BEGIN:VEVENT",
          `SUMMARY:[台大PM] ${course.name}`,
          `DESCRIPTION:授課教師：${course.teacher || "無"} | 時數：${course.hours}小時`,
          `LOCATION:${course.classroom || "未定"}`,
          `DTSTART;TZID=Asia/Taipei:${startTime}`,
          `DTEND;TZID=Asia/Taipei:${endTime}`,
          `STATUS:CONFIRMED`,
          "END:VEVENT"
        );
      });
    });
  });

  icsContent.push("END:VCALENDAR");

  // 觸發瀏覽器下載 .ics 檔案
  const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `NTU_PM_Schedule_${selectedClassName}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
