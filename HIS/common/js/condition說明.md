# HIS Condition Framework

## 多重條件判斷與確認視窗使用說明

---

## 1. 功能說明

本模組用於處理 HIS 系統中的多重條件判斷流程。

主要功能：

* 不同使用者身分套用不同條件
* 不同時段套用不同條件
* 條件依設定順序逐一執行
* 條件不符合時顯示確認視窗
* 使用者選擇「繼續」後執行下一個條件
* 使用者選擇「取消」後立即停止整個判斷流程
* 一般提示訊息使用「確認」按鈕
* 支援非同步條件判斷
* 未來可擴充 API、TypeScript、React、Audit Log 等功能

目前主要由三個 JavaScript 檔案組成：

text
HIS/
└── common/
    └── js/
        ├── modal.js
        ├── condition-config.js
        └── condition-engine.js


---

# 2. 整體架構

目前建議的責任分工如下：
 使用者 / HIS 畫面
        │
        ▼
┌───────────────────┐
│ condition-engine  │
│                   │
│ 條件流程控制       │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ condition-config  │
│                   │
│ 條件設定           │
└───────────────────┘
              │
              │ 需要提示
              ▼
┌───────────────────┐
│      modal        │
│                   │
│  Confirm          │
│  繼續 / 取消       │
│  Alert            │
│  確認             │
└───────────────────┘
另外，真正的業務判斷建議由外部的 `logicCheckFn` 負責：

condition-engine
       │
       │ 呼叫
       ▼
logicCheckFn
       │
       ├── 前端資料判斷
       ├── API
       ├── 後端
       ├── 權限
       ├── 病人資料
       └── 其他 HIS 業務邏輯
---

# 3. 三個 JavaScript 檔案的責任

## 3.1 modal.js

負責：
* 建立 Modal
* 顯示 Modal
* 處理使用者按鈕
* 回傳使用者操作結果

不負責：
* 判斷 Q1、Q2 等身分
* 判斷業務條件
* 決定下一個條件

---

## 3.2 condition-config.js

負責：
* 定義不同時段的條件
* 定義不同身分使用哪些條件
* 定義條件執行順序

不負責：
* 執行條件
* 操作 Modal
* API 呼叫
* 業務邏輯
---

## 3.3 condition-engine.js

負責：
* 根據身分取得條件
* 根據時段取得條件
* 依序執行條件
* 等待非同步判斷
* 顯示確認流程
* 處理「繼續」
* 處理「取消」
* 回傳最後執行結果

不負責：
* 直接操作大量 HTML
* 寫死 HIS 業務規則
* 決定 Modal 的視覺樣式
---

# 4. 目前 condition-config.js

目前的設定格式：
window.HIS = window.HIS || {};

HIS.conditions = {
  morning: {
    Q1: ["A", "B", "C", "D"],
    Q2: ["A", "B", "C", "D"],
    Q3: ["A", "B", "C", "D"],
    Q4: ["A", "B", "C", "D", "E", "F", "G"],
    Q5: ["A", "B", "C", "D", "E", "F", "G"]
  },

  afternoon: {
    Q1: ["1", "3", "5"],
    Q2: ["1", "3", "5"],
    Q3: ["1", "3", "5"],
    Q4: ["A", "B", "C", "D", "E", "F", "G"],
    Q5: ["A", "B", "C", "D", "E", "F", "G"]
  }
};
---

# 5. 條件設定的意義

例如：
-javascript-
morning: {
  Q1: ["A", "B", "C", "D"]
}

代表：

> Q1 身分在上午，需要依序執行 A、B、C、D 四個條件。

執行順序：
A
↓
B
↓
C
↓
D

如果 A 不符合：
A
↓
顯示確認視窗
使用者
繼續

則：
A
↓
B
如果使用者：
取消
A
↓
取消
↓
結束

B、C、D 都不會再執行。
---

# 6. modal.js

目前 Modal 提供兩種主要功能。
---

## 6.1 Alert

單一按鈕：

┌──────────────────────┐
│         提示         │
│                      │
│     這是一段訊息      │
│                      │
│           [確認]     │
└──────────────────────┘
用途：

