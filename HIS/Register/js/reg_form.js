(function () {

  console.log("[reg_form] init");

  async function loadPatient(mrNo) {
    const data = await HIS.util.loadJSON("DB/patients.json");
    if (!data) return;

    const patient = data.find(p => p.id === mrNo);
    const resultDiv = document.getElementById("patientResult");

    if (!patient) {
      resultDiv.innerHTML = "<p>查無此病歷號。</p>";
      document.getElementById("doctorSection").style.display = "none";
      return;
    }

    resultDiv.innerHTML = `
      <h3>病歷資料</h3>
      <p>姓名：${patient.name}</p>
      <p>年齡：${patient.age}</p>
      <p>性別：${patient.gender}</p>
    `;

    loadDoctors(patient);
  }

  async function loadDoctors(patient) {
    const data = await HIS.util.loadJSON("DB/doctors.json");
    if (!data) return;

    const list = document.getElementById("doctorList");
    const section = document.getElementById("doctorSection");

    section.style.display = "block";

    list.innerHTML = data
      .map(d => `
        <div class="doctor-card">
          <p><strong>${d.name}</strong>（${d.department}）</p>
          <button data-doc="${d.id}">掛號</button>
        </div>
      `)
      .join("");

    list.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const doctorId = btn.getAttribute("data-doc");
        const doctor = data.find(d => d.id === doctorId);
        if (!doctor) return;

        alert(
          `病歷號：${patient.id}\n` +
          `醫師：${doctor.name}\n` +
          `掛號時間：${new Date().toLocaleString()}\n\n掛號成功！`
        );
      });
    });
  }

  function bindEvents() {
    const btn = document.getElementById("searchBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const mrNo = document.getElementById("mrNo").value.trim();
      if (!mrNo) return alert("請輸入病歷號！");
      loadPatient(mrNo);
    });
  }

  function init() {
    console.log("[reg_form] page initialized");
    bindEvents();
  }

  init();

})();
