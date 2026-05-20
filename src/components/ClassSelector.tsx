import type { ClassGroup } from "../types";

type Props = {
  value: ClassGroup;
  onChange: (value: ClassGroup) => void;
};

const options: { value: ClassGroup; label: string }[] = [
  { value: "A", label: "A \u73ed" },
  { value: "B", label: "B \u73ed" },
];

export default function ClassSelector({ value, onChange }: Props) {
  return (
    <div className="w-full max-w-xs shrink-0">
      <label className="sr-only" htmlFor="class-select">
        {"\u9078\u64c7\u73ed\u5225"}
      </label>
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

      <div
        role="tablist"
        aria-label={"\u9078\u64c7\u73ed\u5225"}
        className="hidden gap-1 rounded-lg border border-zinc-700 bg-zinc-800/80 p-1 lg:grid lg:grid-cols-2"
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
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
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
