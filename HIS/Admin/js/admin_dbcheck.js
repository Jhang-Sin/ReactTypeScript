document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("btnCheckDB");
  const resultDiv = document.getElementById("dbCheckResult");

  btn.addEventListener("click", async () => {

    resultDiv.textContent = "檢核中...";

    const result = await AdminDataService.checkDB();

    render(result);

  });

  function render(result) {

    if (!result.success) {
      resultDiv.innerHTML = `<span style="color:red;">${result.message}</span>`;
      return;
    }

    if (result.data.length === 0) {
      resultDiv.innerHTML = "✔ 無錯誤";
      return;
    }

    const table = document.createElement("table");

    table.innerHTML = `
      <tr>
        <th>等級</th>
        <th>資料表</th>
        <th>欄位</th>
        <th>訊息</th>
      </tr>
    `;

    result.data.forEach(row => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${row.level}</td>
        <td>${row.table}</td>
        <td>${row.field}</td>
        <td>${row.message}</td>
      `;

      table.appendChild(tr);
    });

    resultDiv.innerHTML = "";
    resultDiv.appendChild(table);
  }

});