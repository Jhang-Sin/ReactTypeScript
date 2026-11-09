# HIS Model 
將 JavaScript 的資料模型（Model）集中管理，而不是分散定義於各個 Vue Component 中。

每個 Model 負責：
定義資料欄位
提供預設值
統一欄位名稱
作為前後端 JSON 傳輸格式（DTO）

# Vue Component 不直接定義完整物件，而是建立 Model 
實例：

data() {
    return {
        user: createUser(),
        opd: createOPD()
    }
}

# 優點
- Model 集中管理，避免重複定義。
- 新增欄位只需修改一處。
- 所有引用該 Model 的畫面可同步取得新欄位與預設值。
- 統一前後端 JSON 結構，降低維護成本。
- 開發思維接近 C# new User()、new OPD()，容易與後端程式碼對照。

可採用 C#/.NET 工程師容易接受的架構，例如：
Model（資料模型）
Service（API 存取）
Utils（共用工具）
Component（畫面元件）
Page（頁面）
Store（共用狀態）
