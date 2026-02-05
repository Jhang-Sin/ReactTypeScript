/**
 * reg_by_dep.js
 * -------------------------------------------------
 * 依科別掛號
 * - 使用 reg_base.js 提供之基礎資料
 * - router.js 負責 unmount / remount
 * - 本檔案不做 Vue instance guard
 * -2026-01-22-V2
 */

console.log("[reg_by_dep] script loaded");

// ==================================================
// 🚧【最外層保護殼】IIFE（避免全域污染）
// ==================================================
(() => {

  // ==================================================
  // 建立 Vue App（不可用 const 宣告在全域）
// ==================================================
  const app = createRegBaseApp({
    pageName: "reg_by_dep",

    extendData() {
    return {
      selectedDepCode: "",   // ⭐⭐⭐ 關鍵在這
      depList: [],
      scheduleList: [],
      pageReady: false
    };
  },

    /* =================================================
     * 1️⃣【流程】初始化（init）
     * ================================================= */
    extendMounted() {
      console.log("[1:init] start");

      this.pageReady = false;

      // ✔ 與 HTML 對齊
      this.selectedDepCode = "";
      this.depList = [];
      this.scheduleList = [];

      // 原始資料容器
      this.schedules = [];

      console.log("[1:init] done");

      // 推進流程
      this.GetData();   // 👉【流程】
    },

    extendMethods: {

      /* =================================================
       * 2️⃣【流程】取得資料
       * ================================================= */
      GetData() {
        console.log("[2:GetData] start");

        // ✔ depMap → depList（供下拉選單使用）
        this.depList = this.depMap
          ? Object.values(this.depMap)
          : [];

        // 排班原始資料
        this.schedules = Array.isArray(this.scheduleRaw)
          ? this.scheduleRaw
          : [];

        console.log("[2:GetData] result", {
          depCount: this.depList.length,
          scheduleCount: this.schedules.length
        });

        this.DataSetInView();   // 👉【流程】
      },

      /* =================================================
       * 3️⃣【流程】資料綁定完成
       * ================================================= */
      DataSetInView() {
        console.log("[3:DataSetInView] start");

        // 尚未選科別，清空結果
        this.scheduleList = [];

        this.pageReady = true;
      },

      /* =================================================
       * 👉【事件】使用者選擇科別
       * ================================================= */
      

      loadDep(MOD) {
        console.log(MOD);
        ///TEST用
        console.log('觸發loadDep');
console.log("selectedDepCode =", this.selectedDepCode);
console.table(this.schedules.map(s => s.depCode));
      ///TEST -END

        console.log("[event:loadSchedule]", this.selectedDepCode);

        if (!this.selectedDepCode) {
          this.scheduleList = [];
          console.log("選擇的depCode為空[]");
          return;
        }

        this.scheduleList = this.schedules
          .filter(s => s.status === 1)
          .filter(s => s.depCode === this.selectedDepCode)
          .map(s => this.joinSchedule(s))
          .filter(Boolean);
      },

      /* =================================================
       * 👉【工具】資料 JOIN
       * ================================================= */
      joinSchedule(s) {
        const doctor = this.doctorList.find(
          d => d.id === s.doctorId
        );
        if (!doctor) return null;

        return {
          ...s,
          doctorName: doctor.name
        };
      },

      /* =================================================
       * 👉【事件】掛號
       * ================================================= */
      register(item) {        
        alert(
          `掛號成功\n科別：${this.depMap[item.depCode]?.zh || ""}\n醫師：${item.doctorName}\n日期：${item.date}`
        );
      }
    }
  });

  // ==================================================
  // 🚩 統一出口（router.js 會 unmount）
  // ==================================================
  app.mount("#app");
  window.__vue_app__ = app;

  console.log("[reg_by_dep] mounted");

})();
