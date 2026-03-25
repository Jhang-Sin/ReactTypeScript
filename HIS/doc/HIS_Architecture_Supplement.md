# HIS 架構補充說明（可接續開發用）

本文件為 Anchor B 之後的架構補充，  
用於快速讓新對話理解系統運作方式。
20260320-產出

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

- UI 層：pages/*.html（使用者操作入口）
- Module 層：reg_xxx.js / admin_xxx.js（畫面與流程）
- Core 層：register-system / schedule-engine / condition-engine
- Data 層：utilities.js（未來 services）
- DB：JSON 資料來源

---

# 🔥 2. 資料流（Data Flow）

## 掛號流程

UI → reg_by_date.js → schedule-engine → register-system → loadJSON → DB

## Admin DB Viewer

admin_dbviewer → admin_dbviewer.js → maintain.js → loadJSON → DB

## Admin Loader

admin_index → admin_loader → admin_config → 載入 page + scripts → init()

---

# 🔥 3. 模組責任（Module Responsibility）

## common/js
- utilities.js：工具
- modal.js：UI
- register-system.js：核心 API
- condition-engine.js：條件
- schedule-engine.js：排班

## Register
- reg_xxx.js：UI 控制
- router.js：頁面切換

## Admin
- admin_loader.js：載入器
- admin_config.js：設定
- admin_dbcheck.js：檢核
- admin_dbviewer.js：檢視
- maintain.js：共用邏輯

設計原則：
Module 不直接操作 DB

---

# 🔥 4. 核心設計原則

DOM 驅動：
元素存在 → 啟用功能

Loader Lifecycle：
Load HTML → Load JS → requestAnimationFrame → init()

Dual Mode：
Standalone / Loader

防呆：
function 必須支援 null

---

# 🔥 5. 未來發展

- services 層
- API 層
- schema 系統
- Patient 模組
- 權限系統

---

# 🎯 總結

本系統已進化為：
模組化前端架構（輕量框架）

具備：
- 可擴充
- 可維護
- 可模組化
