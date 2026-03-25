# HIS 架構補充說明（可接續開發用）

本文件為 Anchor B 之後的架構補充，  
用於快速讓新對話理解系統運作方式。

---

# 🔥 1. 系統分層（Architecture Layers）

本專案採用分層架構設計：
UI（HTML Pages）
↓
Module（頁面控制 JS）
↓
Core / Engine（業務邏輯）
↓
Service / Data（資料存取）
↓
DB（JSON）
## 各層說明
- **UI 層**
  - pages/*.html
  - 使用者操作入口

- **Module 層**
  - reg_xxx.js / admin_xxx.js
  - 控制畫面與流程

- **Core / Engine 層**
  - register-system.js
  - schedule-engine.js
  - condition-engine.js

- **Data 層**
  - utilities.js（目前）
  - 未來：services 層

- **資料來源**
  - DB/*.json（唯一來源）

---
# 🔥 2. 資料流（Data Flow）
## 📌 掛號流程
UI (reg_by_date.html)
↓
reg_by_date.js
↓
schedule-engine.js
↓
register-system.js
↓
HIS.util.loadJSON()
↓
DB/schedule.json

---
## 📌 Admin DB Viewer
admin_dbviewer.html
↓
admin_dbviewer.js
↓
maintain.js
↓
HIS.util.loadJSON()
↓
DB/*.json

---
## 📌 Admin Loader 流程
admin_index.html
↓
admin_loader.js
↓
admin_config.js
↓
載入 page + scripts
↓
window[module].init()

---
# 🔥 3. 模組責任（Module Responsibility）
## 📦 common/js

| 檔案 | 職責 |
|------|------|
| utilities.js | 共用工具（fetch / 日期） |
| modal.js | 共用 UI 元件 |
| register-system.js | 掛號核心 API |
| condition-engine.js | 條件判斷 |
| schedule-engine.js | 排班邏輯 |

---

## 📦 Register 模組

| 檔案 | 職責 |
|------|------|
| reg_xxx.js | UI + 呼叫核心 |
| router.js | 頁面切換 |

---

## 📦 Admin 模組

| 檔案 | 職責 |
|------|------|
| admin_loader.js | SPA Loader |
| admin_config.js | 模組設定 |
| admin_dbcheck.js | 檢核控制 |
| admin_dbviewer.js | Viewer 控制 |
| maintain.js | 共用 UI + 綁定 |

---

### ⚠️ 設計原則

- Module 不直接操作 DB
- 必須透過 util / service

---
# 🔥 4. 核心設計原則（Important Patterns）

## ⭐ DOM 驅動功能

元素存在 → 啟用功能
元素不存在 → 自動跳過

---
## ⭐ Loader Lifecycle
Load HTML
→ Load JS
→ requestAnimationFrame
→ init()

---
## ⭐ 雙模式 JS（Dual Mode）
Standalone（直接開 HTML）
Loader（由 AdminLoader 控制）

---
## ⭐ 防呆設計
所有 function 必須能處理 null

---
# 🔥 5. 未來發展規劃（Roadmap）

## 📌 架構升級

- services 層（取代 util.loadJSON）
- API 層（模擬後端）

---

## 📌 資料系統

- tables.json
- schema.json

---

## 📌 功能模組

- Patient（病歷）
  - 查詢
  - CRUD
  - 圖片

---

## 📌 系統功能

- 權限系統（FunctionButtonList）
- Admin 功能擴充

---

# 🎯 總結

本系統已從「頁面導向」進化為：

→ 模組化前端架構（輕量級框架）

具備：

- 可擴充
- 可維護
- 可模組化
- 可延伸
