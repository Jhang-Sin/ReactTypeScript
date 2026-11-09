
console.log("[template] script loaded");

// ==================================================
// 🚧【最外層保護殼】IIFE（避免全域污染）
// ==================================================
(() => {

  // ==================================================
  // 建立 Vue App
  // ==================================================
  const app = createBaseApp({
    pageName: "base_template",

    /* =================================================
     * 1️⃣【流程】初始化（init）
     * ================================================= */
    extendMounted() {
      console.log("[1:init] start");

      // 👈 Vue 通用響應式狀態（Reactive State）
      this.pageReady = false;
      this.dataList = [];
      this.selectedValue = ""; // 供 select 元件雙向綁定使用

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

        // 範例：從底層或後端來源獲取資料
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

        // 在此處理資料載入後的特殊轉換（如 JOIN 或過濾）

        // 👉 進入下一步：設定初始預設值
        this.SetDefaultValue();
      },

      /* =================================================
       * 4️⃣【流程】設定預設值（Vue 版 ng-init）
       * ================================================= */
      SetDefaultValue() {
        console.log("[4:SetDefaultValue]");

        // 👉 設定選單或表單的初始預設值
        if (!this.selectedValue && this.dataList.length > 0) {
          this.selectedValue = this.dataList[0].value;
        }

        this.pageReady = true;

        // 👉 執行首次載入的事件入口
        this.loadData();
      },

      /* =================================================
       * 👉【事件】核心業務邏輯入口
       * ================================================= */
      loadData() {
        console.log("[event:loadData] selectedValue =", this.selectedValue);

        if (!this.selectedValue) return;

        // 根據選取的值執行對應的商業邏輯...
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
/* =====================================================
 * 通用頁面基本模板 base_template.js
 * （事件導向版本，無 watch）
 * - 使用 base_lib.js (或 reg_base.js)
 * - 本檔案不可自行判斷 Vue 是否已存在
 * - 不宣告任何全域 const / let
 * - 20260208-V3
 * ===================================================== */
console.log("[template] script loaded");

// ==================================================
// 🚧【最外層保護殼】IIFE（避免全域污染）
// ==================================================
(() => {

  // ==================================================
  // 建立 Vue App
  // ==================================================
  const app = createBaseApp({
    pageName: "base_template",

    /* =================================================
     * 1️⃣【流程】初始化（init）
     * ================================================= */
    extendMounted() {
      console.log("[1:init] start");

      // 👈 Vue 通用響應式狀態（Reactive State）
      this.pageReady = false;
      this.dataList = [];
      this.selectedValue = ""; // 供 select 元件雙向綁定使用

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

        // 範例：從底層或後端來源獲取資料
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

        // 在此處理資料載入後的特殊轉換（如 JOIN 或過濾）

        // 👉 進入下一步：設定初始預設值
        this.SetDefaultValue();
      },

      /* =================================================
       * 4️⃣【流程】設定預設值（Vue 版 ng-init）
       * ================================================= */
      SetDefaultValue() {
        console.log("[4:SetDefaultValue]");

        // 👉 設定選單或表單的初始預設值
        if (!this.selectedValue && this.dataList.length > 0) {
          this.selectedValue = this.dataList[0].value;
        }

        this.pageReady = true;

        // 👉 執行首次載入的事件入口
        this.loadData();
      },

      /* =================================================
       * 👉【事件】核心業務邏輯入口
       * ================================================= */
      loadData() {
        console.log("[event:loadData] selectedValue =", this.selectedValue);

        if (!this.selectedValue) return;

        // 根據選取的值執行對應的商業邏輯...
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
