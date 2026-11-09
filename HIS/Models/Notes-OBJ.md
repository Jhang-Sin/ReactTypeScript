# 關於 export class

在 JavaScript 或 TypeScript 中，export class 語法用於匯出類別，使其能在其他模組中被 import 引用。主要分為具名匯出（Named Export）與預設匯出（Default Export）兩種方式。


1. 具名匯出 (Named Export)
適合在一個檔案中匯出多個類別或變數。
匯入時必須使用大括號 { } 並指定相同的名稱。

-[typescript]-
---------------------------------------

// 匯出類別 (User.js / User.ts)
export class User {
  constructor(name) {
    this.name = name;
  }
}

// 匯入並使用 (main.js / main.ts)
import { User } from './User.js';
const myUser = new User('Alice');

---------------------------------------



2. 預設匯出 (Default Export)
若檔案主要提供單一核心類別，通常使用預設匯出。匯入時不需要大括號 { }，且可以自訂匯入的變數名稱。
-[typescript]-
--------------------------------
// 匯出類別 (Database.js / Database.ts)
export default class Database {
  connect() {
    console.log('Connected');
  }
}

// 匯入並使用 (main.js / main.ts)
import DB from './Database.js';
const db = new DB();
db.connect();
--------------------------------

#說明

export function createUser()
{
   
}
這段來說
不是固定寫法，但它是開發者之間非常普遍的命名習慣

1. 「create」是固定寫法嗎？不是固定寫法。JavaScript 或 TypeScript 沒有規定建立物件一定要用 create。這只是一個自訂的函式名稱。
-這是語法允許的：export function makeUser() 或 export function buildUser()。

-它的本質：只是一個普通的函式（Function）。
2. 它的目的是建立一個 User 物件嗎？
是的，通常是。看到這種命名，任何程式設計師都會預期這個函式的職責是：建立並返回一個與「使用者（User）」相關的資料或物件。

兩個常見情境：
- 情境1 
工廠模式 (Factory Function)：不使用 new 關鍵字，直接呼叫函式來產生新物件。
--------------------------------
javascriptexport function createUser(name, age) {
  return {
    name: name,
    age: age,
    role: 'guest'
  };
}
--------------------------------

- 情境2 
API 請求 / 資料庫操作：在後端（如 Node.js）或前端發送請求，用來在資料庫中「新增」一筆使用者資料。
--------------------------------
export function createUser(userData) {
  // 發送資料到資料庫或後端 API
  return db.users.insert(userData);
}
--------------------------------

[---------其他細項------------]
JavaScript 慣例的命名方式（camelCase）
return {
    opdId: 0,
    opdDate: null,
    status: false,
    patientCount: 0,
    doctorCode: "",
    departmentCode: "",
    note: ""
}
和 C# 的 PascalCase（如 OpdId、Status）不同，但卻是 JavaScript 生態系最普遍的寫法。當你之後使用 Vue、React 或各種第三方函式庫時，閱讀別人的程式碼會更自然，也比較符合團隊開發的慣例。

[---------其他細項END------------]


avaScript 會自動判斷：

| 初始值        | 推斷型別 |
| --------------| ------- |
| ""            | String  |
| 'ABC'         | String  |
| 0             | Number  |
| 123           | Number  |
| true /false   | Boolean |
| []            | Array   |
| {}            | Object  |
| null          | null    |
| new Date()    | Date    |
