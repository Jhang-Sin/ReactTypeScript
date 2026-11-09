1. modal.js

目前提供兩個 API：
HIS.modal.alert(message, title)
HIS.modal.confirm(message, onYes, onNo, title)
所以：
alert() → 一個「確定」按鈕
confirm() → 「是 / 否」兩個按鈕



--推薦 Promise。--

const result = await HIS.modal.confirm(...);

if (result === "continue") {
    // 下一個條件
}

if (result === "cancel") {
    // 結束
}

---------------------
乾淨很多。


二、目前 condition-config.js 的問題
現在：
morning: {
  Q1: ["A","B","C","D"],
  Q2: ["A","B","C","D"],
  ...
}

上午 + Q1 → 可以使用 A/B/C/D
-------
上午
 ├─ Q1 → A B C D
 ├─ Q2 → A B C D
 ├─ Q3 → A B C D
 ├─ Q4 → A B C D E F G
 └─ Q5 → A B C D E F G

下午
 ├─ Q1 → 1 3 5
 ├─ Q2 → 1 3 5
 ...
------

設定資料與程式邏輯分離
condition-config.js 不負責判斷，只負責告訴 Engine「規則是什麼」。

=================================================
----目前 condition-engine.js 的最大問題------

function checkAll(userType, timePeriodLabel, logicCheckFn){
  const rules = getConditions(userType, timePeriodLabel);

  for (const r of rules){
    const ok = logicCheckFn ? logicCheckFn(r) : true;

    if (!ok) return { ok:false, failedRule: r };
  }

  return { ok:true };
}

這是一個同步的全部判斷器。

也就是：
Q1 → 判斷
Q2 → 判斷
Q3 → 判斷
Q4 → 判斷
Q5 → 判斷

只要遇到：ok === false
就直接：return

所以它目前完全沒有辦法處理：
因為 Modal 是非同步的。


=================================================

建議的架構
modal.js
    ↓
負責 UI
    ↓
回傳使用者選擇
        │
        ▼
condition-engine.js
    ↓
負責流程控制
    ↓
一條一條執行
        │
        ▼
condition-config.js
    ↓
負責條件設定


其中最重要的是：
Engine 不應該知道「Q1 是什麼業務」

Engine 只知道：
目前有 5 個規則

Rule 1
Rule 2
Rule 3
Rule 4
Rule 5

至於：
Q1 = 什麼
Q2 = 什麼
以及：
什麼情況要跳 Modal
則由外面的 logicCheckFn 決定。

