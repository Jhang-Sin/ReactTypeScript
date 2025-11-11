async function loadPage(page) {
  const main = document.getElementById('main-content');
  const res = await fetch(page);
  main.innerHTML = await res.text();

  if (page.includes('reg_form')) initFormPage();
  if (page.includes('reg_info')) showPatientInfo();
  if (page.includes('reg_list')) showRegList();
}

async function initFormPage() {
  const input = document.getElementById('mrnInput');
  const btn = document.getElementById('searchBtn');
  const msg = document.getElementById('statusMsg');

  btn.addEventListener('click', async () => {
    const keyword = input.value.trim();
    if (!keyword) {
      msg.textContent = '請輸入病歷號！';
      return;
    }

    const res = await fetch('data/patients.json');
    const patients = await res.json();

    const result = patients.find(p => p.id.includes(keyword) || p.name.includes(keyword));

    if (result) {
      msg.textContent = `找到病患：${result.name}（${result.id}）`;
      localStorage.setItem('currentPatient', JSON.stringify(result));
    } else {
      msg.textContent = '查無此病歷號。';
      localStorage.removeItem('currentPatient');
    }
  });
}

function showPatientInfo() {
  const infoDiv = document.getElementById('patientInfo');
  const data = localStorage.getItem('currentPatient');

  if (!data) {
    infoDiv.innerHTML = '<p>尚未查詢資料</p>';
    return;
  }

  const p = JSON.parse(data);
  infoDiv.innerHTML = `
    <ul>
      <li><b>病歷號：</b>${p.id}</li>
      <li><b>姓名：</b>${p.name}</li>
      <li><b>性別：</b>${p.gender}</li>
      <li><b>年齡：</b>${p.age}</li>
    </ul>
  `;
}

function showRegList() {
  const listDiv = document.getElementById('regList');
  const data = localStorage.getItem('currentPatient');

  if (!data) {
    listDiv.innerHTML = '<p>請先查詢病人資料</p>';
    return;
  }

  const p = JSON.parse(data);
  listDiv.innerHTML = `
    <p>目前顯示 <b>${p.name}</b>（${p.id}） 的掛號紀錄：</p>
    <ul>
      <li>2025-11-10 — 心臟內科 — 王醫師</li>
      <li>2025-08-05 — 皮膚科 — 陳醫師</li>
    </ul>
  `;
}
