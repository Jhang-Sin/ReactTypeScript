📘 Schema 擴充功能說明
一、功能目的

建立一套 Schema 驅動的資料說明機制（Data Dictionary），
提供系統內各資料表的欄位定義、關聯關係與說明資訊。

適用對象：

開發人員
維護人員
系統管理者

二、設計原則
Single Source of Truth
每張資料表一個 schema 檔案
Decoupling
UI 不直接依賴 DB 結構
透過 Schema 提供說明
Guarded Flow
所有資料需經過格式驗證
可維護性優先
結構清晰 > 壓縮寫法

三、資料結構
📁 目錄
DB/schema/
 -schema-list.json
 -schedule.json
 -noon_type.json


📄 schema-list.json
[
  { "name": "schedule", "label": "門診排程" },
  { "name": "noon_type", "label": "午別代碼" }
]


📄 單表 Schema
{
  "name": "schedule",
  "description": "門診排程資料表",
  "primaryKey": "schedule_no",
  "columns": [
    {
      "name": "schedule_no",
      "label": "流水碼",
      "type": "PK",
      "description": "資料唯一識別"
    }
  ]
}

四、欄位定義說明
| 屬性        | 說明            |
| ----------- | -------------- |
| name        | 欄位名稱        |
| label       | 顯示名稱        |
| type        | PK / FK / ENUM |
| description | 說明           |
| relation    | FK 對應表      |
| enum        | 列舉值         |

五、前端流程
1. 載入 schema-list.json
2. 使用者選擇資料表
3. 載入對應 schema.json
4. Vue render

六、錯誤處理
- schema-list 載入失敗 → 顯示錯誤
- schema 不存在 → 顯示提示
- columns 非 Array → 不 render

七、工具使用規範
使用統一工具：
const raw = await HIS.util.loadJSON(url);
const data = raw?.data ?? raw;

八、未來擴充方向
-Schema 關聯導航（FK 跳轉）
-欄位搜尋 / Highlight
-Schema 驗證工具
-Schema 編輯 UI
-Schema 驅動表單產生
-與 DB Viewer 整合

九、設計價值
本機制將系統從：資料導向 → 結構導向 → 說明導向
提升為：可維護、可理解、可擴充的資料平台

✅ 已完成進度
1️⃣ Admin 模組基礎完成
DB Checker（資料檢核）
DB Viewer（資料檢視）
UI / Service / Engine 分層

2️⃣ 新增 SchemaInfo 功能（🔥本次核心）
新頁面：SchemaInfo.html
使用 Vue 3（global build）
使用 HIS.util.loadJSON
不使用 router / loader
不混用 DOM 操作

3️⃣ Schema 架構重設（重大改動）

從：
單一 schema.json（巢狀結構）

➡ 改為：
分檔 + 陣列式 Schema

📁 最終資料結構
DB/
  schema/
    schema-list.json   ← 清單
    schedule.json      ← 單表 schema
    noon_type.json


📄 Schema 設計（核心標準）
{
  "name": "schedule",
  "description": "...",
  "primaryKey": "schedule_no",
  "columns": [
    {
      "name": "...",
      "label": "...",
      "type": "PK | FK | ENUM",
      "description": "...",
      "relation": "...",
      "enum": [...]
    }
  ]
}

🔁 前端流程
schema-list.json
↓
使用者選擇 table
↓
載入 /schema/{table}.json
↓
Vue render

⚠️ 關鍵技術修正
loadJSON 回傳格式不固定

👉 解法：
const raw = await HIS.util.loadJSON(url);
const data = raw?.data ?? raw;

🚀 下一步可發展
Schema + DB Viewer 整合
FK 關聯跳轉
欄位搜尋 / highlight
Schema → 自動產生表單
Schema 驗證器
Schema Editor（後台可修改）
