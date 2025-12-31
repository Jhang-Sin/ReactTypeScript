/* =====================================================
 * admin / maintain.js-2025-12-26
/**
 * admin / maintain.js
 * 功能：
 * 1. 初始化 DB Viewer 下拉選單
 * 2. 載入指定 JSON（HIS/DB）
 * 3. 自動轉成 table 顯示
  * ===================================================== 
 */

console.log("[maintain] script loaded");

document.addEventListener("DOMContentLoaded", initMaintainPage);

/* =========================
 * 入口
 * ========================= */
function initMaintainPage() {
   console.log("[maintain] init page");

  const dbSelect = document.getElementById("dbSelect");
  const btnLoadDB = document.getElementById("btnLoadDB");
  const btnCheckDB = document.getElementById("btnCheckDB");

  if (!dbSelect || !btnLoadDB) {
    console.error("[maintain] required elements not found");
    return;
  }

  initDBSelect(dbSelect);

  // DB Viewer
  btnLoadDB.addEventListener("click", async () => {
    const fileName = dbSelect.value;
    if (!fileName) {
      alert("請先選擇資料表");
      return;
    }
    await loadAndRenderDB(fileName);
  });

  // ✅ DB Checker（這段是你現在缺的）
  if (btnCheckDB) {
    btnCheckDB.addEventListener("click", async () => {
      console.log("[maintain] btnCheckDB clicked");

      const resultDiv = document.getElementById("dbCheckResult");
      if (resultDiv) resultDiv.textContent = "檢核中...";

      try {
        const result = await HIS.dbChecker.checkAll();
        renderCheckResult(result, resultDiv);///暫無此function
      } catch (err) {
        console.error("[maintain] DB check failed", err);
        if (resultDiv) {
          resultDiv.textContent = "檢核失敗，請查看 console";
        }
      }
    });
  } else {
    console.warn("[maintain] btnCheckDB not found");
  }
}

/* =========================
 * DB 下拉選單初始化
 * ========================= */
function initDBSelect(selectEl) {
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

/* =========================
 * 載入 + 顯示 DB
 * ========================= */
async function loadAndRenderDB(fileName) {
  const resultDiv = document.getElementById("dbViewResult");
  const titleEl = document.getElementById("dbViewTitle");

  if (!resultDiv) {
    console.error("[maintain] dbViewResult not found");
    return;
  }

  resultDiv.innerHTML = "讀取中...";
  if (titleEl) titleEl.textContent = fileName;

  const url = `/DB/${fileName}`;///修正錯誤路徑 /ReactTypeScript/HIS/DB/${fileName}>> /DB/${fileName}
  console.log("[maintain] load DB:", url);

  try {
    const data = await HIS.util.loadJSON(url);
    renderDBTable(data, resultDiv);
  } catch (err) {
    console.error("[maintain] load DB failed", err);
    resultDiv.innerHTML = `<span style="color:red;">載入失敗</span>`;
  }
}

/* =========================
 * 將 JSON 轉為 Table
 * ========================= */
function renderDBTable(data, container) {
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

/* ---------- Array ---------- */
function renderArrayTable(arr, container) {
  if (arr.length === 0) {
    container.textContent = "（空資料）";
    return;
  }

  const table = document.createElement("table");
  table.className = "maintain-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const keys = Object.keys(arr[0]);
  keys.forEach(k => {
    const th = document.createElement("th");
    th.textContent = k;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  arr.forEach(row => {
    const tr = document.createElement("tr");
    keys.forEach(k => {
      const td = document.createElement("td");
      const val = row[k];
      td.textContent =
        typeof val === "object" ? JSON.stringify(val) : val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

/* ---------- Object ---------- */
function renderObjectTable(obj, container) {
  const table = document.createElement("table");
  table.className = "maintain-table";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Key</th>
      <th>Value</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  Object.entries(obj).forEach(([key, value]) => {
    const tr = document.createElement("tr");

    const tdKey = document.createElement("td");
    tdKey.textContent = key;

    const tdVal = document.createElement("td");
    tdVal.textContent =
      typeof value === "object" ? JSON.stringify(value) : value;

    tr.appendChild(tdKey);
    tr.appendChild(tdVal);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

//20251229-/增加 renderCheckResult function//

/* =========================
 * DB 檢核結果顯示
 * ========================= */
function renderCheckResult(result) {
  const container = document.getElementById("dbCheckResult");

  if (!container) {
    console.error("[maintain] dbCheckResult element not found");
    return;
  }

  container.innerHTML = "";

  /* ---------- 防炸判斷 ---------- */
  if (!Array.isArray(result)) {
    container.innerHTML =
      `<div class="admin-msg error">檢核結果格式錯誤（非陣列）</div>`;
    console.error("[maintain] invalid check result:", result);
    return;
  }

  /* ---------- 無錯誤 ---------- */
  if (result.length === 0) {
    container.innerHTML =
      `<div class="admin-msg success">✔ 資料檢核完成，未發現任何錯誤</div>`;
    return;
  }

  /* ---------- 有錯誤 → 表格 ---------- */
  const table = document.createElement("table");
  table.className = "maintain-table";

  table.innerHTML = `
    <thead>
      <tr>
        <th>等級</th>
        <th>資料表</th>
        <th>項目</th>
        <th>訊息</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement("tbody");

  result.forEach(row => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.level || "-"}</td>
      <td>${row.table || "-"}</td>
      <td>${row.field || "-"}</td>
      <td>${row.message || "-"}</td>
    `;

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

