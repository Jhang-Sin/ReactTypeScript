/*
- Schema 爛為對照設定檔（Data Dictionary）
- 欄位對照說明
- 20260406

[最外層顯示]
-表格名:{
description:資料表識別名
primaryKey:顯示PK值
[內容欄位顯示]
columns:{  }

}

*/
window.SchemaConfig = {

  schedule: {
    description: "門診排程資料表",
    primaryKey: "schedule_no",

    columns: {
      schedule_no: {
        label: "流水碼",
        description: "門診表序號",
        type:"int" ,
        key:"PK"
        
        
      },

      noon: {
        label: "午別",
        description: "午別代碼",
        type: "int",
        relation: "noon_type",
        key:""
      },

      status: {
        label: "狀態",
        description: "資料有效值",
        type: "ENUM",
        enum: {
          1: "有效",
          0: "無效"
        },
         key:"",
      }
    }
  },

  noon_type: {
    description: "午別代碼表",

    columns: {
      noon: {
        label: "午別代碼",
        description: "系統識別用"
      },
      time: {
        label: "開診時段",
        description: "實際開診時間區間"
      },
      value: {
        label: "顯示名稱",
        description: "前端畫面顯示文字"
      }
    }
  }

};