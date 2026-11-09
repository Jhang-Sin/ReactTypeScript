## Vue Data 與 JavaScript 變數

### 開發觀念

* `data()` 中宣告的資料，為 **Vue Reactive State（響應式狀態）**，Vue 會自動追蹤其變化並更新畫面。
* 一般 JavaScript 變數（如 `var`、`let`、`const`）不屬於 Vue 管理範圍，修改後不會自動更新 UI。
* 在 JavaScript 中存取 Vue 資料時，應使用 `this.xxx`；在 Template (`{{ }}`、`v-model`) 中則可直接使用變數名稱。

### 建議

避免在 `data()` 中宣告大量平面變數，建議依功能分組成物件，以提高可讀性與維護性。

**不建議：**

-javascript-
return {
    name: '',
    phone: '',
    address: '',
    status: 1
}


**建議：**

-javascript-
return {

    user: {
        name: '',
        phone: '',
        address: ''
    },

    search: {
        keyword: ''
    },

    ui: {
        isLoading: false,
        dialogVisible: false
    }

}


### 企業專案命名建議

* `user`：業務資料（Business Data）
* `search`：查詢條件
* `ui`：畫面狀態（Loading、Dialog、Toast...）
* `config`：固定設定值
* `permission`：權限資訊

### 開發心得（給自己的備忘）

Vue 不再使用 AngularJS 的 `$scope` 作為識別，而是以 **`data()` 作為 Reactive State 的入口**。閱讀程式時，優先查看 `data()`、`computed`、`methods` 等區塊，即可快速掌握此 Component（或 App）的資料、功能與狀態。


## 長期使用 C#、ASP.NET MVC 的習慣，我建議你的 Vue 都維持這種固定格式：
-----------------------------------
const app = Vue.createApp({
    data() {
        return {
            // 業務資料
            user: {},

            // 查詢條件
            search: {},

            // 畫面狀態
            ui: {},

            // 固定設定
            config: {}

        }
    },

    methods: {

    },

    computed: {

    },

    watch: {

    }

})

app.mount('#app')

-----------------------------------

## 

★!!★★!!★
Vue不再使用AngularJS的$scope作為識別，是以 data()作為Reactive State 的入口。
閱讀程式時，優先查看 data()、computed、methods 等區塊，即可快速掌握此 Component（或 App）的資料、功能與狀態。



------------------------------------------
# ⌨️ 鍵盤常用符號速查備忘錄

本機檢視、發佈平台皆通用的排版樣式。

| 符 號 | 中 文 名 稱 | 英 文 名 稱 | 鍵 盤 位 置 提 示 | 程 式 主 要 用 途 |
| :---: | :--- | :--- | :--- | :--- |
|   `   | 反單引號 / 重音符 | Backtick / Grave | 數字 `1` 的左邊 (Tab 上方) | JavaScript 範本字串（可帶入變數 `${}`） |
|       | | | | |
|   '   | 單引號 | Single quote | `Enter` 鍵的左邊 | 包裹傳統純字串（不支援帶入變數） |
|       | | | | |
|   ,   | 逗號 | Comma | 字母 `M` 的右邊 | 分隔陣列（Array）或物件（Object）內的資料 |

---
💡 **排版提示**：中間預留的空白列 `| | | | |` 可以在純文字環境下拉開距離，避免視覺擁擠；在正式發佈後也會保持美觀的表格間距。



-2026-06-29

