
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

//====-0260625-START-====//
不是：
掛號Mod
醫令Mod
批價Mod

而是：
const HISApp = Vue.createApp({

})

只有一個 App。

裡面拆：
-RegisterComponent
-OrderComponent
-ChargeComponent

結構變成：
HISApp
 ├─ RegisterComponent
 ├─ OrderComponent
 └─ ChargeComponent


Vue.createApp()
≈ AngularJS Controller（初學階段可這樣理解）

Vue Component
≈ AngularJS 時代真正想要但做不到的模組化 Controller

之後學到 Component 時:
原來 Vue 不是要我建立很多 App
而是建立一個 App
裡面放很多 Component




//====-0260625-END-====//



//====-2026-10-05-START-====//

📊 前後端欄位位置對照圖
【前端 HTML 視角】

<!-- [1] selectedValue 綁定在最外層的 select，用來儲存最終結果 -->
<select v-model="selectedValue">

  <!-- 
    [2] options 是後端的大陣列，決定這行迴圈要跑幾次
    [3] item 是當前這一圈的「臨時分身」代稱
    [4] key 是給前端框架引擎看的效能標籤，通常綁定唯一值
    [5] value 是隱藏在標籤背後、被選中時會傳回給後端的實際數值
  -->
  <option 
    v-for="item in options" 
    :key="item.value" 
    :value="item.value">
    
    <!-- 這裡是使用者在畫面上真正看到的親切文字 -->
    {{ item.text }}
    
  </option>
</select>





【後端 JS 視角】

// 後端資料結構與前端的對應關係
{
  // [1] selectedValue：使用者的選擇結果會即時寫入這裡（預設選中 'banana'）
  selectedValue: 'banana', 

  // [2] options：這是下拉選單的原始清單（大陣列）
  options: [
    // 進入迴圈時，這每一個物件就是前端的 [3] item
    { value: 'apple',  text: '蘋果' }, // item.value 為 'apple', item.text 為 '蘋果'
    { value: 'banana', text: '香蕉' }, 
    { value: 'orange', text: '橘子' }
  ]
}



📝 前後端資料綁定核心筆記 (Select / Dropdown)
[1] selectedValue — 【當前選取儲存池】
• 角色定位：後端 JS 定義的變數（State / Data）。
• 白話說明：它是用來「記住使用者到底選了什麼」的格子。當使用者在前端畫面上切換選項時，選中的新數值會即時同步寫回這個變數；反之，若後端 JS 改變了這個變數的值，前端畫面也會自動跳到該選項。
[2] options — 【後端原始資料庫】
• 角色定位：後端 JS 定義的陣列（Array）。
• 白話說明：這是整個下拉選單的「資料源頭」，通常是一組包含多個物件的清單。前端 HTML 的迴圈指令（如 v-for 或 ng-repeat）就是拿這個陣列來決定畫面上「總共要畫出幾筆選項」。
[3] item — 【迴圈臨時分身】
• 角色定位：前端 HTML 迴圈中的暫存區域變數（Alias）。
• 白話說明：它不需要在後端定義。當前端拿著 options 陣列在畫面上畫選項時，每畫到其中一筆，那一筆資料在 HTML 裡就暫時叫做 item。它是用來在 HTML 內部分解出「當前這一格的 key、value 和顯示文字（text）」的代稱。
[4] key — 【前端效能追蹤貼紙】
• 角色定位：前端虛擬 DOM 引擎的識別標籤（Attribute）。
• 白話說明：這是給前端框架（Vue/React）內部的特殊記號。它通常會綁定 item 裡面具有「唯一性」的欄位（例如 ID 或不重複的 Value），或者是陣列的索引（Index）。目的是為了在後端資料改變時，讓前端能精準、快速地只更新有變動的 HTML 標籤，不重新刷洗整個頁面。
[5] value — 【背後隱藏的真實數值】
• 角色定位：前端 <option> 標籤的實際數值屬性。
• 白話說明：這是每個選項「骨子裡代表的值」。畫面上使用者看到的是親切的中文（如：蘋果），但當它被點選時，瀏覽器和後端真正接收並塞進 selectedValue 的，是這個 value 屬性設定的值（如：apple 或 1）




//====-2026-10-05-END-====//