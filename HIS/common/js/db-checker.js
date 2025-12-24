// ==============================
// HIS DB Checker - Final Stable Version
//2025-12-24
// ==============================

window.HIS = window.HIS || {};

HIS.dbChecker = (function () {

  function resultTemplate() {
    return {
      ok: true,
      fatal: false,
      summary: "",
      rows: []
    };
  }

  function pushRow(result, level, table, index, field, message) {
    result.rows.push({
      level,          // INFO | WARN | ERROR | FATAL
      table,          // 資料表名稱
      index,          // 第幾筆（null 代表整體）
      field,          // 欄位名稱
      message         // 詳細說明
    });

    if (level === "ERROR") result.ok = false;
    if (level === "FATAL") {
      result.ok = false;
      result.fatal = true;
    }
  }

  async function checkAll() {
    const result = resultTemplate();

    try {
      // ===== 讀取資料 =====
      const doctors = await HIS.util.loadJSON("DB/doctors.json");
      const schedule = await HIS.util.loadJSON("DB/schedule.json");
      const noonMap = await HIS.util.loadJSON("DB/noon_type.json");
      const departments = await HIS.util.loadJSON("DB/departments.json");

      // ===== 基本存在檢核 =====
      if (!Array.isArray(doctors)) {
        pushRow(result, "FATAL", "doctors", null, "-", "資料不是陣列格式");
      }

      if (!Array.isArray(schedule)) {
        pushRow(result, "FATAL", "schedule", null, "-", "資料不是陣列格式");
      }

      if (!noonMap || typeof noonMap !== "object") {
        pushRow(result, "FATAL", "noon_type", null, "-", "午別資料不是物件格式");
      }

      if (!departments || typeof departments !== "object") {
        pushRow(result, "FATAL", "departments", null, "-", "科別資料不是物件格式");
      }

      // 若有致命錯誤，直接停止
      if (result.fatal) {
        result.summary = "FATAL：基礎資料格式錯誤，檢核中止";
        return result;
      }

      // ===== 建立對照表 =====
      const doctorIds = new Set(doctors.map(d => d.id));
      const depKeys = new Set(Object.keys(departments));
      const noonKeys = new Set(Object.keys(noonMap));

      // ===== schedule 明細檢核 =====
      schedule.forEach((item, idx) => {

        if (!item.doctorId) {
          pushRow(result, "ERROR", "schedule", idx, "doctorId", "缺少 doctorId");
        } else if (!doctorIds.has(item.doctorId)) {
          pushRow(
            result,
            "ERROR",
            "schedule",
            idx,
            "doctorId",
            `doctorId 不存在 (${item.doctorId})`
          );
        }

        if (!item.noon) {
          pushRow(result, "ERROR", "schedule", idx, "noon", "缺少午別");
        } else if (!noonKeys.has(item.noon)) {
          pushRow(
            result,
            "ERROR",
            "schedule",
            idx,
            "noon",
            `午別不存在 (${item.noon})`
          );
        }

        if (!item.depCode) {
          pushRow(result, "ERROR", "schedule", idx, "depCode", "缺少科別代碼");
        } else if (!depKeys.has(item.depCode)) {
          pushRow(
            result,
            "ERROR",
            "schedule",
            idx,
            "depCode",
            `科別代碼不存在 (${item.depCode})`
          );
        }

        if (!item.date) {
          pushRow(result, "WARN", "schedule", idx, "date", "未填寫日期");
        }
      });

      // ===== 總結 =====
      if (result.rows.length === 0) {
        result.summary = "✔ 所有資料檢核通過";
      } else if (result.fatal) {
        result.summary = "✖ 發現致命錯誤，請先修正";
      } else {
        result.summary = `⚠ 發現 ${result.rows.length} 筆資料異常`;
      }

      return result;

    } catch (err) {
      pushRow(result, "FATAL", "system", null, "-", err.message);
      result.summary = "FATAL：檢核過程發生未預期錯誤";
      return result;
    }
  }

  return {
    checkAll
  };

})();