* 一般提示
* 完成通知
* 錯誤訊息
* 不需要使用者選擇是否繼續

建議 API：
-
-javascript-
await HIS.modal.alert(
  "所有條件皆已完成。",
  "判斷完成"
);


---
## 6.2 Confirm

兩個按鈕：
┌──────────────────────┐
│         確認          │
│                      │
│ 是否繼續下一個判斷？  │
│                      │
│    [繼續]    [取消]   │
└──────────────────────┘


建議 API：

-javascript-
const answer =
  await HIS.modal.confirm(
    "條件尚未符合，是否繼續？",
    "確認"
  );

結果：

-javascript-
"continue"


或：
-javascript-
"cancel"
---

# 7. 為什麼建議 Modal 使用 Promise

原本 callback 方式：

-javascript-
HIS.modal.confirm(
  "是否繼續？",

  function () {
    // 繼續
  },

  function () {
    // 取消
  }
);


如果條件很多，容易變成：
-javascript-

HIS.modal.confirm(
  "...",

  function () {

    HIS.modal.confirm(
      "...",

      function () {

        HIS.modal.confirm(
          "...",

          function () {

          }

        );

      }

    );

  }
);


這會形成 Callback Hell。

---

## 建議改成 Promise

const answer =
  await HIS.modal.confirm(
    "是否繼續？",
    "確認"
  );

if (answer === "continue") {

  // 繼續

}

if (answer === "cancel") {

  // 取消

}


搭配 async / await 後，多重條件流程會容易閱讀很多。


# 8. condition-engine.js

Condition Engine 是整個功能的核心。

主要 API：

HIS.conditionEngine.getConditions(
  userType,
  timePeriodLabel
);


以及：
HIS.conditionEngine.checkAll(
  userType,
  timePeriodLabel,
  logicCheckFn
);


---

# 9. getConditions()

使用：

const rules =
  HIS.conditionEngine.getConditions(
    "Q1",
    "上午"
  );


結果：
[
  "A",
  "B",
  "C",
  "D"
]




## 參數

### userType

使用者身分，例如：
Q1
Q2
Q3
Q4


目前支援：
上午
下午


# 10. checkAll()

基本使用：
const result =
  await HIS.conditionEngine.checkAll(
    "Q1",
    "上午",
    async function(rule) {

      // 實際條件判斷

      return true;

    }
  );



# 11. logicCheckFn

`logicCheckFn` 是實際業務判斷的地方。

例如：

async function logicCheckFn(rule) {

  if (rule === "A") {
    return false;
  }

  return true;
}

代表：
A → 不通過
B → 通過
C → 通過
D → 通過


Engine 不需要知道 A 到底代表什麼。

例如 A 可以是：
病人年齡

也可以是：
使用者權限
甚至：
是否有某項醫療資料

Engine 只需要知道：
true  → 通過
false → 不通過

# 12. 多重條件完整流程

假設：
Q1: ["A", "B", "C", "D"]

執行：
A
│
├── 通過
│
▼
B
│
├── 不通過
│
▼
顯示 Modal


畫面：
┌────────────────────────────┐
│          條件 B             │
│                            │
│ 條件 B 尚未通過，           │
│ 是否繼續下一個判斷？        │
│                            │
│    [繼續]        [取消]     │
└────────────────────────────┘

## 12.1 使用者按「繼續」

流程：
A
↓
B
↓
Modal
↓
繼續
↓
C
↓
D
↓
完成


## 12.2 使用者按「取消」

流程：
A
↓
B
↓
Modal
↓
取消
↓
結束


此時：
C
D

都不會執行。

# 13. 為什麼 Engine 必須使用 async / await

因為 Modal 是非同步操作。

例如：
const answer =
  await HIS.modal.confirm(
    "是否繼續？",
    "確認"
  );

程式會等待使用者操作。

[繼續]
才會繼續。

使用者按：
[取消]

則可以停止。

因此條件流程適合：
for (const rule of rules) {

  const result =
    await logicCheckFn(rule);

}

---

# 14. 不建議使用 forEach

不建議：
rules.forEach(async function(rule) {

  await logicCheckFn(rule);

});


因為 `forEach()` 不會等待每個 `async` callback 完成。

