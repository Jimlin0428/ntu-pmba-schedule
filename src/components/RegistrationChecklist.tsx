import { useState, useEffect } from "react";

interface ChecklistItem {
  id: string;
  title: string;
  deadline: string; 
  timeStr: string; 
}

const initialItems: ChecklistItem[] = [
  { id: "1", title: "完成網路報到", deadline: "2026-05-28", timeStr: "5/26(二) 10:00 ～ 5/28(四) 24:00" },
  { id: "2", title: "預約並完成健康檢查 (報告需10-12工作天)", deadline: "2026-06-22", timeStr: "即日起 ～ 6/22" },
  { id: "3", title: "O’camp 繳費截止", deadline: "2026-06-05", timeStr: "6/5(五) 截止" },
  { id: "4", title: "帳號開通、填寫健康資料與生活型態問卷", deadline: "2026-06-09", timeStr: "6/9(二) 起" },
  { id: "5", title: "繳交暑期學雜費 ($116,500 元)", deadline: "2026-06-22", timeStr: "6/9 ～ 6/22" },
  { id: "6", title: "完成線上註冊並上傳所有證明 (身分證、學歷、健檢表等)", deadline: "2026-06-22", timeStr: "6/22(一) 17:00 前 ⚠️" },
];

export default function RegistrationChecklist() {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("pmba_checklist_progress");
    if (saved) { setCheckedIds(JSON.parse(saved)); }
  }, []);

  const handleToggle = (id: string) => {
    const newIds = checkedIds.includes(id)
      ? checkedIds.filter((item) => item !== id)
      : [...checkedIds, id];
    setCheckedIds(newIds);
    localStorage.setItem("pmba_checklist_progress", JSON.stringify(newIds));
  };

  const getItemStatus = (deadlineStr: string, isChecked: boolean) => {
    if (isChecked) {
      return { textClass: "text-zinc-500 line-through", badge: "✓ 已完成", badgeClass: "bg-zinc-800 text-zinc-400" };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    deadline.setHours(0, 0, 0, 0);

    const timeDiff = deadline.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return { textClass: "text-red-400 font-medium", badge: "⚠️ 已逾期", badgeClass: "bg-red-950/80 text-red-400 border border-red-500/30" };
    } else if (daysDiff <= 2) {
      return { textClass: "text-rose-500 font-bold animate-pulse", badge: `⏰ 剩 ${daysDiff} 天`, badgeClass: "bg-rose-950 text-rose-400 border border-rose-500/40" };
    } else if (daysDiff <= 7) {
      return { textClass: "text-amber-400 font-medium", badge: `⏳ 剩 ${daysDiff} 天`, badgeClass: "bg-amber-950/60 text-amber-400 border border-amber-500/20" };
    }
    return { textClass: "text-zinc-200", badge: "進行中", badgeClass: "bg-zinc-800 text-zinc-400" };
  };

  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 sm:p-5 shadow-xl backdrop-blur-md mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-800 pb-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            🚀 115 級 PMBA 開學準備檢核表
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">進度會自動儲存在個人手機或電腦中</p>
        </div>
        <div className="text-xs bg-zinc-800/80 px-2.5 py-1 rounded-full text-zinc-300 font-medium">
          已完成 {checkedIds.length} / {initialItems.length}
        </div>
      </div>

      <ul className="space-y-2.5">
        {initialItems.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          const status = getItemStatus(item.deadline, isChecked);

          return (
            <li
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border transition-all cursor-pointer ${
                isChecked
                  ? "bg-zinc-900/30 border-zinc-800/40 hover:bg-zinc-900/50"
                  : "bg-zinc-800/30 border-zinc-700/30 hover:border-zinc-700/60 hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-emerald-600 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
                />
                <div>
                  <p className={`text-sm tracking-wide transition-all ${status.textClass}`}>
                    {item.title}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">時程：{item.timeStr}</p>
                </div>
              </div>
              <div className="flex sm:justify-end pl-7 sm:pl-0">
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${status.badgeClass}`}>
                  {status.badge}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}