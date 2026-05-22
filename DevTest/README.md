
-此目錄為練習Vue語法使用
-使用Vue 3.x 版本



🔥 最關鍵一句話（務必記住）

一般 JS：
變數只是變數

Vue data：
Vue會追蹤的狀態資料

🎯 整理:

🔥data(){
    ....
    ....
}
👉 Vue 定義 reactive state 的地方
------------------

🔥return {
....
....
...
}

👉 固定寫法
👉 回傳資料物件給 Vue 管理
------------------

🔥var aaa='123'
👉 一般 JS 變數
👉 Vue 不一定會追蹤
data return 裡的變數
------------------

🔥data return 裡的變數
-👉 Vue 可監聽
-👉 UI 自動更新
-👉 可用：this.aaa 調用。
------------------

-------------
function定義完成 習慣要加一個','較方便
例如:

AAA()
{
    程式碼處理的事情..
    ..
}, /////','號
之後其他function 才可以繼續往下
BBB()
{
    ..
    ..
},
CCC()
{
    .
    .
    ..
},

//====20260519-STSRT====//
methods:{
  SaveData(){

  },
  CheckData(){
  }
}

本質是：
📦 JavaScript 物件（Object）
等同完整寫法:
methods:{
  SaveData: function(){
  },
  CheckData: function(){
  }
}
🧠 所以 methods 裡面其實是：
key : value
📌 JavaScript Object 規則：
Object 裡：
{
  aaa:123,
  bbb:456
}

每個屬性之間：
✅ 要用 , 分隔

-----------
methods:{
  A(){},
  B(){},
  C(){}
}

本質是：
A 與 B 之間
B 與 C 之間
需要逗號

🔥 最後一個為什麼可加可不加？

因為：
C(){}
}

後面已經沒有下一個屬性了

📌 JavaScript 允許：
{
  aaa:1,
  bbb:2,
}


最後多一個逗號。

這叫：
✅ Trailing Comma（尾逗號）

所以這兩種都合法

(1)
✅ 有尾逗號
methods:{
  A(){},
  B(){},
}

(2)
✅ 沒尾逗號
methods:{
  A(){},
  B(){}
}


🧠 為什麼不影響？

因為：}已經代表：
Object 結束
JS 已知道：沒有下一個屬性了


🔥 但這個不能少逗號:

❌ 錯誤如下
methods:{
  A(){}
  B(){}
}
因為 JS 會看到：A(){}B(){}
而
不知道怎麼切開。

🔥 「Vue 建立在 JavaScript Object 之上」

🔥 實務上很多工程師會：
故意保留最後逗號-如下:
methods:{
  A(){},
  B(){},
}

因為：以後新增：C(){}

Git diff 會比較乾淨。

//====-20260519-END-====//