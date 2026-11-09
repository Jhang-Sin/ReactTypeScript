export function createUser()
{   
    //export class 匯出類別，使其能在其他模組中被 import 引用
    // 匯出類別 (User.js / User.ts)
    //create。不是固定寫法。只是一個自訂的函式名稱
    /*
    這是語法允許的：export function makeUser() 或
     export function buildUser()。
     它的本質：只是一個普通的函式（Function）。
     */

    return{

        uid: "",
        name: "",
        sex: "",
        birthday: "",
        address: "",
        phone: "",
        email: "AAAAA@123.com",
        notes: "",
        status: 1

    }

}

/*
工廠模式 (Factory Function)：不使用 new 關鍵字，直接呼叫函式來產生新物件。

export function createUser(name, age) {
  return {
    name: name,
    age: age,
    role: 'guest'
  };
}

EX:
API 請求 / 資料庫操作：在後端（如 Node.js）或前端發送請求，用來在資料庫中「新增」一筆使用者資料。
export function createUser(userData) {
  // 發送資料到資料庫或後端 API
  return db.users.insert(userData);
}

 */