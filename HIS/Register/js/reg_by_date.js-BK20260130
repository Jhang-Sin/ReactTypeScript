/**
 * reg_by_date.js
 * -------------------------------------------------
 * 依日期掛號頁（Phase 1）
 * - 使用 reg_base.js
 * - router.js 負責 unmount / remount
 * - 本檔案不可自行判斷 Vue 是否已存在
 * - 不宣告任何全域 const / let
 * -20260127
 * -------------------------------------------------
 */

console.log("[reg_by_date] script loaded");

// ==================================================
// 🚧【最外層保護殼】IIFE（避免全域污染）
// ==================================================
(() => {

  // ==================================================
  // 建立 Vue App（不可用 const 宣告在全域）
  // ==================================================
  const app = createRegBaseApp({
    pageName: "reg_by_date",

    /* =================================================
     * 1️⃣【流程】初始化（init）
     * ================================================= */
    extendMounted() {
      console.log("[1:init] start");

      // 👈 一定要先宣告（Vue reactivity）
      this.pageReady = false;

      this.depList = [];
      this.schedules = [];
      this.scheduleList = [];

      this.selectedDate = "";
      this.selectedDepCode = "";

      console.log("[1:init] done");

      // 👉【流程】
      this.GetData();
    },

    extendMethods: {

      /* =================================================
       * 2️⃣【流程】取得資料
       * ================================================= */
      GetData() {
        console.log("[2:GetData] start");

        // 科別資料（dep_map.json → reg_base.js）
        this.depList = Object.keys(this.depMap || {}).map(code => ({
          code,
          ...this.depMap[code]
        }));

        // 排班資料
        this.schedules = Array.isArray(this.scheduleRaw)
          ? this.scheduleRaw
          : [];

        console.log("[2:GetData] result", {
          depCount: this.depList.length,
          scheduleCount: this.schedules.length
        });

        // 👉【流程】
        this.DataSetInView();
      },

      /* =================================================
       * 3️⃣【流程】資料綁定完成
       * ================================================= */
      DataSetInView() {
        console.log("[3:DataSetInView] start");

        this.scheduleList = [];

        // 👉【流程】
        this.SetDefaultValue();
      },

      /* =================================================
       * 4️⃣【流程】設定預設值（Vue 版 ng-init）
       * ================================================= */
      SetDefaultValue() {
        console.log("[4:SetDefaultValue]");

        // 預設日期：今天
        if (!this.selectedDate) {
          const today = new Date();
          this.selectedDate = today.toISOString().slice(0, 10);
        }

        // 預設科別：第一筆
        if (!this.selectedDepCode && this.depList.length > 0) {
          this.selectedDepCode = this.depList[0].code;
        }

        this.pageReady = true;

        // 👉【流程】
        this.loadDate();
      },

      /* =================================================
       * 👉【事件】日期 / 科別變動
       * ================================================= */
      loadDate() {
        console.log(
          "[event:loadDate]",
          "date =", this.selectedDate,
          "dep =", this.selectedDepCode
        );

        if (!this.selectedDate || !this.selectedDepCode) {
          this.scheduleList = [];
          return;
        }

        this.scheduleList = this.schedules
          .filter(s => {
            const dateMatch =
              String(s.date) === String(this.selectedDate);
            const depMatch =
              String(s.depCode) === String(this.selectedDepCode);

            return dateMatch && depMatch;
          })
          .map(s => this.joinSchedule(s))
          .filter(Boolean);

        console.log(
          "[result] scheduleList length =",
          this.scheduleList.length
        );
      },

      /* =================================================
       * 👉【工具】資料 JOIN
       * ================================================= */
      joinSchedule(s) {
        const doctor = this.doctorList?.find(
          d => String(d.doctorId) === String(s.doctorId)
        );

        if (!doctor) {
          console.warn(
            "[joinSchedule fail]",
            "doctorId =", s.doctorId
          );
          return null;
        }

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
          `掛號成功\n日期：${item.date}\n` +
          `科別：${this.depMap[item.depCode]?.zh || ""}\n` +
          `醫師：${item.doctorName}`
        );
      }
    }
  });

  // ==================================================
  // 🚩 統一出口（router.js 會 unmount）
  // ==================================================
  app.mount("#app");
  window.__vue_app__ = app;

  console.log("[reg_by_date] mounted");

})();
