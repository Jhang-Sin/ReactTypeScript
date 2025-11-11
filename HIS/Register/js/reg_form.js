// reg_form.js
function initRegForm() {
  const btn = document.getElementById("searchBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    console.log("[reg_form.js] 查詢按鈕被點擊");
    const mrNo = document.getElementById("mrNo").value.trim();
    if (!mrNo) {
      alert("請輸入病歷號！");
      return;
    }
    loadPatient(mrNo, true);
  });
}

initRegForm(); // 🚀 立即執行初始化
