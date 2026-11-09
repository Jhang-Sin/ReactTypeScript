# 🛠️ Vue 通用網頁基本模板使用說明（事件導向版）

本專案頁面採用**事件導向（Event-driven）**架構，不使用監聽器（`watch`），所有資料流皆透過明確的函式鏈（Function Chain）觸發，以確保執行順序與高可追蹤性。


## 🎨 前端 HTML 搭配範例

要讓前端畫面與 JS 完美連動，HTML 結構必須與 JS 的狀態嚴格對應：
html
<div id="app">
  <!-- 頁面載入保護開關：確保預設值與資料皆處理完畢後才顯示畫面 -->
  <div v-if="pageReady">
    
    <!-- 雙向綁定選取值，切換時觸發 loadData 事件入口 -->
    <select v-model="selectedValue" @change="loadData">
      <!-- 迴圈渲染 dataList 陣列 -->
      <option v-for="item in dataList" :key="item.ID" :value="item.value">
        {{ item.ID }} <!-- 畫面上真正顯示出來的文字 -->
      </option>
    </select>

    <p>目前選擇的值是：{{ selectedValue }}</p>
    
  </div>
  <div v-else>
    <p>資料載入中...</p>
  </div>
</div>
```

---

## ⚙️ 通用基本模板 JS (`base_template.js`)

console.log("[template] script loaded");

// ==================================================
// 🚧【最外層保護殼】IIFE（避免全域污染）
// ==================================================
(() => {

  // ==================================================
  // 建立 Vue App（請依專案實際底層函式名稱調整）
  // ==================================================
  const app = createBaseApp({
    pageName: "base_template", // 💡 可自訂：請改為當前頁面功能名稱

    /* =================================================
     * 1️⃣【流程】初始化（init）
     * ================================================= */
    extendMounted() {
      console.log("[1:init] start");

      // 👈 Vue 通用響應式狀態（Reactive State）
      this.pageReady = false;
      this.dataList = [];
      this.selectedValue = ""; // 💡 可自訂：供 select 元件雙向綁定使用

      console.log("[1:init] done");

      // 👉 觸發初始流程
      this.GetData();
    },

    extendMethods: {

      /* =================================================
       * 2️⃣【流程】取得資料
       * ================================================= */
      GetData() {
        console.log("[2:GetData] start");

        // 💡 可自訂：接收並檢驗後端或底層傳入的原始資料來源（例如 this.rawDataSource）
        this.dataList = Array.isArray(this.rawDataSource)
          ? this.rawDataSource
          : [];

        console.log("[2:GetData] result", {
          dataCount: this.dataList.length
        });

        // 👉 進入下一步：渲染與資料綁定
        this.DataSetInView();
      },

      /* =================================================
       * 3️⃣【流程】資料綁定完成
       * ================================================= */
      DataSetInView() {
        console.log("[3:DataSetInView] start");

        // 在此處理資料載入後的特殊轉換（如資料 JOIN、過濾或排序）

        // 👉 進入下一步：設定初始預設值
        this.SetDefaultValue();
      },

      /* =================================================
       * 4️⃣【流程】設定預設值（Vue 版 ng-init）
       * ================================================= */
      SetDefaultValue() {
        console.log("[4:SetDefaultValue]");

        // 👉 設定選單或表單的初始預設值（範例：預設選取第一筆）
        if (!this.selectedValue && this.dataList.length > 0) {
          this.selectedValue = this.dataList.value;
        }

        // 開啟全頁面畫面開關
        this.pageReady = true;

        // 👉 執行首次載入的事件入口
        this.loadData();
      },

      /* =================================================
       * 👉【事件】核心業務邏輯入口（唯一入口）
       * ================================================= */
      loadData() {
        console.log("[event:loadData] selectedValue =", this.selectedValue);

        if (!this.selectedValue) {
          return;
        }

        // 💡 實作當前頁面核心業務邏輯（如根據選取值過濾明細...）
      },

      /* =================================================
       * 👉【事件】表單送出 / 確認動作
       * ================================================= */
      submitAction(item) {
        console.log("[event:submitAction]", item);
        alert(`已選擇：${this.selectedValue}`);
      }
    }
  });

  // ==================================================
  // 🚩 統一出口（unmount掛載）
  // ==================================================
  app.mount("#app");
  window.__vue_app__ = app;

  console.log("[template] mounted");

})();

## 📘 關鍵核心與自訂規範說明

### 🚧【最外層保護殼】 `(() => { ... })()`
*   **說明與對應：** IIFE 閉包。確保程式碼不產生任何全域變數，避免污染環境。
*   **自訂規範：** 嚴禁刪除，所有頁面邏輯必須包在裡面。

### 🏢 核心工廠 `createBaseApp`
*   **說明與對應：** 底層核心提供的工廠函式，用來建立 Vue 實例。
*   **自訂規範：** 可自訂。請依專案共同底層（如 `createRegBaseApp`）進行名稱替換。

### 🏷️ 頁面識別 `pageName: "base_template"`
*   **說明與對應：** 用於日誌追蹤或底層架構動態識別。
*   **自訂規範：** 建議自訂。請改為當前功能名稱（例如 `"reg_by_date"`）。

### 🔄 雙向綁定 `this.selectedValue`
*   **說明與對應：** 響應式變數，與 HTML 的 `v-model` 進行雙向綁定。
*   **自訂規範：** 可自訂。可依業務改名，例如 `this.selectedDepCode`。

### 🚩 統一出口 `app.mount("#app")`
*   **說明與對應：** 將 Vue 實例掛載至實體 DOM 上。
*   **自訂規範：** 依 HTML 結構調整。對應的 HTML 必須存在 `<div id="app">`，否則 Vue 無法啟動。


## 🔄 標準執行生命週期流向 (Function Chain)

當頁面初始化或元件掛載時，JS 內部會嚴格依序執行以下 4 個步驟，請勿跳過或打亂順序：

[1: extendMounted] (變數初始化)
       │
       ▼
[2: GetData] (API / 底層原始資料獲取)
       │
       ▼
[3: DataSetInView] (資料加工、JOIN 或處理)
       │
       ▼
[4: SetDefaultValue] (設定元件預設選取值，並將 pageReady 設為 true)
       │
       ▼
⚡ [event: loadData] (進入實際核心業務邏輯，此後所有 HTML 事件皆以此為唯一入口)