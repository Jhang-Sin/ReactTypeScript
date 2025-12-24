/* =========================
 * reg_by_doctor.js
 * 三階段 + 資料驗證最終版
 * 異動日期:2025-12-18
 * 含資料驗證
 * ========================= */

console.log("[reg_by_doctor] script start");

(function () {
  const { createApp } = Vue;

  /* ========= 共用：資料驗證器 ========= */
  function validateScheduleData(schedule, noonMap, depMap) {
    const errors = [];

    schedule.forEach((item, index) => {
      const itemErrors = [];

      if (!item.date) {
        itemErrors.push("missing date");
      }

      if (!item.noon) {
        itemErrors.push("missing noon");
      } else if (!noonMap[item.noon]) {
        itemErrors.push(`invalid noon code: ${item.noon}`);
      }

      if (!item.depCode) {
        itemErrors.push("missing depCode");
      } else if (!depMap[item.depCode]) {
        itemErrors.push(`invalid depCode: ${item.depCode}`);
      }

      if (itemErrors.length > 0) {
        errors.push({
          index,
          item,
          errors: itemErrors
        });
      }
    });

    return errors;
  }

  const app = createApp({
    data() {
      return {
        // 原始資料
        doctorList: [],
        scheduleRaw: [],

        // 對應表
        noonMap: {},
        depMap: {},

        // 畫面用
        selectedDoctorId: "",
        scheduleList: []
      };
    },

    /* =========================
     * STEP 1：載入資料
     * ========================= */
    async mounted() {
      console.log("[reg_by_doctor] mounted");

      try {
        await this.loadBaseData();
        await this.loadDoctorList();
      } catch (err) {
        console.error("[reg_by_doctor] init failed", err);
        alert("error-0：初始化資料失敗");
      }
    },

    methods: {
      async loadBaseData() {
        const noon = await HIS.util.loadJSON("/ReactTypeScript/HIS/DB/noon_type.json");
        const deps = await HIS.util.loadJSON("/ReactTypeScript/HIS/DB/dep_map.json");

        if (!noon || !deps) {
          throw new Error("base data missing");
        }

        this.noonMap = noon;
        this.depMap = deps;

        console.log("[reg_by_doctor] base data loaded");
      },

      async loadDoctorList() {
        const doctors = await HIS.util.loadJSON("/ReactTypeScript/HIS/DB/doctors.json");

        if (!Array.isArray(doctors)) {
          throw new Error("doctors.json invalid");
        }

        this.doctorList = doctors;
        console.log("[reg_by_doctor] doctors loaded", doctors.length);
      },

      /* =========================
       * STEP 2：資料拼湊 + 驗證
       * ========================= */
      async loadSchedule() {
        if (!this.selectedDoctorId) {
          this.scheduleList = [];
          return;
        }

        const schedule = await HIS.util.loadJSON("/ReactTypeScript/HIS/DB/schedule.json");

        if (!Array.isArray(schedule)) {
          alert("error-1：排班資料格式錯誤");
          return;
        }

        // 篩選該醫師
        const filtered = schedule.filter(
          s => s.doctorId === this.selectedDoctorId
        );

        // 🔴 核心：逐筆驗證
        const errors = validateScheduleData(
          filtered,
          this.noonMap,
          this.depMap
        );

        if (errors.length > 0) {
          console.group("[reg_by_doctor] schedule validation failed");

          errors.forEach(e => {
            console.error(
              `❌ item[${e.index}]`,
              e.item,
              "=>",
              e.errors.join(", ")
            );
          });

          console.groupEnd();

          alert("error-2：排班資料有誤，請查看 console");
          return;
        }

        // 安全資料才進畫面
        this.scheduleList = filtered;

        console.log("[reg_by_doctor] schedule loaded", filtered.length);
      },

      /* =========================
       * STEP 3：後續操作
       * ========================= */
      register(item) {
        console.log("[reg_by_doctor] register", item);
        alert("模擬掛號成功");
      }
    }
  });

  // 掛給 router 使用
  window.__vue_app_instance__ = app.mount("#app");

  console.log("[reg_by_doctor] Vue mounted");
})();
