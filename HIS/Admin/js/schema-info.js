/**
 * 🚧【最外層保護殼】IIFE（避免全域污染）-20260424
 */
(function () {

  const { createApp } = Vue;
  const BASE = getBasePath();///抓基礎路徑


  /**
   * 🚩【統一出口】
   */
  window.__vue_app__ = createApp({

    data() {
      return {
        tableList: [],       // 安全預設
        selectedTable: "",
        schema: null,
        errorMsg: ""
      };
    },

    computed: {

      /**
       * 👉【防炸】欄位一定是 Array
       */
      safeColumns() {
        return Array.isArray(this.schema?.columns)
          ? this.schema.columns
          : [];
      }

    },

    async mounted() {
      await this.init();
    },

    methods: {

      /**
       * 1️⃣【流程】初始化（init）
       */
      async init() {
        await this.loadSchemaList();
      },

      /**
       * 2️⃣【流程】取得資料（Schema 清單）
       */
      async loadSchemaList() {

        this.errorMsg = "";
        this.tableList = [];

        try {

          const raw = await HIS.util.loadJSON("../HIS/DB/schema/schema-list.json");
          ///判定錯誤原因 
          if (raw === undefined) 
            {
              console.error("❌ loadJSON 失敗:", url);
              this.errorMsg = "載入失敗（可能是路徑或 JSON 格式錯誤）";
              return;
            }

          // 🔥 相容不同回傳格式
          const data = raw?.data ?? raw;

          if (!Array.isArray(data)) {
            throw new Error("schema-list 格式錯誤");
          }

          /**
           * 3️⃣【流程】資料綁定完成
           */
          this.tableList = data;

          if (this.tableList.length > 0) {
            this.selectedTable = this.tableList[0].name;
            await this.loadSchema();
          }

        } catch (err) {
          this.errorMsg = "Schema 清單載入失敗";
          console.error(err);
        }
      },

      /**
       * 👉【事件】選單變更
       */
      async onTableChange() {
        await this.loadSchema();
      },

      /**
       * 2️⃣【流程】取得資料（單一 Schema）
       */
      async loadSchema() {

        this.errorMsg = "";
        this.schema = null;

        if (!this.selectedTable || this.selectedTable=="Default") return;
      const url = `/DB/schema/${this.selectedTable}.json`;//讓utilities.js自己補足位置20260426-3修
        try {

          const raw = await HIS.util.loadJSON(url);
          if(raw== undefined){
         console.log("1-沒有找到對應檔案");
         console.error("2-❌ loadJSON 失敗:URL=>", url);
         return;//跳出   
          }
          // 🔥 相容不同回傳格式
          const data = raw?.data ?? raw;

          if (!data || typeof data !== "object") {
            throw new Error("schema 格式錯誤");
          }

          //除錯用///
          console.log('Debug---START');
          console.log("SCHEMA RAW:", data);
          console.log("COLUMNS:", data?.columns);
          console.log('Debug---END');
          /**
           * 3️⃣【流程】資料綁定完成
           */
          this.schema = data;

        } catch (err) {
          this.errorMsg = `找不到 ${this.selectedTable} 對應的 Schema 資料`;
          console.error(err);
        }
      }

    }

  }).mount("#app");

})();

/*
- 👉【工具】統一取得 HIS 基礎路徑
*/
function getBasePath() 
{
  console.log("getBasePath...");
  
  // ✅ utilities 已經算好的 ROOT
  if (window.HIS?.util?.ROOT) 
    {
      return HIS.util.ROOT;
    }

  // 🔄 fallback（極少用到）
  const path = window.location.pathname;
  const idx = path.indexOf("/HIS");

  if (idx !== -1) {
    return path.substring(0, idx + 4);
  }

  return "";
}