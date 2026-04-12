/*
- Schema爛為對照檔（Data Dictionary）-框
- table欄位設定
-20260406
*/
(function () {

  const tableSelect = document.getElementById("tableSelect");
  const tableInfo = document.getElementById("tableInfo");
  const schemaTable = document.getElementById("schemaTable");

  init();

  function init() {
    const tables = Object.keys(window.SchemaConfig);

    // 填入下拉
    tables.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      tableSelect.appendChild(opt);
    });

    // 預設第一張
    if (tables.length > 0) {
      render(tables[0]);
    }

    tableSelect.addEventListener("change", () => {
      render(tableSelect.value);
    });
  }

  function render(tableName) {
    const schema = window.SchemaConfig[tableName];

    if (!schema) return;

    renderTableInfo(tableName, schema);
    renderColumns(schema.columns);
  }

  function renderTableInfo(name, schema) {
    tableInfo.innerHTML = `
      <div class="card">
        <h3>📄 ${name}</h3>
        <p>${schema.description || ""}</p>
        ${schema.primaryKey ? `<p><b>Primary Key：</b>${schema.primaryKey}</p>` : ""}
      </div>
    `;
  }

  function renderColumns(columns) {
    let html = `
      <table class="table">
        <thead>
          <tr>
            <th>欄位</th>
            <th>名稱</th>
            <th>說明</th>
            <th>型別</th>
            <th>Primary</th>
            <th>備註</th>
           
          </tr>
        </thead>
        <tbody>
    `;

    for (const key in columns) {
      const col = columns[key];

      html += `
        <tr>
          <td>${key}</td>
          <td>${col.label || ""}</td>
          <td>${col.description || ""}</td>
          <td>${col.type || ""}</td>
          <td>${col.Key || ""}</td>
          <td>${renderExtra(col)}</td>
        </tr>
      `;
    }

    html += "</tbody></table>";

    schemaTable.innerHTML = html;
  }

  function renderExtra(col) {

    // ENUM
    if (col.enum) {
      return Object.entries(col.enum)
        .map(([k, v]) => `${k} = ${v}`)
        .join("<br>");
    }

    // FK
    if (col.relation) {
      return `→ ${col.relation}`;
    }

    return "";
  }

})();