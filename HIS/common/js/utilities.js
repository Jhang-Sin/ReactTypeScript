// ==============================
// Global Utilities 工具庫
// 自動處理本機 / GitHub Pages 路徑
//2025-12-09
// ==============================

window.HIS = window.HIS || {};

(function () {

  // 檢查是否在 GitHub Pages（URL 中會含 ReactTypeScript）
  const ROOT = window.location.pathname.includes("ReactTypeScript")
    ? "/ReactTypeScript"
    : "";

  // HIS 根目錄
  const BASE = `${ROOT}/HIS`;

  HIS.util = {

    // ★★★ 供 router.js 呼叫：取得 HIS 的根目錄
    getHISBase() {
      return BASE;  // /HIS 或 /ReactTypeScript/HIS
    },

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

    // 格式化日期
    formatDate(date) {
      return date.toISOString().split("T")[0];
    },

    // 回傳上午/下午/晚上
    getTimePeriod(hour) {
      if (hour < 12) return "上午";
      if (hour < 17) return "下午";
      return "晚上";
    },

    log(msg) {
      console.log(`[HIS] ${msg}`);
    }
  };

})();