可能變成：
A ────────┐
B ────────┤ 同時執行
C ────────┤
D ────────┘


這與我們需要的：
A
↓
等待
↓
B
↓
等待
↓
C
↓
等待
↓
D
不同。

因此應使用：
for (const rule of rules) {

  await logicCheckFn(rule);

}


# 15. 完整使用範例

async function startCheck() {

  const userType = "Q1";

  const timePeriod = "上午";

  const result =
    await HIS.conditionEngine.checkAll(

      userType,

      timePeriod,

      async function(rule) {

        return await checkBusinessRule(rule);

      }

    );


  if (result.cancelled) {

    console.log("使用者取消");

    return;

  }


  if (result.ok) {

    await HIS.modal.alert(
      "所有條件皆完成",
      "判斷完成"
    );

  }
}

# 16. API 非同步判斷

未來如果條件需要呼叫後端：

async function checkBusinessRule(rule) {

  const response =
    await fetch(
      `/api/check-condition?rule=${rule}`
    );


  const data =
    await response.json();


  return data.passed;
}

Engine 不需要知道 API 細節。

只需要：
const passed =
  await logicCheckFn(rule);


# 17. 建議的錯誤處理

正式 環境不建議只處理：
javascript
true
false

也需要處理：

* API 失敗
* 網路錯誤
* 後端錯誤
* Timeout
* 未預期例外

例如：
javascript
async function checkBusinessRule(rule) {

  try {

    const response =
      await fetch(
        /api/check-condition?rule=${rule}
      );


    if (!response.ok) {

      throw new Error(
        "API request failed"
      );

    }


    const data =
      await response.json();


    return data.passed;

  }
  catch (error) {

    console.error(error);

    await HIS.modal.alert(
      "條件判斷發生錯誤，請稍後再試。",
      "系統錯誤"
    );


    throw error;

  }

}


# 18. 目前架構的責任分工

| 模組                  | 負責事項  |
| --------------------- | -------- |
| modal.js            | Modal UI |
| condition-config.js | 條件設定  |
| condition-engine.js | 條件流程  |
| logicCheckFn        | 業務判斷  |
| HTML / React        | 畫面      |

建議遵守：
Modal
↓
只負責 UI

Config
↓
只負責設定

Engine
↓
只負責流程

Business Logic
↓
只負責業務判斷

React / HTML
↓
只負責畫面


# 19. 未來擴充方向

## Phase 1：Config 支援 Modal 類型

目前：
Q1: ["A", "B", "C"]


未來建議：
Q1: [

  {
    id: "A",

    type: "confirm",

    message:
      "條件 A 尚未符合，是否繼續？"
  },

  {
    id: "B",

    type: "alert",

    message:
      "條件 B 已完成。"
  },

  {
    id: "C",

    type: "confirm",

    message:
      "條件 C 有警告，是否繼續？"
  }

]


如此可以由 Config 決定 Modal 類型。



# 20. Phase 2：條件增加名稱與說明

建議：
{
  id: "A",

  name: "病人年齡檢查",

  type: "confirm",

  message:
    "病人年齡不符合標準，是否繼續？"
}


Log 可以顯示：
開始判斷：病人年齡檢查


而不是：
開始判斷：A
對 HIS 維護人員比較容易理解。



# 21. Phase 3：Config 支援執行策略

例如：

{
  id: "A",

  type: "confirm",

  onFail: "confirm",

  message:
    "條件 A 不符合，是否繼續？"
}


也可以：

{
  id: "B",

  type: "alert",

  onFail: "stop",

  message:
    "條件 B 不符合，無法繼續。"
}


可以定義：

confirm
↓
繼續 / 取消

alert
↓
確認後繼續

stop
↓
直接停止




# 22. Phase 4：支援 API 非同步條件

流程：
Condition
    ↓
Business Logic
    ↓
API
    ↓
Backend
    ↓
Database
    ↓
回傳結果
    ↓
Condition Engine
    ↓
Modal


例如：

const passed =
  await checkBusinessRule(rule);


Engine 本身不需要知道資料來自哪裡。



# 23. Phase 5：支援更多時段

目前：
morning
afternoon


未來可增加：
morning
afternoon
evening
night


