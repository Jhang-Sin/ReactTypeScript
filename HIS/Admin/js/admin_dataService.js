// 🔥 Service 層（未來 API 化的基礎）

const AdminDataService = {

  ////方法（method）
  async checkDB(type = 0) {

    try {
      const result = await HIS.dbChecker.checkAll();

      //ResultData（回傳格式標準化）
      /*
      ✔ 不丟 exception（不讓程式炸）
      ✔ 統一轉成 ResultData
      ✔ UI 不需要 try/catch      
      */

      //errorCode 設計
      /*
      0→ 正常
      500→ 系統錯誤
      1001→ 資料錯誤

      未來角度:getErrorMessage("ADMIN", 1001);

      */
      
      return {
        success: true,
        errorCode: 0,
        message: "OK",
        data: result
      };

    } catch (err) {

      return {
        success: false,
        errorCode: 500,
        message: err.message,
        data: []
      };

    }
  },

  ////方法（method）
  async loadDB(fileName) {

    try {

      const url = `/DB/${fileName}`;
      const data = await HIS.util.loadJSON(url);

      return {
        success: true,
        data
      };

    } catch (err) {

      return {
        success: false,
        message: err.message
      };

    }
  }

};

window.AdminDataService = AdminDataService; //掛到全域（Global）讓 HTML/其他JS可存取