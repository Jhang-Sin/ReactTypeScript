// ==================================================
// router.js（最終穩定版）
// - 對應 <main id="content">
// - 正確處理 HIS/Register/js 路徑
// - Vue 自動 unmount（避免重複點擊異常）
// - 共用 JS 只載入一次
// - 移除舊的 page JS（避免快取問題）
// -20251216
// ==================================================

(() => {

  console.log("[router] init");

  // ===============================
  // 取得 HIS Base Path
  // ===============================
  function getHISBase() {
    return location.pathname.includes("/ReactTypeScript/")
      ? "/ReactTypeScript/HIS"
      : "/HIS";
  }

  const HIS_BASE = getHISBase();
  const PAGE_BASE = `${HIS_BASE}/Register/pages`;
  const JS_BASE   = `${HIS_BASE}/Register/js`;

  const content = document.getElementById("content");
  if (!content) {
    console.error("[router] #content not found");
    return;
  }

  // ===============================
  // 共用 JS（只載一次）
  // ===============================
  const COMMON_SCRIPTS = [
    `${HIS_BASE}/common/js/vue.global.prod.js`,
    `${HIS_BASE}/common/js/utilities.js`,
    `${HIS_BASE}/common/js/condition-config.js`,
    `${HIS_BASE}/common/js/condition-engine.js`,
    `${HIS_BASE}/common/js/modal.js`,
    `${HIS_BASE}/common/js/register-system.js`
  ];

  const loadedScripts = new Set();

  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      if (loadedScripts.has(src)) {
        return resolve();
      }
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => {
        loadedScripts.add(src);
        console.log("[router] script loaded:", src);
        resolve();
      };
      s.onerror = () => {
        console.error("[router] script load failed:", src);
        reject();
      };
      document.body.appendChild(s);
    });
  }

  // ===============================
  // page → JS 對照表
  // ===============================
  const PAGE_JS_MAP = {
    "reg_form.html":      "reg_form.js",
    "reg_by_doctor.html":"reg_by_doctor.js",
    "reg_by_date.html":  "reg_by_date.js",
    "reg_by_dep.html":   "reg_by_dep.js",
    "reg_list.html":     "reg_list.js",
    "reg_info.html":     "reg_info.js"
  };

  // ===============================
  // Vue instance 管理
  // ===============================
  function destroyVueApp() {
    if (window.__vue_app__ && typeof window.__vue_app__.unmount === "function") {
      console.log("[router] Vue unmount");
      window.__vue_app__.unmount();
      window.__vue_app__ = null;
    }
  }

  // ===============================
  // 載入頁面
  // ===============================
  async function loadPage(page) {
    try {
      console.log("[router] loading page:", page);

      destroyVueApp();

      content.innerHTML = `<p>頁面載入中...</p>`;

      // 1️⃣ 先載共用 JS
      for (const src of COMMON_SCRIPTS) {
        await loadScriptOnce(src);
      }

      // 2️⃣ 載 HTML
      const res = await fetch(`${PAGE_BASE}/${page}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      content.innerHTML = await res.text();

      // 3️⃣ 載對應 JS
      const pageJS = PAGE_JS_MAP[page];
      if (pageJS) {
        const jsPath = `${JS_BASE}/${pageJS}`;

        // 移除舊的同名 script（避免 cache 問題）
        document
          .querySelectorAll(`script[data-page-js="${pageJS}"]`)
          .forEach(s => s.remove());

        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = jsPath;
          s.dataset.pageJs = pageJS;
          s.onload = () => {
            console.log("[router] page script loaded:", jsPath);
            resolve();
          };
          s.onerror = () => {
            console.error("[router] page script failed:", jsPath);
            reject();
          };
          document.body.appendChild(s);
        });
      }

      console.log("[router] page loaded:", page);

    } catch (err) {
      console.error("[router] load failed:", err);
      content.innerHTML = `<p style="color:red">載入失敗：${err.message}</p>`;
    }
  }

  // ===============================
  // 綁定選單
  // ===============================
  document.querySelectorAll("[data-page]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page) loadPage(page);
    });
  });

})();