也可以：

weekday
weekend
holiday


或者改成實際時間範圍：

{
  start: "08:00",
  end: "12:00"
}



# 24. Phase 6：身分與時段分離

目前：


morning: {
  Q1: [...],
  Q2: [...]
}


未來可以：

{
  userType: "Q1",

  timePeriod: "morning",

  rules: [...]
}


甚至：

{
  roles: ["Q1", "Q2"],

  timePeriods: [
    "morning",
    "afternoon"
  ],

  rules: [...]
}


可以避免大量重複設定。


# 25. Phase 7：支援條件群組

當條件開始出現：
A AND B

或：
A OR B


就需要支援群組。

例如：

{
  type: "group",

  operator: "AND",

  rules: [

    {
      id: "A"
    },

    {
      id: "B"
    }

  ]
}


也可以：

{
  type: "group",

  operator: "OR",

  rules: [

    {
      id: "A"
    },

    {
      id: "B"
    }

  ]
}


這樣就能從：
A
↓
B
↓
C


擴充成：

       ┌── A
開始 ──┤
       └── B
          │
          ▼
          C


---

# 26. Phase 8：完整執行結果

目前：

{
  ok: true
}


未來建議：
{
  ok: false,

  cancelled: true,

  failedRule: "B",

  completedRules: [
    "A"
  ],

  skippedRules: [
    "C",
    "D"
  ]
}

好處：
* UI 可以知道失敗位置
* 可以顯示執行結果
* 可以寫 Log
* 可以進行除錯
* 未來可以做 Audit Trail


# 27. Phase 9：執行紀錄

建議記錄：
{
  rule: "A",

  status: "passed",

  time: "2026-08-24 10:30:00"
}


或：
{
  rule: "B",

  status: "cancelled",

  time: "2026-08-24 10:31:20"
}
```

最後可以得到：

```text
A → PASS
B → CANCEL
C → SKIP
D → SKIP
```

對 HIS 系統的稽核與問題追蹤非常有價值。

---

# 28. Phase 10：防止重複執行

使用者可能快速點擊：

開始判斷
開始判斷
開始判斷


這可能造成三個 Engine 同時執行。

建議加入：
let isRunning = false;


開始：

if (isRunning) {
  return;
}
isRunning = true;


結束：
isRunning = false;


也可以直接讓 UI Button 在執行期間：
<button disabled>


避免重複啟動。

---

# 29. Phase 11：Modal 防止重複建立

原本 Modal 使用：
document.getElementById("m_ok")


存在一個潛在問題。

如果同時存在兩個相同 ID：
<button id="m_ok">
<button id="m_ok">


就可能操作到錯誤的元素。

建議改成：
box.querySelector("#m_ok")

讓每個 Modal 只操作自己的 DOM。

更進一步可以完全取消固定 ID，改用：

const button = box.querySelector(".modal-confirm");


---

# 30. Phase 12：Modal XSS 安全性

目前如果使用：
box.innerHTML =<p>${message}</p>;


而 `message` 來自：

* API
* 後端
* 資料庫
* 使用者輸入

可能產生 XSS 風險。

例如：
message = userInput;

不建議直接：
innerHTML


建議使用：
element.textContent = message;


例如：
const titleElement =
  document.createElement("h3");

titleElement.textContent = title;


const messageElement =
  document.createElement("p");

messageElement.textContent = message;


正式 HIS 系統應優先採用此方式。

---

# 31. Phase 13：TypeScript 化

目前使用：
window.HIS

例如：
window.HIS.modal


如果未來正式整合 React + TypeScript，建議逐步改成：

src/
├── common/
│   ├── modal/
│   │   └── modal.ts
│   │
│   └── condition/
│       ├── condition-config.ts
│       ├── condition-engine.ts
│       └── condition-types.ts


---

# 32. TypeScript 型別建議

例如：

export type ModalResult =
  | "continue"
  | "cancel";


Condition：

export interface ConditionRule {

  id: string;

  type:
    | "alert"
    | "confirm";

  message: string;

}


Result：

export interface ConditionResult {

  ok: boolean;

  cancelled: boolean;

  failedRule?: string;

}


如此可以降低型別錯誤。

例如：
typescript
rule.tyep

會在編譯時被發現。

---

# 33. Phase 14：React 化

如果正式整合 React，建議不要繼續使用：
document.createElement()

直接建立 Modal。

建議架構：

React
│
├── ConditionPage
│
├── ConditionEngine
│
└── ModalProvider

流程：
ConditionPage
      │
      ▼
ConditionEngine
      │
      ▼
需要 Modal
      │
      ▼
ModalProvider
      │
      ▼
React Modal

Engine 負責：流程
React 負責：UI


---

# 34. 建議最終架構

如果這套功能未來會成為 HIS 共用元件，建議演進成：

                    React / HIS Page
                           │
                           ▼
                  ┌─────────────────┐
                  │ ConditionEngine │
                  └────────┬────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
      Condition Config            Business Logic
              │                         │
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
                    Condition Result
                           │
                           ▼
                    Modal Controller
                           │
                           ▼
                      React Modal


---

# 35. 建議開發階段

不建議一次全部改掉。

建議依照以下順序進行。

---

## Phase 1

### Promise Modal

先完成：

Promise Modal
+
async Condition Engine
+
現有 Config


這是目前最重要的改善。

---

## Phase 2

### Config 驅動 Modal

將：
["A", "B", "C"]

改成：
[
  {
    id: "A",
    type: "confirm",
    message: "..."
  }
]

讓條件設定決定 Modal 類型。

---

## Phase 3

### API + 完整 Result + Log

加入：

API 非同步判斷
+
完整執行結果
+
執行 Log


---

## Phase 4

### 穩定性

加入：

防止重複執行
+
Timeout
+
錯誤處理
+
Modal 防重複


---

## Phase 5

### TypeScript

逐步移除：
window.HIS


改成：

import / export


---

## Phase 6

### React

最後再將 Modal UI 移植成 React Component。

---

# 36. 最終設計原則

這套 Framework 建議遵守以下原則。

---

## 原則一：Config 不負責執行

Config 只描述：
有什麼規則


不負責：
怎麼執行


---

## 原則二：Engine 不負責畫面

Engine 只負責：

執行順序
+
流程控制
```

