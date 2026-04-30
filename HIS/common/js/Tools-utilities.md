📘 utilities.js 使用規範（HIS 專案標準）
一、🎯 設計目的

utilities.js 為專案的共用工具層（Common Utility Layer），負責：

環境判斷（GitHub Pages / localhost）
資源路徑統一（JSON / API）
基本工具方法（日期、資料處理）


二、🧱 核心設計原則

1️⃣ 單一來源（Single Source of Truth）

👉 所有「路徑組合」只能由 utilities 負責

✔ utilities.js 負責 BASE / ROOT
❌ 各頁面自行組合完整路徑

2️⃣ 責任分離（Decoupling）
UI（頁面）
↓
呼叫 utilities
↓
utilities 處理環境與路徑

👉 UI 不應知道：

-是否在 GitHub Pages
-是否有 /ReactTypeScript
-實際部署位置

3️⃣ 控制流程防護（Guarded Flow）
所有使用 utilities 的地方，必須：
-檢查回傳值
-防止 undefined / null
-避免直接信任資料

4️⃣ 不重複邏輯（No Duplicate Logic）
👉 禁止：
// ❌ 不要自己再組 BASE
例:const url = BASE + "/DB/xxx.json";

三、🌐 路徑處理規範（🔥最重要）
🔥 原則：路徑只處理一次

👉 utilities.js 已負責：BASE = ROOT + /HIS

✅ 正確寫法:
const url = "/DB/schema/schedule.json";
const raw = await HIS.util.loadJSON(url);

❌ 錯誤寫法:
// ❌ 重複加 BASE 
const url = `${BASE}/DB/schema/schedule.json`;

❌ 絕對禁止:
// ❌ 相對路徑地獄
"../DB/schema/xxx.json"
"../../DB/schema/xxx.json"

📌 統一規則:
所有路徑一律從 /HIS 底下開始寫

📌 範例:
| 類型  | 寫法                         |
| --- | -------------------------- |
| DB  | `/DB/schema/schedule.json` |
| API | `/API/admin/getData`       |
| 設定  | `/DATA/config.json`        |


四、📥 loadJSON 使用規範:

⚠️ 回傳格式不固定（重要）

loadJSON() 可能回傳：
// 情況 1
[ {...}, {...} ]

// 情況 2
{ data: [...] }

// 情況 3
undefined（錯誤）


✅ 標準寫法（必須使用）
const raw = await HIS.util.loadJSON(url);

if (raw === undefined) {
  console.error("loadJSON failed:", url);
  return;
}

// 🔥 統一解包
const data = raw?.data ?? raw;


❌ 禁止寫法
if (raw.success) { }  // ❌ 不保證存在


五、🛡️ 錯誤處理標準:

✅ 必須處理:
if (raw === undefined) {
  // 顯示錯誤
  // log
}
✅ 建議加 debug:
console.log("URL:", url);
console.log("RAW:", raw);

🔍 常見錯誤來源:
| 問題        | 原因       |
| --------- | -------- |
| undefined | 路徑錯誤     |
| undefined | JSON 格式錯 |
| undefined | fetch 失敗 |

六、📅 日期工具使用規範（HIS 核心鐵律）
🔥 絕對規則
日期 = 字串（YYYY-MM-DD）
不是 Date 物件

❌ 禁止:
new Date("2026-11-16")

✅ 使用:
HIS.util.todayYMD()
HIS.util.addDays("2026-11-16", 1)
HIS.util.isSameDate(a, b)


🧩 使用範例（標準模板）-載入 Schema 

async function loadSchema() {

  const url = `/DB/schema/${this.selectedTable}.json`;

  const raw = await HIS.util.loadJSON(url);

  if (raw === undefined) {
    this.errorMsg = "載入失敗";
    return;
  }

  const data = raw?.data ?? raw;

  if (!data || typeof data !== "object") {
    this.errorMsg = "資料格式錯誤";
    return;
  }

  this.schema = data;
}

使用範例-載入清單
async function loadList() {

  const raw = await HIS.util.loadJSON("/DB/schema/schema-list.json");

  if (raw === undefined) return;

  const data = raw?.data ?? raw;

  if (!Array.isArray(data)) return;

  this.list = data;
}

🚫 禁止事項（請嚴格遵守）:
❌ 不要自己處理 BASE
const BASE = ...

❌ 不要假設 loadJSON 格式
raw.success // ❌

❌ 不要讓 UI 控制資料來源
👉 UI 只負責顯示

九、🚀 未來擴充建議
1️⃣ 統一回傳格式
{
  success: true,
  data,
  error
}

2️⃣ 增加 helper
HIS.util.getData(raw)

3️⃣ API 模組化
HIS.api.getSchedule()

🔥🔥🏁 最終總結🔥🔥
1️⃣ 路徑只寫一次（/DB/...）
2️⃣ loadJSON 一律防 undefined
3️⃣ 不要自己組 BASE