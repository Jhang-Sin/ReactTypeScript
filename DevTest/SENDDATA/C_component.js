// C 網頁的獨立元件
export class PageC extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 4px;">
                <h4>C 網頁內部</h4>
                <label class="lbl-c">C 狀態等待中</label><br><br>
                <input type="text" class="input-c" value="來自C的自訂內容" style="padding: 5px;">
                <button class="btn-c" style="padding: 5px 15px; cursor: pointer;">發送</button>
            </div>
        `;

        // 功能 B：點選自己網頁中的按鈕
        this.querySelector('.btn-c').addEventListener('click', () => {
            const value = this.querySelector('.input-c').value;
            const parentA = this.closest('#pageA'); // 偵測是否存在母框 A

            if (parentA) {
                // 如果被 A 載入，將資料顯示在 A 網頁的 id=infoC 上
                const infoC = parentA.querySelector('#infoC') || document.getElementById('infoC');
                if (infoC) infoC.innerText = `infoC: ${value}`;
            } else {
                // 單獨開啟時，走異常流程
                alert("無法呼叫母框");
            }
        });

        // 功能 C：保有接收 A 的觸發端口
        window.addEventListener('broadcast-from-a', () => {
            const lbl = this.querySelector('.lbl-c');
            if (lbl) lbl.innerText = "收到!!";
        });
    }
}
// 註冊自訂標籤
customElements.define('page-c', PageC);