不要在 Engine 中大量操作：

document.querySelector()
document.createElement()
innerHTML


---

## 原則三：Modal 不負責業務

Modal 只負責：
text
顯示訊息

取得使用者選擇


不要讓 Modal 知道：
Q1
Q2
A
B
C
病人資料
權限
```

---

## 原則四：Business Logic 獨立

實際判斷交給：
logicCheckFn


例如：

async function logicCheckFn(rule) {

  // HIS 業務邏輯

  return true;

}
```

---

## 原則五：流程使用 async / await

多重確認流程：

```text
Rule A
  ↓
await Modal
  ↓
Rule B
  ↓
await Modal
  ↓
Rule C

使用 `async / await` 比大量 callback 更容易維護。

---

# 37. 建議的最終資料結構

未來較完整的 Condition Config 可以設計成：

{
  userType: "Q1",

  timePeriod: "morning",

  rules: [

    {
      id: "A",

      name: "病人年齡檢查",

      type: "confirm",

      message:
        "病人年齡不符合標準，是否繼續？"
    },

    {
      id: "B",

      name: "權限檢查",

      type: "alert",

      message:
        "權限檢查完成。"
    }

  ]
}


這樣未來的 Engine 可以完全不需要知道：

A 是什麼
B 是什麼


只需要依設定執行。

---

# 38. 最終流程

理想的完整流程：

使用者
  │
  ▼
選擇身分
  │
  ▼
選擇 / 判斷時段
  │
  ▼
Condition Config
  │
  ▼
取得 Rules
  │
  ▼
Rule 1
  │
  ▼
Business Logic
  │
  ├── 通過 ──────────────┐
  │                       │
  └── 不通過              │
       │                  │
       ▼                  │
     Modal                │
       │                  │
   ┌───┴────┐             │
   │        │             │
繼續       取消            │
   │        │             │
   │        └──────→ 結束 │
   │                      │
   ▼                      │
Rule 2 ◄──────────────────┘
   │
   ▼
...
   │
   ▼
所有條件完成
   │
   ▼
Result
   │
   ▼
完成
```

