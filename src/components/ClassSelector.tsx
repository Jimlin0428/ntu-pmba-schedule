import type { ClassGroup } from "../types";

type Props = {
  value: ClassGroup;
  onChange: (value: ClassGroup) => void;
};

const options: { value: ClassGroup; label: string }[] = [
  { value: "PMBA_A", label: "PMBA (A班)" },
  { value: "PMBA_B", label: "PMBA (B班)" },
  { value: "PMLBA_A", label: "PMLBA (A班)" },
  { value: "PMLBA_B", label: "PMLBA (B班)" },
  { value: "PMBM_A", label: "PMBM (A班)" },
  { value: "PMBM_B", label: "PMBM (B班)" },
];

export default function ClassSelector({ value, onChange }: Props) {
  return (
    // 這裡微調了 max-w，讓 6 個按鈕在大螢幕有足夠寬度展開
    <div className="w-full lg:max-w-3xl shrink-0">
      <label className="sr-only" htmlFor="class-select">
        {"選擇班別"}
      </label>
      
      {/* 手機版：專屬下拉選單 */}
      <select
        id="class-select"
        value={value}
        onChange={(e) => onChange(e.target.value as ClassGroup)}
        className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm font-medium text-white focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-800/40 lg:hidden"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-800">
            {opt.label}
          </option>
        ))}
      </select>

      {/* 電腦版：高質感 6 欄平排按鈕 */}
      <div
        role="tablist"
        aria-label={"選擇班別"}
        className="hidden gap-1 rounded-lg border border-zinc-700 bg-zinc-800/80 p-1 lg:grid lg:grid-cols-6"
      >
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(opt.value)}
              className={`rounded-md px-1 py-2 text-xs font-semibold transition-colors ${
                active
                  ? "bg-emerald-900/60 text-white shadow-sm"
                  : "text-[#9CA3AF] hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
