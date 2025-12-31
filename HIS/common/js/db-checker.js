// ==============================
// HIS DB Checker - Final Stable Version
//2025-12-31
// ==============================
/**
 * HIS DB Checker
 * 最終 depCode 正確檢核版
 */

window.HIS = window.HIS || {};
HIS.dbChecker = {
  async checkAll() {
    const result = [];

    try {
      /* ========= 讀取基礎資料 ========= */
      const [
        depMap,
        noonType,
        doctors,
        scheduleRaw
      ] = await Promise.all([
        HIS.util.loadJSON("/DB/dep_map.json"),
        HIS.util.loadJSON("/DB/noon_type.json"),
        HIS.util.loadJSON("/DB/doctors.json"),
        HIS.util.loadJSON("/DB/schedule.json")
      ]);

      /* ========= schedule 正規化 ========= */
      const schedule = normalizeSchedule(scheduleRaw);

      if (!Array.isArray(schedule)) {
        return fatal("schedule", "資料不是陣列");
      }

      /* ========= 建立檢核 Set ========= */
      const depCodeSet = new Set(Object.keys(depMap));
      const noonSet = new Set(Object.keys(noonType));
      const doctorIdSet = new Set(doctors.map(d => String(d.id).trim()));

      /* ========= 逐筆檢核 ========= */
      schedule.forEach((item, index) => {
        const row = normalizeRow(item);

        // doctorId
        if (!row.doctorId) {
          result.push(err("schedule", index, "doctorId", "缺少 doctorId"));
        } else if (!doctorIdSet.has(row.doctorId)) {
          result.push(err(
            "schedule",
            index,
            "doctorId",
            `doctorId 不存在 (${row.doctorId})`
          ));
        }

        // depCode（唯一來源：dep_map.json）
        if (!row.depCode) {
          result.push(err("schedule", index, "depCode", "缺少科別代碼"));
        } else if (!depCodeSet.has(row.depCode)) {
          result.push(err(
            "schedule",
            index,
            "depCode",
            `科別代碼不存在 (${row.depCode})`
          ));
        }

        // noon
        if (!row.noon) {
          result.push(err("schedule", index, "noon", "缺少午別"));
        } else if (!noonSet.has(row.noon)) {
          result.push(err(
            "schedule",
            index,
            "noon",
            `午別代碼不存在 (${row.noon})`
          ));
        }

        // date
        if (!row.date) {
          result.push(warn(
            "schedule",
            index,
            "date",
            "未填寫日期"
          ));
        }
      });

      /* ========= summary ========= */
      if (result.length === 0) {
        result.push({
          level: "INFO",
          table: "system",
          message: "✔ 所有資料檢核通過"
        });
      } else {
        result.summary = `⚠ 發現 ${result.length} 筆資料異常`;
      }

      return result;

    } catch (e) {
      console.error("[DB-CHECK] fatal error", e);
      return fatal("system", "base data invalid");
    }
  }
};

/* =========================
 * 工具區
 * ========================= */

function normalizeSchedule(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.schedules)) return raw.schedules;
  return null;
}

function normalizeRow(row) {
  return {
    doctorId: row.doctorId ? String(row.doctorId).trim() : "",
    depCode: row.depCode ? String(row.depCode).trim() : "",
    noon: row.noon ? String(row.noon).trim() : "",
    date: row.date ? String(row.date).trim() : ""
  };
}

function err(table, index, field, message) {
  return {
    level: "ERROR",
    table,
    index,
    field,
    message
  };
}

function warn(table, index, field, message) {
  return {
    level: "WARN",
    table,
    index,
    field,
    message
  };
}

function fatal(table, message) {
  return [{
    level: "FATAL",
    table,
    message
  }];
}
