console.log("[maintain] script loaded");

/* =========================================================
 * 🔥 Maintain Module（模組化版本）
 * ========================================================= */
(function () {

  let initialized = false;

  /* =========================================================
   * 🔹 主入口（統一由 Loader 或 DOM 呼叫）
   * ========================================================= */
  function init() {

    if (initialized) {
      console.warn("[maintain] already initialized");
      return;
    }

    console.log("[maintain] init start");

    // 🔥 分段初始化（不互相依賴）
    initDBViewer();
    initDBCheck();

    initialized = true;
  }

  /* =========================================================
   * 🔹 DB Viewer 初始化
   * ========================================================= */
  function initDBViewer() {

    const dbSelect = document.getElementById("dbSelect");
    const btnLoadDB = document.getElementById("btnLoadDB");

    // 🔥 不存在就跳過（核心）
    if (!dbSelect || !btnLoadDB) {
      console.log("[maintain] DB Viewer not found → skip");
      return;
    }

    console.log("[maintain] init DB Viewer");

    initDBSelect(dbSelect);

    btnLoadDB.addEventListener("click", async () => {

      const fileName = dbSelect.value;

      if (!fileName) {
        alert("請先選擇資料表");
        return;
      }

      await loadAndRenderDB(fileName);
    });
  }

  /* =========================================================
   * 🔹 DB Checker 初始化
   * ========================================================= */
  function initDBCheck() {

    const btnCheckDB = document.getElementById("btnCheckDB");

    if (!btnCheckDB) {
      console.log("[maintain] DB Checker not found → skip");
      return;
    }

    console.log("[maintain] init DB Checker");

    btnCheckDB.addEventListener("click", async () => {

      const resultDiv = document.getElementById("dbCheckResult");

      if (resultDiv) {
        resultDiv.textContent = "檢核中...";
      }

      try {

        const result = await HIS.dbChecker.checkAll();

        renderCheckResult(result);

      } catch (err) {

        console.error("[maintain] DB check failed", err);

        if (resultDiv) {
          resultDiv.textContent = "檢核失敗，請查看 console";
        }
      }
    });
  }

  /* =========================================================
   * 🔹 DB 下拉選單初始化
   * ========================================================= */
  function initDBSelect(selectEl) {

    if (!selectEl) return;

    selectEl.innerHTML = "";

    const dbFiles = [
      "dep_map.json",
      "departments.json",
      "depcode.json",
      "doctors.json",
      "doctors2.json",
      "noon_type.json",
      "patients.json",
      "schedule.json"
    ];

    dbFiles.forEach(file => {
      const opt = document.createElement("option");
      opt.value = file;
      opt.textContent = file;
      selectEl.appendChild(opt);
    });

    console.log("[maintain] DB select initialized");
  }

  /* =========================================================
   * 🔹 載入 + 顯示 DB
   * ========================================================= */
  async function loadAndRenderDB(fileName) {

    const resultDiv = document.getElementById("dbViewResult");
    const titleEl = document.getElementById("dbViewTitle");

    if (!resultDiv) {
      console.warn("[maintain] dbViewResult not found");
      return;
    }

    resultDiv.innerHTML = "讀取中...";

    if (titleEl) {
      titleEl.textContent = fileName;
    }

    const url = `/DB/${fileName}`;

    try {

      const data = await HIS.util.loadJSON(url);

      renderDBTable(data, resultDiv);

    } catch (err) {

      console.error("[maintain] load DB failed", err);

      resultDiv.innerHTML = `<span style="color:red;">載入失敗</span>`;
    }
  }

  /* =========================================================
   * 🔹 JSON → Table
   * ========================================================= */
  function renderDBTable(data, container) {

    if (!container) return;

    container.innerHTML = "";

    if (Array.isArray(data)) {
      renderArrayTable(data, container);
      return;
    }

    if (data && typeof data === "object") {
      renderObjectTable(data, container);
      return;
    }

    container.textContent = "資料格式無法顯示";
  }

  function renderArrayTable(arr, container) {

    if (!arr.length) {
      container.textContent = "（空資料）";
      return;
    }

    const table = document.createElement("table");
    table.className = "maintain-table";

    const keys = Object.keys(arr[0]);

    table.innerHTML = `
      <thead>
        <tr>${keys.map(k => `<th>${k}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${arr.map(row => `
          <tr>
            ${keys.map(k => `<td>${formatValue(row[k])}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    `;

    container.appendChild(table);
  }

  function renderObjectTable(obj, container) {

    const table = document.createElement("table");
    table.className = "maintain-table";

    table.innerHTML = `
      <thead>
        <tr><th>Key</th><th>Value</th></tr>
      </thead>
      <tbody>
        ${Object.entries(obj).map(([k, v]) => `
          <tr>
            <td>${k}</td>
            <td>${formatValue(v)}</td>
          </tr>
        `).join("")}
      </tbody>
    `;

    container.appendChild(table);
  }

  function formatValue(val) {
    return typeof val === "object"
      ? JSON.stringify(val)
      : val;
  }

  /* =========================================================
   * 🔹 檢核結果顯示
   * ========================================================= */
  function renderCheckResult(result) {

    const container = document.getElementById("dbCheckResult");

    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(result)) {
      container.innerHTML =
        `<div class="admin-msg error">檢核結果格式錯誤</div>`;
      return;
    }

    if (result.length === 0) {
      container.innerHTML =
        `<div class="admin-msg success">✔ 無錯誤</div>`;
      return;
    }

    const table = document.createElement("table");
    table.className = "maintain-table";

    table.innerHTML = `
      <thead>
        <tr>
          <th>等級</th>
          <th>資料表</th>
          <th>欄位</th>
          <th>訊息</th>
        </tr>
      </thead>
      <tbody>
        ${result.map(r => `
          <tr>
            <td>${r.level || "-"}</td>
            <td>${r.table || "-"}</td>
            <td>${r.field || "-"}</td>
            <td>${r.message || "-"}</td>
          </tr>
        `).join("")}
      </tbody>
    `;

    container.appendChild(table);
  }

  /* =========================================================
   * 🔹 Dual Mode 支援
   * ========================================================= */
  if (!window.AdminLoader) {

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }

  /* =========================================================
   * 🔹 對外暴露
   * ========================================================= */
  window.maintain = {
    init
  };

})();