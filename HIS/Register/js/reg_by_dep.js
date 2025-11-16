// reg_by_dep.js
// 選科別後顯示該科別當月所有醫師的排班（簡表），可掛號

async function initRegByDep() {
  console.log('[reg_by_dep.js] init');
  const sel = document.getElementById('depSelect');
  const area = document.getElementById('depScheduleArea');

  const [schRes, noonRes, depTxtRes] = await Promise.all([
    fetch('../data/schedule.json'),
    fetch('../data/noon_type.json'),
    fetch('../data/depcode.txt')
  ]);

  const schJson = await schRes.json();
  const noonMap = await noonRes.json();
  const depTxt = await depTxtRes.text();

  const schedules = schJson.schedules || [];

  // parse depcode txt -> map code=>label
  const depMap = {};
  depTxt.split(/\r?\n/).forEach(line => {
    if (!line.trim()) return;
    const [code, label] = line.split('|');
    if (code && label) depMap[label.trim()] = label.trim(); // note: we used label as key since schedule uses department label
  });

  // collect unique departments from schedule (use department label)
  const deps = new Set(schedules.map(s => s.department));
  deps.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    sel.appendChild(opt);
  });

  function renderDep(dep) {
    area.innerHTML = '';
    const relevant = schedules.filter(s => s.department === dep);
    if (relevant.length === 0) {
      area.innerHTML = '<p>此科別無排班資料。</p>';
      return;
    }

    // Build table rows grouped by doctor
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr>
      <th style="border:1px solid #ccc;padding:6px">醫師</th>
      <th style="border:1px solid #ccc;padding:6px">門診日</th>
      <th style="border:1px solid #ccc;padding:6px">時段</th>
      <th style="border:1px solid #ccc;padding:6px">操作</th>
    </tr>`;
    table.appendChild(thead);
    const tbody = document.createElement('tbody');

    relevant.forEach(doc => {
      doc.items.forEach(item => {
        const noonLabel = (noonMap[item.noon] && noonMap[item.noon].value) || item.noon;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="border:1px solid #ccc;padding:6px">${doc.doctorName}</td>
                        <td style="border:1px solid #ccc;padding:6px">${item.date}</td>
                        <td style="border:1px solid #ccc;padding:6px">${noonLabel}</td>
                        <td style="border:1px solid #ccc;padding:6px"><button class="reg-btn" data-doc="${doc.doctorId}" data-date="${item.date}" data-noon="${item.noon}">掛號</button></td>`;
        tbody.appendChild(tr);
      });
    });

    table.appendChild(tbody);
    area.appendChild(table);

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
    const val = sel.value;
    if (!val) { area.innerHTML = ''; return; }
    renderDep(val);
  });
}

function doRegister(doctorId, date, noon) {
  const regs = JSON.parse(localStorage.getItem('registrations') || '[]');
  const ts = new Date().toLocaleString();
  regs.push({ doctorId, date, noon, timeStamp: ts });
  localStorage.setItem('registrations', JSON.stringify(regs));
  alert(`掛號成功\n醫師:${doctorId}\n日期:${date}\n時段:${noon}\n(${ts})`);
}

initRegByDep();
