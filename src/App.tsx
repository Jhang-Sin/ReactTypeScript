import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>      
      
      <a>點按鈕試試功能</a>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          <b><a>count is {count}</a></b>
        </button>  

        <button onClick={()=>alert('Hi~')} style={{marginLeft:'20px',backgroundColor:'blue',color:'white'}}>
          按鈕A
        </button>
      </div>   
      <h3><b>ReactTypeScript的測試網頁</b></h3> 
       <p className="read-the-docs">
        點擊上方  Vite 或 React LOGO 圖示 觀看更多相關資訊
      </p>    
      
      
    </>
  )
}

export default App

/*
關於"export default"的說明
是 ES Module（ESM）語法 中的一部分，用來 導出（export）這個 App 元件，讓其他檔案可以引用和使用這個元件。 
為什麼要 export default App？
這是為了讓其他檔案可以用這樣的方式引入 App：
[.tsx]
-------------

import App from './App';
------------- 
這裡的 App 就是從 App.tsx 檔案中 預設匯出（default export） 出來的元件。 

語法解析：export default
ES Modules 支援兩種匯出方式：
1.Named export（具名匯出）

[.tsx] 
export const App = () => { ... };
對應的匯入方式： 
[.tsx]
import { App } from './App';

2.Default export（預設匯出）
[.tsx]
const App = () => { ... };
export default App;

對應的匯入方式： 
[tsx]
import App from './App';
注意：一個檔案只能有一個 default export，但可以有多個 named exports。
==================

補充：為什麼使用 default export？
一個模組（檔案）中只有一個主要輸出時，用 default export 是一個清楚的語意。

引入時不需要使用大括號 {}，語法上較簡潔。

適合「主要元件」或「主要函式」的情境。
========= 
*/