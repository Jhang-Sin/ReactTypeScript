// HIS/Register/js/reg_by_date.js
/*
依醫師掛號（三階段 Pipeline 版本）
可逐步除錯版
20251218
*/


(function () {
  console.log("[reg_by_date] script start");

  const app = Vue.createApp({
    data() {
      return {
        // base data
        noonMap: {},
        depMap: {},
        scheduleRaw: [],

        // view state
        selectedDate: "",
        dateList: [],
        scheduleList: [],

        pageReady: false
      };
    },

    async mounted() {
      console.log("[reg_by_date] mounted");
      await this.initPage();
    },

    methods: {
      /* ========= Pipeline Entry ========= */
      async initPage() {
        try {
          this.resetPage();
          await this.loadBaseData();      // Step 1
          this.dataSetInView();           // Step 2
          this.finishData();              // Step 3
        } catch (e) {
          console.error("[reg_by_date] initPage failed", e);
          alert("error-0：初始化失敗");
        }
      },

      /* ========= Step 0 ========= */
      resetPage() {
        this.selectedDate = "";
        this.dateList = [];
        this.scheduleList = [];
        this.pageReady = false;
      },

      /* ========= Step 1 ========= */
      async loadBaseData() {
        const noon = await HIS.util.loadJSON("DB/noon_type.json");
        const deps = await HIS.util.loadJSON("DB/departments.json");
        const schedule = await HIS.util.loadJSON("DB/schedule.json");

        if (!noon || !deps || !Array.isArray(schedule)) {
          throw new Error("base data missing");
        }

        this.noonMap = noon;
        this.depMap = Object.fromEntries(
          deps.map(d => [d.code, d])
        );
        this.scheduleRaw = schedule;

        console.log("[reg_by_date] base data loaded");
      },

      /* ========= Step 2 ========= */
      dataSetInView() {
        // 建立日期清單（去重）
        const set = new Set(this.scheduleRaw.map(s => s.date));
        this.dateList = Array.from(set).sort();
      },

      /* ========= Step 3 ========= */
      finishData() {
        this.pageReady = true;
        console.log("[reg_by_date] page ready");
      },

      /* ========= User Action ========= */
      loadSchedule() {
        if (!this.selectedDate) {
          this.scheduleList = [];
          return;
        }

        this.scheduleList = this.scheduleRaw.filter(
          s => s.date === this.selectedDate
        );
      },

      register(item) {
        alert(
          `掛號成功\n日期：${item.date}\n醫師：${item.doctorName}`
        );
      }
    }
  });

  app.mount("#app");
  console.log("[reg_by_date] Vue mounted");
})();
