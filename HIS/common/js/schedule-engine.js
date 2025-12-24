// ==============================
// 排班引擎
// ==============================
window.HIS = window.HIS || {};

HIS.schedule = {
  groupByDoctor(scheduleList) {
    const map = {};
    scheduleList.forEach(s => {
      if (!map[s.doctorId]) map[s.doctorId] = [];
      map[s.doctorId].push(s);
    });
    return map;
  },

  groupByDate(scheduleList) {
    const map = {};
    scheduleList.forEach(s => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  },

  groupByDepartment(scheduleList, doctors) {
    const map = {};
    scheduleList.forEach(s => {
      const doctor = doctors.find(d => d.id === s.doctorId);
      if (!doctor) return;

      const dep = doctor.department;
      if (!map[dep]) map[dep] = [];
      map[dep].push({ ...s, doctorName: doctor.name });
    });
    return map;
  }
};
