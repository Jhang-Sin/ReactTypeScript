/**
 * reg_base.js
 * 掛號頁共用 Vue 基底（Phase 1）
 * - 只負責共用 data 結構
 * - 只負責共用資料載入
 * - 不包含任何「篩選條件」
 */

console.log("[reg_base] loaded");

window.createRegBaseApp = function (options = {}) {
  const {
    pageName = "unknown",
    extendMethods = {},
    extendMounted = null
  } = options;

  console.log(`[reg_base] create app: ${pageName}`);

  return Vue.createApp({
    data() {
      return {
        // ===== 共用資料 =====
        doctorList: [],
        scheduleRaw: [],
        scheduleList: [],

        noonMap: {},
        depMap: {},

        // ===== 共用狀態 =====
        loading: false,
        errorMsg: "",

        // ===== 給各頁用的選擇值（先放著）=====
        selectedValue: ""
      };
    },

    async mounted() {
      console.log(`[${pageName}] base mounted`);
      try {
        this.loading = true;
        await this.loadBaseData();

        // 讓各頁可以補自己的 mounted
        if (typeof extendMounted === "function") {
          await extendMounted.call(this);
        }
      } catch (err) {
        console.error(`[${pageName}] init failed`, err);
        this.errorMsg = "初始化資料失敗";
      } finally {
        this.loading = false;
      }
    },

    methods: {
      /* =========================
       * 共用資料載入
       * ========================= */
      async loadBaseData() {
        console.log("[reg_base] load base data");

        const [noon, dep, doctors, schedule] = await Promise.all([
          HIS.util.loadJSON("/DB/noon_type.json"),
          HIS.util.loadJSON("/DB/dep_map.json"),
          HIS.util.loadJSON("/DB/doctors.json"),
          HIS.util.loadJSON("/DB/schedule.json")
        ]);

        if (!noon || !dep || !Array.isArray(doctors) || !Array.isArray(schedule)) {
          throw new Error("base data invalid");
        }

        this.noonMap = noon;
        this.depMap = dep;
        this.doctorList = doctors;
        this.scheduleRaw = schedule;

        console.log("[reg_base] base data loaded");
      },

      // 預留：之後 Phase 2 / 3 會抽進來
      ...extendMethods
    }
  });
};
