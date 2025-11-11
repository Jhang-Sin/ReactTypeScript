// TODO: 待系統功能齊全後，考慮導入 BASE_PATH 或環境變數管理路徑。

let patients = [];
let doctors = [];
let departments = {};

async function loadData() {
  updateSourceLabel();
  const [p, d, dep] = await Promise.all([
    fetch('../data/patients.json').then(res => res.json()),
    fetch('../data/' + document.getElementById('region').value).then(res => res.json()),
    fetch('../data/departments.json').then(res => res.json())
  ]);
  patients = p;
  doctors = d;
  departments = dep;
}

function updateSourceLabel() {
  const select = document.getElementById('region');
  const label = select.options[select.selectedIndex].getAttribute('data-label');
  const file = select.value;
  document.getElementById('sourceInfo').textContent = `資料來源：${label} (${file})`;
}

function findDoctorName(id) {
  const doc = doctors.find(d => d.id === id);
  return doc ? doc.name : '-';
}

function translateDept(dept) {
  return departments[dept]?.zh || dept;
}

function searchPatient(keyword) {
  const lower = keyword.toLowerCase();
  const results = patients.filter(p =>
    p.medicalId.toLowerCase().includes(lower) ||
    p.name.includes(keyword)
  );
  displayResults(results);
}

function displayResults(data) {
  const tbody = document.querySelector("#resultTable tbody");
  tbody.innerHTML = "";
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#999;">查無資料</td></tr>`;
    return;
  }

  data.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.medicalId}</td>
      <td>${p.name}</td>
      <td>${p.gender}</td>
      <td>${p.birth}</td>
      <td>${translateDept(p.department)}</td>
      <td>${findDoctorName(p.doctorId)}</td>
    `;
    tbody.appendChild(row);
  });
}

document.getElementById('searchBtn').addEventListener('click', async () => {
  const keyword = document.getElementById('searchInput').value.trim();
  if (!keyword) return alert("請輸入關鍵字");
  await loadData();
  searchPatient(keyword);
});

document.getElementById('region').addEventListener('change', async () => {
  await loadData();
  const keyword = document.getElementById('searchInput').value.trim();
  if (keyword) searchPatient(keyword);
});

// 初始化載入
loadData();
