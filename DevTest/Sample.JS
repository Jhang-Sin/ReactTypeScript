/*
撰寫JS的基本架構參考說明

 */
const app = Vue.createApp({
/*
 data-放置需要追蹤（reactive）的狀態資料
 -病患資料、掛號資料、查詢條件
 */
  data() {
    return {

            // ============================ 
            // 業務資料 (Business Data) 
            // // ==========================
            user: {
              uid: "",    // 身分證號 
              name: "",   // 姓名 
              sex: "",    // 性別 
              birthday:"",// 生日 
              age: 0,     // 年齡 
              phone: "",  // 電話 
              email: "",  // Email 
              address: "",// 地址 
              status: 1   // 狀態(1:有效 0:停用)
            },

           // ============================ 
           // 查詢條件 (Search Condition) 
           /// ============================
            search: {
              keyword: "", // 關鍵字 
              uid: "", // 身分證查詢 
              name: "", // 姓名查詢 
              status: "", // 狀態查詢 
              startDate: "", // 起始日期 
              endDate: "", // 結束日期 
              page: 1, // 目前頁數 
              pageSize: 20, // 每頁筆數 
              sortField: "", // 排序欄位 
              sortType: "ASC" // ASC/DESC
            },

           // ============================ 
           /// UI 畫面控制 
           /// ============================
            ui: {
              isLoading: false, // Loading 遮罩 
              isSaving: false, // 儲存中 
              dialogVisible: false, // Dialog 顯示 
              confirmVisible: false, // Confirm 顯示 
              toastVisible: false, // Toast 顯示 
              message: "", // 訊息內容 
              messageType: "", // success、warning、error 
              editMode: false, // 是否編輯模式 
              readOnly: false, // 唯讀模式 
              disabled: false // 是否停用
            },

          // ============================ 
          /// 系統設定 
          /// ============================
            config: {
              apiUrl: "/api/User",
              pageSize: 20,
              timeout: 30000,
              version: "1.0.0",
              debug: true
            },
            // ============================ 
            //  下拉選單資料 
            // ============================ 
            option:{
              sexList: [],
              departmentList: [],
              doctorList: [],
              statusList: [] 
              },
            // ============================ 
            // 表格資料
            // ============================ 
            table: { 
              rows: [],
              totalCount: 0,
              selectedRow: null 
            }

        }

  },

  /*
  methods-一般功能函式區
  -儲存、查詢、清除、驗證
  例如： 
  SaveData(){},
  ResetData(){},
  CheckData(){},
   */
  methods: {

  },

  /*
  computed-根據依賴值變更做計算處理
  姓名組合、總金額、年齡計算
   */
  computed: {

  },

  /*
  watch-監聽一個值變更
   */
  watch: {

  }

})

app.mount('#app')