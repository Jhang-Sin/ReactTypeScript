// 載入病歷資料
function loadPatient(mrNo, showDoctors = false) {
  fetch('../data/patients.json')
    .then(res => res.json())
    .then(data => {
      const patient = data.find(p => p.id === mrNo);
      const resultDiv = document.getElementById('patientResult');
      if (patient) {
        resultDiv.innerHTML = `
          <h3>病歷資料</h3>
          <p>姓名：${patient.name}</p>
          <p>年齡：${patient.age}</p>
          <p>性別：${patient.gender}</p>
        `;
        if (showDoctors) loadDoctors(patient);
      } else {
        resultDiv.innerHTML = '<p>查無此病歷號。</p>';
        document.getElementById('doctorSection').style.display = 'none';
      }
    });
}

// 載入醫師清單
function loadDoctors(patient) {
  fetch('../data/doctors.json')
    .then(res => res.json())
    .then(data => {
      const doctorList = document.getElementById('doctorList');
      const section = document.getElementById('doctorSection');
      section.style.display = 'block';
      doctorList.innerHTML = data.map(d => `
        <div class="doctor-card">
          <p><strong>${d.name}</strong>（${d.department}）</p>
          <button onclick="registerPatient('${patient.id}', '${d.id}', '${d.name}')">掛號</button>
        </div>
      `).join('');
    });
}

// 模擬掛號
function registerPatient(patientId, doctorId, doctorName) {
  const timestamp = new Date().toLocaleString();
  alert(`✅ 病歷號：${patientId}\n醫師：${doctorName}\n掛號時間：${timestamp}\n\n掛號成功！`);
}
