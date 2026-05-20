# 台大 PMBA 課表

React + Tailwind CSS 課表網頁，可依 **A 班** / **B 班** 篩選課程。

## 啟動方式

```bash
cd pmba-schedule
npm install
npm run dev
```

瀏覽器開啟終端機顯示的網址（通常是 http://localhost:5173）。

**請務必用 `npm run dev` 預覽**，不要直接雙擊開啟 `index.html`。Vite 才會編譯 Tailwind CSS；直接開 HTML 會變成無樣式的純文字版面。

## 功能

- **A 班**：財務管理 A、行銷管理（不分班）、連假／特殊活動
- **B 班**：財務管理 B、行銷管理（不分班）、連假／特殊活動
- 特殊活動（新生訓練、中秋／雙十連假）以紅色醒目標示
- 手機：下拉選單；平板以上：Tabs 切換
- 響應式行事曆清單版面

## 修改課表

編輯 `src/data/scheduleData.ts` 即可更新課程資料。
