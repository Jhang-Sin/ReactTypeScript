# HIS - Admin 模組說明文件

本模組為 HIS 專案中的「管理者功能模組」，  
採用 **Vanilla JS + 自製 Loader 架構**，實現輕量級 SPA 行為。


# 🎯 模組目標

- 提供管理者功能（資料檢核 / DB Viewer / 未來擴充）
- 與主系統（掛號）解耦
- 支援模組化擴充
- 支援動態載入頁面與 JS


# 📦 目錄結構
HIS/Admin/
│
├─ pages/
│ ├─ admin_index.html # 管理者入口（主容器）
│ ├─ admin_dbcheck.html # 資料表檢核頁
│ ├─ admin_dbviewer.html # Data + Schema 檢視
│ └─ admin_maintain.html # 舊版（保留）
│
├─ js/
│ ├─ admin_loader.js # 🔥 核心 Loader（控制整體流程）
│ ├─ admin_config.js # 模組設定（頁面 + JS 對應）
│ ├─ admin_dbcheck.js # DB 檢核模組
│ ├─ admin_dbviewer.js # DB Viewer 模組
│ └─ maintain.js # 共用邏輯（UI + DB 操作）
│
└─ css/

# ⚙️ Loader 架構（核心）

## 📌 設計目的

- 不使用 framework（React / Vue）
- 自行實作 SPA 行為
- 動態載入 HTML + JS

## 📌 流程
admin_index.html
↓
AdminLoader.load(moduleKey)
↓
fetch HTML → 插入 #admin-content
↓
載入 scripts（依序）
↓
requestAnimationFrame
↓
window[module].init()



## 📌 AdminModules 設定

```js
window.AdminModules = { 
    dbcheck: {
        name: "掛號資料表檢核",
        page: "admin_dbcheck.html",
        scripts: [
            "../js/maintain.js",
            "../js/admin_dbcheck.js"
        ]
    },
    dbviewer: {
        name: "Data + Schema 展示",
        page: "admin_dbviewer.html",
        scripts: [
            "../js/admin_dbviewer.js"
        ]
    }
};

🧩 模組設計規範
📌 每個模組必須提供
window.moduleName = {
    init: function() {},
    destroy: function() {}
};

📌 init 觸發時機

由 Loader 控制：
HTML 已插入
JS 已載入
→ 才呼叫 init()


📌 Dual Mode（雙模式）

每個模組需支援：
1.Standalone 模式
-直接開 HTML
-使用 DOMContentLoaded

2.Loader 模式
-由 AdminLoader 呼叫 init()

🧠 maintain.js（共用邏輯）
📌 功能:
1.DB 下拉選單初始化
2.DB Viewer（JSON → Table）
3.DB 檢核結果顯示

⚠️ 設計原則（重要）
1️⃣ DOM 驅動功能
    if (element 存在) → 啟用功能
    if (element 不存在) → 跳過
👉 不同頁面不保證有相同元素

2️⃣ 防呆設計
function 必須能接受 null

3️⃣ 不可假設頁面完整
❌ 錯誤:
const el = document.getElementById("xxx");
el.innerHTML = "..."; // 可能爆

✅ 正確:
if (el) {
    el.innerHTML = "...";
}

🔄 模組關係

admin_dbcheck.js
  ↓
maintain.js
  ↓
HIS.util.loadJSON()
  ↓
DB / *.json


📌 目前已知問題
❗ 問題 1：DOM 抓不到

現象：

btnCheckDB 可抓到

dbSelect / btnLoadDB 為 null

原因：

HTML 頁面未包含該元素

maintain.js 為共用邏輯

👉 解法：

改為「功能分段初始化」

❗ 問題 2：initMaintainPage 未觸發

原因：

Loader 模式下不會觸發 DOMContentLoaded

👉 解法：

由 module.init() 主動呼叫

❗ 問題 3：載入順序

必要順序：

maintain.js → module.js
🚧 開發原則
1️⃣ Module 不直接操作 DB

必須透過：

HIS.util.loadJSON()
（未來 → services 層）
2️⃣ Loader 控制生命週期
init → 啟動功能
destroy → 清理事件（未來使用）
3️⃣ 避免全域污染

使用：

(function(){ ... })()
🚀 未來擴充
📌 功能

schema.json（欄位說明）

DB Viewer 升級

Patient 模組

Admin 權限管理

📌 架構升級

services 層（資料存取）

API 層（模擬後端）

🎯 總結

Admin 模組目前為：

👉 「自製 SPA Loader 架構」

具備：

模組化

可擴充

可維護

可延伸

🧭 開發提示

當新增功能時：

新增 HTML（pages）

新增 JS（js）

註冊至 admin_config.js

實作 init()

📌 備註

admin_maintain.html 為舊版（已拆分）

maintain.js 為過渡共用層