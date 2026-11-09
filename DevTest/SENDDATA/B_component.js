// B 網頁的獨立元件
export class PageB extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div style="background-color: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 4px;">
                <h4>B 網頁內部</h4>
                <label class="lbl-b">B 狀態等待中</label><br><br>
                <input type="text" class="input-b" value="來自B的自訂內容" style="padding: 5px;">
                <button class="btn-b" style="padding: 5px 15px; cursor: pointer;">發送</button>
            </div>
        `;

        // 功能 B：點選自己網頁中的按鈕
        this.querySelector('.btn-b').addEventListener('click', () => {
            const value = this.querySelector('.input-b').value;
            const parentA = this.closest('#pageA'); // 偵測是否存在母框 A

            if (parentA) {
                // 如果被 A 載入，將資料顯示在 A 網頁的 id=infoA 上
                const infoA = parentA.querySelector('#infoA') || document.getElementById('infoA');
                if (infoA) infoA.innerText = `infoA: ${value}`;
            } else {
                // 單獨開啟時，走異常流程
                alert("無法呼叫母框");
            }
        });

        // 功能 C：保有接收 A 的觸發端口
        window.addEventListener('broadcast-from-a', () => {
            const lbl = this.querySelector('.lbl-b');
            if (lbl) lbl.innerText = "收到!!";
        });
    }
}
// 註冊自訂標籤
customElements.define('page-b', PageB);

/*

• customElements：這是瀏覽器內建的一個全域註冊表（Registry），用來管理網頁中所有的自定義標籤。
• .define(...)：這是註冊表的方法，用來告訴瀏覽器：「我要定義一個新的標籤囉！」
• 第一個參數 'page-b'：這是你為新標籤取的名字。
    • 註：根據 W3C 規範，自定義標籤的名字必須包含一個連字號（-）。這是為了與瀏覽器未來的原生 HTML 標籤（如 <main>、<article> 等單字標籤）做出區隔。
    • 第二個參數 PageB：這是一個 JavaScript 的 class（類別），裡面定義了這個新標籤的行為、樣式和生命週期（例如它被放到網頁上時要做什麼）。


一旦瀏覽器執行了這行程式碼，你就可以在 HTML 或 JavaScript 中像使用普通標籤（如 <div> 或 <p>）一樣來使用它：    
例如:<page-b></page-b>


在 JavaScript 中：
const myPage = document.createElement('page-b');
document.body.appendChild(myPage);
瀏覽器看到 <page-b> 時，就會自動對照你傳入的 PageB 類別，並執行裡面設定的功能。
這在建立重複使用的 UI 元件（如自訂彈出視窗、導覽列、或單頁應用的路由頁面）時非常有用。

*/