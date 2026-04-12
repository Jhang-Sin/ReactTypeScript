# HIS Admin 管理者作業（重構摘要）

## 🎯 一、目前重點（Current Focus）

- ✅ 已完成「管理者維護功能拆分」
  - 原單頁 `admin_maintain.html` 已拆分為：
    - `admin_dbcheck.html`（資料表檢核）
    - `admin_dbviewer.html`（資料檢視）
- ✅ 功能已可正常運作：
  - JSON 資料讀取（DB Viewer）
  - 掛號資料表檢核（DB Checker）
- ✅ 架構已調整為：
  - UI（頁面）與邏輯（JS）分離
  - 引入 Service 概念（`admin_dataService.js`）
- ✅ 已暫停使用 Loader 架構：
  - `admin_loader.js`
  - `admin_config.js`

- 1. 新頁面拆分:
admin_index.html（入口頁）
admin_dbcheck.html（資料檢核）
admin_dbviewer.html（資料檢視）
- 2. Service 層（核心）:
admin_dataService.js
負責：
DB 檢核呼叫
JSON 資料讀取
統一回傳格式（ResultData）
- 3. UI 控制層:
admin_dbcheck.js
admin_dbviewer.js
👉 職責：
只處理畫面事件與資料呈現（不含業務邏輯）
👉 目前狀態：
穩定可用 + 可擴充（已脫離舊版耦合設計）

=-=-=-=-=-=-🧊 停用 / 封存（Deprecated）=-=-=-=-=-=-=
- 1. 舊版頁面
  admin_maintain.html
  ❌ 單頁混合多功能（檢核 + 檢視）
  ❌ DOM 綁死（innerHTML / getElementById）
- 2. 舊版 JS（不再擴充）
  maintain.js
  ❌ UI + 邏輯耦合
  ❌ 無法模組化
- 3. Loader 機制（暫停使用）
  admin_loader.js
  admin_config.js

- 👉 原因：
  動態載入多 JS 造成：
  - 路徑錯誤
  - 載入順序問題
  - DOM timing 問題
- 👉 目前改採「靜態載入」提升穩定性

API備註:
✔ async checkDB → 是 method（API）
✔ return {...} → 統一回傳格式（ResultData）
✔ errorCode → 錯誤系統
✔ window.xxx → 掛全域（讓別人用）