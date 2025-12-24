// ==============================
// admin maintain page controller
//- 20251224（防炸穩定版）
// ==============================

(function () {

  // === DOM 對照（集中管理，避免抓錯） ===
  const btnCheck = document.getElementById("btnCheckDB");
  const statusText = document.getElementById("statusText");
  const summaryText = document.getElementById("summaryText");
  const tableBody = document.getElementById("resultTableBody");

  if (!btnCheck || !statusText || !summaryText || !tableBody) {
    console.error("[maintain] required DOM not found");
    return;
  }

  // === UI Helper ===
  function setStatus(text) {
    statusText.textContent = text;
  }

  function clearTable() {
    tableBody.innerHTML = "";
  }

  function addRow(row) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.level}</td>
      <td>${row.table}</td>
      <td>${row.index !== null ? row.index : "-"}</td>
      <td>${row.field}</td>
      <td>${row.message}</td>
    `;

    // 簡單顏色提示
    if (row.level === "FATAL") tr.style.background = "#f8d7da";
    if (row.level === "ERROR") tr.style.background = "#fff3cd";
    if (row.level === "WARN")  tr.style.background = "#e2e3e5";

    tableBody.appendChild(tr);
  }

  // === 主流程 ===
  btnCheck.addEventListener("click", async () => {
    clearTable();
    summaryText.textContent = "";
    setStatus("檢核中…");

    try {
      setStatus("檢核資料表中…");

      const result = await HIS.dbChecker.checkAll();

      // 防炸：強制 rows 為陣列
      const rows = Array.isArray(result.rows) ? result.rows : [];

      setStatus("檢核完成");

      summaryText.textContent = result.summary || "（無摘要）";

      if (rows.length === 0) {
        addRow({
          level: "INFO",
          table: "-",
          index: null,
          field: "-",
          message: "未發現任何資料異常"
        });
        return;
      }

      rows.forEach(addRow);

    } catch (err) {
      console.error("[maintain] check failed", err);

      setStatus("檢核失敗");
      summaryText.textContent = "FATAL：檢核過程發生錯誤";

      addRow({
        level: "FATAL",
        table: "system",
        index: null,
        field: "-",
        message: err.message
      });
    }
  });

})();
