# HtmlSample
# 📘 React + TypeScript 學習專案

這是一個用來學習 **React + TypeScript** 的練習專案，內容包含物件導向 (`interface`, `class`)、事件處理 (button, input, loading)、以及簡單的 `http.post` 範例。  
同時，本專案也會部署到 **GitHub Pages**，作為展示與學習紀錄。

---

## 🛠️ 開發環境需求
- [Node.js](https://nodejs.org/) (建議 LTS 版本，例如 20.x)
- [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/)
- [VS Code](https://code.visualstudio.com/)

---

## 🚀 專案安裝與啟動

```bash
# 下載專案
git clone https://github.com/你的帳號/react-typescript-learning.git

cd react-typescript-learning

# 安裝套件
npm install

# 啟動本地開發伺服器
npm start
---

開啟瀏覽器，進入 [http://localhost:3000](http://localhost:3000) 就能看到頁面。

---

## 🎯 學習任務表

### 🔹 第一階段：基礎
- [V] 建立 React + TypeScript 專案
- [V] 熟悉 VS Code 基本操作
- [ ] 建立第一個 Component（顯示文字）
- [ ] 在畫面上使用 props / state
- [ ] 練習事件（Button click、Input change）

---

### 🔹 第二階段：物件與型別
- [ ] 定義 `User` 型別（`interface`）
- [ ] 定義 `User` 類別（`class`）
- [ ] 使用 `User` 型別綁定輸入框
- [ ] 顯示 `User` 資料於畫面
- [ ] 學習 `export` 與 `import` 差異

---

### 🔹 第三階段：事件與 API
- [ ] 頁面 Loading 狀態控制
- [ ] 滑鼠事件（mouseover, click）
- [ ] 表單送出與驗證
- [ ] 使用 `fetch` or `axios` 實作 `http.post`
- [ ] 處理回傳 JSON 與錯誤控制

---

### 🔹 第四階段：展示與 GitHub
- [V] 建立 GitHub Repository
- [V] 撰寫 `README.md`
- [V] 使用 GitHub Pages 部署
- [ ] 測試與除錯
- [ ] 最終專案展示

---

## 🌍 GitHub Pages 部署

部署步驟：
1. 安裝 GitHub Pages 套件
   ```bash
   npm install gh-pages --save-dev
   ```
2. 修改 `package.json`
   ```json
   {
     "homepage": "https://你的帳號.github.io/react-typescript-learning",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```
3. 執行部署
   ```bash
   npm run deploy
   ```
4.開啟網址 [https://你的帳號.github.io/react-typescript-learning](https://你的帳號.github.io/react-typescript-learning)

---

## 📌 學習筆記
- `interface` 用來定義物件型別
- `class` 可同時包含屬性與方法，較接近 C# / Java 的寫法
- 使用 `props` 傳資料，`state` 管理元件狀態
- 事件處理使用 `onClick`, `onChange` 等
- HTTP 請求可用 `fetch` 或 `axios`

---

## 📜 授權
本專案僅供學習使用。


## 備註記事

- 忽略檔案放置位置-專案資料夾/.gitignore檔案
- 日誌記事位置- 跟目錄 /README.md檔案


## ===編譯備註===
- 1️⃣ 單檔編譯（沒有 tsconfig.json）
如果你只是單純要編譯某個檔案，例如 src/models/user.ts：
編譯指令如下:
tsc src/models/user . ts
✅ 你可以在專案根目錄或任何地方執行，但要給 完整路徑。
❌ 如果你只輸入 tsc user . ts，就必須要在 src/models/ 這個目錄下，否則會找不到檔案。 

2️⃣ 專案編譯（有 tsconfig.json）
通常 React + TypeScript 專案會在 專案根目錄 建立一個 tsconfig.json。
 這個檔案會定義：
來源檔案的位置 (include / files / exclude)

編譯輸出的資料夾 (outDir)

編譯規則（嚴格模式、ES 版本等等）

此時只要在 專案根目錄 輸入：
tsc


TypeScript 會自動依照 tsconfig.json 搜尋並編譯所有 .ts / .tsx 檔案。
✅ 優點：不用管檔案放在哪一層，統一由 tsconfig.json 管理。
 ❌ 缺點：需要先設定好 tsconfig.json。

3️⃣ 常見建議做法
在 React + TS 專案中：
學習階段 → 你可以先用單檔編譯 (tsc xxx.ts)。

專案開發 → 建議使用 tsconfig.json，然後在根目錄執行 tsc 或 tsc -w（監聽模式，自動編譯）。


# ===

📌 流程說明

.ts → tsc 編譯器 → .js → HTML

編譯：由 TypeScript 轉換成 JavaScript

輸出 JS：生成 .js 檔案供執行

HTML 使用：前端程式永遠引用 .js

⚠️ 檔案依賴關係

刪除 .ts → 仍能執行 .js，但失去原始碼維護能力

刪除 .js → 前端會報錯，必須用 tsc 重新編譯

# ===編譯語法===
指令(tsc)
單一檔案：
tsc 要編譯的ABC.ts

會輸出 ABC.js

# ===執行測試===
node 編譯出的ABC.js





# ===編譯前後簡易差異說明===
# TypeScript 與 JavaScript Enum 對照表

以下展示 TypeScript `enum` 在編譯後於 JavaScript 的輸出結果。

## 編譯前 TypeScript 原始碼
#ts
enum Color 
{
  Red,
  Green,
  Blue
}
## ===編譯後的 JavaScript
"use strict";
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));

console.log(Color.Red);   // 0
console.log(Color.Green); // 1
console.log(Color.Blue);  // 2


| 名稱  | TypeScript 寫法 | JavaScript 編譯結果 |
| ----- | ------------- | --------------- |
| Red   | `Color.Red`   | `0`             |
| Green | `Color.Green` | `1`             |
| Blue  | `Color.Blue`  | `2`             |


## ==== 運行專案===

.在下方'終端機'頁簽輸入下列指令
"npm run dev"

範例:專案路徑\專案名稱> npm run dev

後按下ENTER

會出現系統相關訊息
例如

  ROLLDOWN-VITE v7.1.12  ready in 1787 ms

  ➜  Local:   htt p ://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

再用瀏覽器開啟上述網頁及對應的port 即可看見網頁
備註:運行指令[npm run dev],運行的時候要在有"vite.config.js"檔案的這層
# ===


# ===
首頁的內容放在
my-react-app>src\app.tsx

裡面的第9行開始的
 return
 (

//--這邊是顯示的網頁內容//--
)
# ====


# ===《npm run deploy 與 git commit 對照教學》===

# 🚀 npm run deploy 與 git commit 對照教學

這份文件說明 React + TypeScript 專案使用 **GitHub Pages 部署** 時，  
`npm run deploy` 與一般的 Git 操作（如 `git commit`）之間的差別、用途與實務流程。

---

## 📦 一、整體流程說明

部署一個 React + TypeScript 專案到 GitHub Pages，通常包含兩個部分：

| 階段 | 說明 | 使用指令 |
|------|------|-----------|
| 🧩 開發階段 | 編寫、修改、測試你的程式碼 | `git add .`<br>`git commit -m "說明修改內容"` |
| 🚀 部署階段 | 將編譯完成的網站 (`dist` 資料夾) 發布到 GitHub Pages | `npm run deploy` |

---

## ⚙️ 二、git commit 與 npm run deploy 的差別

| 比較項目 | `git commit` | `npm run deploy` |
|-----------|---------------|------------------|
| 功能 | 將程式碼變更記錄在 **主分支** | 將編譯完成的網頁上傳到 **gh-pages 分支** |
| 影響範圍 | 專案原始碼 | 發布的靜態網站 |
| 是否可自訂訊息 | ✅ 可以 (`git commit -m "訊息"`) | ⚠️ 預設無法，但可改寫指令增加訊息 |
| 是否影響網站顯示 | ❌ 不會直接改變網站內容 | ✅ 直接更新 GitHub Pages 上的頁面 |
| 主要用途 | 版本控制與團隊協作 | 部署與更新展示網站 |

---

## 🧩 三、可自訂訊息的 `npm run deploy` 寫法

如果你希望在部署時附上自訂的訊息，
可以修改 `package.json` 中的 `scripts`：
##
```json
"scripts": {
  "deploy": "gh-pages -d dist -m \"Deploy: 更新首頁動畫效果\""
}


關於路徑問題:

🔹 正確、安全寫法
在 Vite 專案中，應該使用「相對路徑」或「正確 base URL」。
✅ 建議兩種方式：
✅ 方法1：相對路徑（最通用）
<a href="HIS/doc/structure-diagram.html" target="_blank">開啟說明</a>


✅ 方法2：動態 base 變數（React 中使用）
若是在 React 內寫：
--tsx--

<a href={`${import.meta.env.BASE_URL}HIS/doc/structure-diagram.html`} target="_blank">
  開啟說明
</a
*-*-*-*-*-*-*-*-*-*-*-*-*-*
這樣 Vite 在打包時會自動把
import.meta.env.BASE_URL 替換成 /ReactTypeScript/（或 /）
依照你的 vite.config.js 中的設定而定。
*-*-*-*-*-*-*-*-*-*-*-*-*-*



flowchart TD

A[網頁載入 login.html] --> B[執行 init() 初始化函式]

B --> C[讀取 UserList.txt 取得登入使用者]
C --> D[讀取 FunctionButtonList.txt 取得功能清單]
D --> E[篩選 status == 1 的啟用功能]
E --> F{使用者權限符合?}

F -->|是| G[建立 available 功能清單陣列]
F -->|否| H[顯示訊息: 查無可使用的系統功能]

G --> I[執行 available.forEach(f => {...})]
I --> J[建立 a 元素 (按鈕)]
J --> K[設定 a.href = f.page]
K --> L[設定 a.textContent = f.name]
L --> M[設定 a.className = "func-btn"]
M --> N[設定 a.target = "_blank"]
N --> O[funcDiv.appendChild(a)]

O --> P[頁面動態顯示功能按鈕完成]
H --> P
P --> Q[使用者可點擊進入各功能頁面]






-------





