// ==============================
// Global Utilities 工具庫
// 自動處理本機 / GitHub Pages 路徑
//2025-12-09-更新
// 升級成「分區塊、可擴充」版本（未來加時間、班別都不亂）-20251209
// ==============================

window.HIS = window.HIS || {};

(function () {

  // ==================================================
  // 🌍 環境判斷
  // ==================================================

  // 檢查是否在 GitHub Pages（URL 中會含 ReactTypeScript）
  const ROOT = window.location.pathname.includes("ReactTypeScript")
    ? "/ReactTypeScript"
    : "";

  // HIS 根目錄
  const BASE = `${ROOT}/HIS`;

  // ==================================================
  // 🧰 HIS Global Utilities
  // ==================================================

  HIS.util = {

    /* =================================================
     * 📁 Path / Router
     * ================================================= */

    // ★★★ 供 router.js 呼叫：取得 HIS 的根目錄
    getHISBase() {
      return BASE;  // /HIS 或 /ReactTypeScript/HIS
    },

    /* =================================================
     * 📁 Data / Fetch
     * ================================================= */

    // 統一 JSON 讀取工具
    async loadJSON(path) {
      // path 例如： "Register/data/doctors.json"
      const full = `${BASE}/${path}`;

      console.log(`[HIS] loadJSON -> ${full}`);

      try {
        const res = await fetch(full);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.error(`[HIS] loadJSON failed: ${full}`, err);
        return null;
      }
    },

    /* =================================================
     * 📅 Date Utilities（業務日期核心）
     * 👉 專案統一使用 yyyy-MM-dd（Local）
     * ================================================= */

    // 取得今天（Local，不受 UTC 影響）
    getToday() {
      return this.formatDateYMD(new Date());
    },

    // Date / string → yyyy-MM-dd
    formatDateYMD(date) {
      const d = (date instanceof Date) ? date : new Date(date);

      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      return `${y}-${m}-${day}`;
    },

    // yyyy-MM-dd → Date（Local）
    parseDateYMD(dateStr) {
      if (!dateStr) return null;

      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d);
    },

    // 比對兩個 yyyy-MM-dd 是否相同
    isSameDate(dateA, dateB) {
      return String(dateA) === String(dateB);
    },

    /* =================================================
     * 🕒 Time Utilities（時間 / 班別）
     * ================================================= */

    // 回傳上午 / 下午 / 晚上
    getTimePeriod(hour) {
      if (hour < 12) return "上午";
      if (hour < 17) return "下午";
      return "晚上";
    },

    // Date → HH:mm
    formatTimeHM(date) {
      const d = (date instanceof Date) ? date : new Date(date);

      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");

      return `${h}:${m}`;
    },

    /* =================================================
     * ⚠️ Legacy（舊方法，保留但不建議用）
     * ================================================= */

    // ⚠️ 受 UTC 影響，僅限非業務用途
    formatDate(date) {
      return date.toISOString().split("T")[0];
    },

    /* =================================================
     * 🪵 Log
     * ================================================= */

    log(msg) {
      console.log(`[HIS] ${msg}`);
    }
  };

})();
