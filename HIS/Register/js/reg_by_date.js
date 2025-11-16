// reg_by_date.js
// 顯示當月所有有排班的日期（簡單 list），點日期顯示該日所有醫師排班

async function initRegByDate() {
  console.log('[reg_by_date.js] init');
  const monthInput = document.getElementById('monthInput');
  const dateListArea = document.getElementById('dateListArea');
  const dateScheduleArea = document.getElementById('dateScheduleArea');

  const [schRes, noonRes] = await Promise.all([
    fetch('../data/schedule.json'),
    fetch('../data/noon_type.json')
  ]);
  const schJson = await schRes.json();
  const noonMap = await noonRes.json();
  const schedules = schJson.schedules || [];

  // collect all dates in schedule
  const dateSet = new Set();
  schedules.forEach(d => d.items.forEach(i => dateSet.add(i.date)));
  const allDates = Array.from(dateSet).sort();

  function renderDateList(filterMonth) {
    dateListArea.innerHTML = '<h4>可選日期</h4>';
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    allDates.forEach(dateStr => {
      if (filterMonth && !dateStr.startsWith(filterMonth)) return;
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = dateStr;
      btn.style.margin = '4px';
      btn.addEventListener('click', () => renderDateSchedule(dateStr));
      li.appendChild(btn);
      ul.appendChild(li);
    });
    dateListArea.appendChild(ul);
  }

  function renderDateSchedule(dateStr) {
    dateScheduleArea.innerHTML = `<h4>${dateStr} 排班</h4>`;
    // gather all schedule items for this date
    const rows = [];
    schedules.forEach(doc => {
      doc.items.forEach(item => {
        if (item.date === dateStr) {
          rows.push({
            doctorId: doc.doctorId,
            doctorName: doc.doctorName,
            department: doc.department,
            noon: item.noon
          });
        }
      });
    });

    if (rows.length === 0) {
      dateScheduleArea.innerHTML += '<p>該日無排班。</p>';
      return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr>
      <th style="border:1px solid #ccc;padding:6px">醫師</th>
      <th style="border:1px solid #ccc;padding:6px">科別</th>
      <th style="border:1px solid #ccc;padding:6px">時段</th>
      <th style="border:1px solid #ccc;padding:6px">操作</th>
    </tr>`;
    table.appendChild(thead);
    const tbody = document.createElement('tbody');

    rows.forEach(r => {
      const noonLabel = (noonMap[r.noon] && noonMap[r.noon].value) || r.noon;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td style="border:1px solid #ccc;padding:6px">${r.doctorName}</td>
                      <td style="border:1px solid #ccc;padding:6px">${r.department}</td>
                      <td style="border:1px solid #ccc;padding:6px">${noonLabel}</td>
                      <td style="border:1px solid #ccc;padding:6px"><button class="reg-btn" data-doc="${r.doctorId}" data-date="${dateStr}" data-noon="${r.noon}">掛號</button></td>`;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    dateScheduleArea.appendChild(table);

    dateScheduleArea.querySelectorAll('.reg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const docId = btn.dataset.doc;
        const date = btn.dataset.date;
        const noon = btn.dataset.noon;
        doRegister(docId, date, noon);
      });
    });
  }

  monthInput.addEventListener('change', () => {
    const val = monthInput.value; // format YYYY-MM
    renderDateList(val ? val + '' : null);
  });

  // initial render: show all dates
  renderDateList();
}

function doRegister(doctorId, date, noon) {
  const regs = JSON.parse(localStorage.getItem('registrations') || '[]');
  const ts = new Date().toLocaleString();
  regs.push({ doctorId, date, noon, timeStamp: ts });
  localStorage.setItem('registrations', JSON.stringify(regs));
  alert(`掛號成功\n醫師:${doctorId}\n日期:${date}\n時段:${noon}\n(${ts})`);
}

initRegByDate();
