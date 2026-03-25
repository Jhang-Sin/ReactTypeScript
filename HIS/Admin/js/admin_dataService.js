// 🔥 Service 層（未來 API 化的基礎）

const AdminDataService = {

  async checkDB(type = 0) {

    try {
      const result = await HIS.dbChecker.checkAll();

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

window.AdminDataService = AdminDataService;