---

# 39. 未來最終目標

這套模組最終應該成為一個通用的：

> **HIS Condition Framework**

新增業務規則時，理想情況只需要修改：

```text
Condition Config
+
Business Logic
```

而不需要一直修改：

```text
Condition Engine
+
Modal
```

例如新增：

```text
Q6
```

只需要增加：

```javascript
Q6: [
  "A",
  "B",
  "C"
]
```

或未來：

```javascript
Q6: [
  {
    id: "A",
    type: "confirm",
    message: "..."
  }
]
```

Engine 本身不需要修改。

---

# 40. 總結

目前的三支 JS 已經具備良好的基礎架構：

```text
modal.js
    ↓
UI

condition-config.js
    ↓
設定

condition-engine.js
    ↓
流程

logicCheckFn
    ↓
業務邏輯
```

目前最重要的改善：

```text
原本：

checkAll()
    ↓
同步 for
    ↓
遇到 false 就 return
```

改成：

```text
checkAll()
    ↓
async for...of
    ↓
執行條件
    ↓
await Modal
    ↓
使用者選擇
    │
    ├── 繼續 → 下一條件
    │
    └── 取消 → 結束
```

後續可以逐步演進：

```text
目前 JavaScript
       │
       ▼
Promise Modal
       │
       ▼
Async Condition Engine
       │
       ▼
Config 驅動 Modal
       │
       ▼
API 非同步判斷
       │
       ▼
完整 Result / Log
       │
       ▼
錯誤處理 / Timeout
       │
       ▼
防止重複執行
       │
       ▼
TypeScript
       │
       ▼
React Modal
       │
       ▼
完整 HIS Condition Framework
```

最終目標是讓：

```text
設定
流程
業務邏輯
UI
```

彼此分離。

如此未來即使條件從 5 個增加到 50 個、100 個，甚至不同 HIS 功能共用同一套 Condition Engine，也能維持較低的維護成本。

---

# 41. 建議檔案結構

JavaScript 版本：

```text
HIS/
└── common/
    ├── js/
    │   ├── modal.js
    │   ├── condition-config.js
    │   ├── condition-engine.js
    │   └── README.md
    │
    └── css/
        └── modal.css
```

未來 TypeScript / React 版本：

```text
src/
├── common/
│   ├── modal/
│   │   ├── Modal.tsx
│   │   ├── modal-service.ts
│   │   └── modal-types.ts
│   │
│   └── condition/
│       ├── condition-config.ts
│       ├── condition-engine.ts
│       ├── condition-types.ts
│       ├── condition-runner.ts
│       └── condition-result.ts
│
└── pages/
    └── condition/
        └── ConditionPage.tsx
```

---

# 42. 建議版本管理

如果這套 Framework 未來會被多個 HIS 功能共用，建議開始使用版本號。

例如：

```text
v1.0.0
```

目前 JavaScript 版本。

```text
v1.1.0
```

加入 Promise Modal。

```text
v1.2.0
```

加入 Config 驅動 Modal。

```text
v2.0.0
```

TypeScript / React 版本。

建議重大 API 修改時增加 Major Version：

```text
v1.x.x
↓
v2.x.x
```

避免既有 HIS 功能因共用元件修改而受到影響。

---

# 43. 目前建議優先事項

如果要正式投入 HIS 專案，優先順序建議如下：

1. **將 Modal 改成 Promise API**
2. **Condition Engine 改為 `async / await`**
3. **使用 `for...of` 依序執行**
4. **確認「取消」可以立即停止**
5. **避免 Modal 使用全域固定 ID**
6. **避免 Modal 使用不安全的 `innerHTML`**
7. **加入錯誤處理**
8. **加入防止重複執行**
9. **Config 改成可描述 Modal 類型**
10. **加入完整 Condition Result**
11. **加入執行 Log / Audit Trail**
12. **最後再進行 TypeScript / React 化**

可以降低一次大幅改寫造成的風險，也能讓目前已經使用這套 JS 的 HIS 功能逐步移轉。

未來方向

Promise Modal → Async Condition Engine → Config 驅動 → 完整 Result → TypeScript → React
