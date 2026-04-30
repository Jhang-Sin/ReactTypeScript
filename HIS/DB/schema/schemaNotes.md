JSON檔案格式對應說明:

撰寫順序:name/label/type/desc
對應順序:欄位名稱/畫面顯示-中文/型別/備註說明
"table"欄位對應為schema-list.json
schema-list.json內容為畫面下拉選單內容名稱

範例:
"table": "schema-doctors2",
  "columns": [
    {
      "name": "doctorId",
      "label":"醫師代碼",
      "type": "int",
      "desc": "醫師代碼"
    },
    { "name": "name",
    "label":"醫師姓名",
      "type": "String"     
    },
    {
        "name": "dept",
        "label":"科別代碼",
        "type": "int",
        "desc": "醫師次專科",
        "description":"對應depcode.json"
       
    }  
  ]
