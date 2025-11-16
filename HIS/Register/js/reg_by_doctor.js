// reg_by_doctor.js
// 依醫師掛號：選醫師後顯示該醫師的當月排班（簡表），每格點擊可掛號

async function initRegByDoctor() {
  console.log('[reg_by_doctor.js] init');
  const sel = document.getElementById('doctorSelect');
  const area = document.getElementById('doctorScheduleArea');

  // 讀取資料
  const [schRes, noonRes] = await Promise.all([
    fetch('../data/schedule.json'),
    fetch('../data/noon_type.json')
  ]);
  const schJson = await schRes.json();
  const noonMap = await noonRes.json();

  const schedules = schJson.schedules || [];

  // populate doctor select
  schedules.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.doctorId;
    opt.textContent = `${d.doctorName} (${d.department})`;
    sel.appendChild(opt);
  });

  function renderDoctorSchedule(doctorId) {
    area.innerHTML = '';
    const doc = schedules.find(x => x.doctorId === doctorId);
    if (!doc) {
      area.innerHTML = '<p>此醫師無排班資料。</p>';
      return;
    }

    // 建立 table：Date | 時段 | 科別 | 操作
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr>
      <th style="border:1px solid #ccc;padding:6px">門診日</th>
      <th style="border:1px solid #ccc;padding:6px">時段</th>
      <th style="border:1px solid #ccc;padding:6px">科別</th>
      <th style="border:1px solid #ccc;padding:6px">操作</th>
    </tr>`;
    table.appendChild(thead);
    const tbody = document.createElement('tbody');

    doc.items.forEach(item => {
      const tr = document.createElement('tr');
      const noonLabel = (noonMap[item.noon] && noonMap[item.noon].value) || item.noon;
      tr.innerHTML = `<td style="border:1px solid #ccc;padding:6px">${item.date}</td>
                      <td style="border:1px solid #ccc;padding:6px">${noonLabel}</td>
                      <td style="border:1px solid #ccc;padding:6px">${doc.department}</td>
                      <td style="border:1px solid #ccc;padding:6px"><button class="reg-btn" data-doc="${doc.doctorId}" data-date="${item.date}" data-noon="${item.noon}">掛號</button></td>`;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    area.appendChild(table);

    // 綁定按鈕
    area.querySelectorAll('.reg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const docId = btn.dataset.doc;
        const date = btn.dataset.date;
        const noon = btn.dataset.noon;
        doRegister(docId, date, noon);
      });
    });
  }

  sel.addEventListener('change', () => {
    const id = sel.value;
    if (!id) { area.innerHTML = ''; return; }
    renderDoctorSchedule(id);
  });
}

function doRegister(doctorId, date, noon) {
  // 模擬掛號：存到 localStorage registrations（陣列）
  const regs = JSON.parse(localStorage.getItem('registrations') || '[]');
  const ts = new Date().toLocaleString();
  regs.push({ doctorId, date, noon, timeStamp: ts });
  localStorage.setItem('registrations', JSON.stringify(regs));
  alert(`掛號成功\n醫師:${doctorId}\n日期:${date}\n時段:${noon}\n(${ts})`);
}

initRegByDoctor();
