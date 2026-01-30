// ==============================
// HIS DB Checker - Final Stable Version
//2025-1-20
// ==============================
/**
 * HIS DB Checker
 * 最終 depCode 正確檢核版-加強
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

      // 同時保留「原始 doctorId」與「正規化 doctorId」
      const doctorIdSet = new Set(
        doctors.map(d =>
          normalizeId(d.doctorId ?? d.id)
        )
      );

      /* ========= 逐筆檢核 ========= */
      schedule.forEach((item, index) => {
        const row = normalizeRow(item);

        const context = {
          index,
          schedule_NO: item.schedule_NO ?? "(unknown)",
          date: item.date ?? ""
        };

        // doctorId
        if (!row.doctorId) {
          result.push(err(
            "schedule",
            context,
            "doctorId",
            "缺少 doctorId",
            { raw: item.doctorId }
          ));
        } else if (!doctorIdSet.has(row.doctorId)) {
          result.push(err(
            "schedule",
            context,
            "doctorId",
            `doctorId 不存在`,
            {
              raw: item.doctorId,
              normalized: row.doctorId,
              type: typeof item.doctorId,
              hint: "請檢查大小寫、前後空白或 doctors.json 是否缺資料"
            }
          ));
        }

        // depCode（唯一來源：dep_map.json）
        if (!row.depCode) {
          result.push(err(
            "schedule",
            context,
            "depCode",
            "缺少科別代碼",
            { raw: item.depCode }
          ));
        } else if (!depCodeSet.has(row.depCode)) {
          result.push(err(
            "schedule",
            context,
            "depCode",
            `科別代碼不存在`,
            {
              raw: item.depCode,
              normalized: row.depCode
            }
          ));
        }

        // noon
        if (!row.noon) {
          result.push(err(
            "schedule",
            context,
            "noon",
            "缺少午別",
            { raw: item.noon }
          ));
        } else if (!noonSet.has(row.noon)) {
          result.push(err(
            "schedule",
            context,
            "noon",
            `午別代碼不存在`,
            {
              raw: item.noon,
              normalized: row.noon
            }
          ));
        }

        // date
        if (!row.date) {
          result.push(warn(
            "schedule",
            context,
            "date",
            "未填寫日期",
            { raw: item.date }
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

function normalizeId(val) {
  return val == null ? "" : String(val).trim().toUpperCase();
}

function normalizeSchedule(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.schedules)) return raw.schedules;
  return null;
}

function normalizeRow(row) {
  return {
    doctorId: normalizeId(row.doctorId),
    depCode: row.depCode ? String(row.depCode).trim() : "",
    noon: row.noon ? String(row.noon).trim() : "",
    date: row.date ? String(row.date).trim() : ""
  };
}

function err(table, context, field, message, detail = {}) {
  return {
    level: "ERROR",
    table,
    index: context.index,
    schedule_NO: context.schedule_NO,
    date: context.date,
    field,
    message,
    detail
  };
}

function warn(table, context, field, message, detail = {}) {
  return {
    level: "WARN",
    table,
    index: context.index,
    schedule_NO: context.schedule_NO,
    date: context.date,
    field,
    message,
    detail
  };
}

function fatal(table, message) {
  return [{
    level: "FATAL",
    table,
    message
  }];
}
