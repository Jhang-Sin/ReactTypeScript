// ==================================================
// router.js（State Machine Version）
// --------------------------------------------------
// 狀態機：IDLE / LOADING / MOUNTED
// - 對應 <main id="content">
// - Vue lifecycle 仲裁者
// - 防止重複 mount / unmount race
// - 共用 JS 只載一次
// - page JS 動態載入
// - 2026-01-16（修正完成版）
// ==================================================

(() => {

  console.log("[router] init");

  /* =================================================
   * Router State Machine
   * ================================================= */
  const RouterState = {
    IDLE: "IDLE",
    LOADING: "LOADING",
    MOUNTED: "MOUNTED"
  };

  let currentState = RouterState.IDLE;

  function setState(next) {
    console.log(`[router][state] ${currentState} → ${next}`);
    currentState = next;
  }

  /* =================================================
   * Base Path Resolver
   * ================================================= */
  function getHISBase() {
    return location.pathname.includes("/ReactTypeScript/")
      ? "/ReactTypeScript/HIS"
      : "/HIS";
  }

  const HIS_BASE  = getHISBase();
  const PAGE_BASE = `${HIS_BASE}/Register/pages`;
  const JS_BASE   = `${HIS_BASE}/Register/js`;

  const content = document.getElementById("content");
  if (!content) {
    console.error("[router] #content not found");
    return;
  }

  /* =================================================
   * 共用 JS（只載一次）
   * ================================================= */
  const COMMON_SCRIPTS = [
    `${HIS_BASE}/common/js/vue.global.prod.js`,
    `${HIS_BASE}/common/js/utilities.js`,
    `${HIS_BASE}/common/js/condition-config.js`,
    `${HIS_BASE}/common/js/condition-engine.js`,
    `${HIS_BASE}/common/js/modal.js`,
    `${HIS_BASE}/Register/js/reg_base.js`,
    `${HIS_BASE}/common/js/register-system.js`
  ];

  const loadedScripts = new Set();

  function loadScriptOnce(src) {          // 👉【工具】
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

  /* =================================================
   * page → js mapping
   * ================================================= */
  const PAGE_JS_MAP = {
    "reg_form.html":       "reg_form.js",
    "reg_by_doctor.html": "reg_by_doctor.js",
    "reg_by_date.html":   "reg_by_date.js",
    "reg_by_dep.html":    "reg_by_dep.js",
    "reg_list.html":      "reg_list.js",
    "reg_info.html":      "reg_info.js"
  };

  /* =================================================
   * Vue lifecycle control
   * ================================================= */
  function destroyVueApp() {              // 👉【流程】
    if (window.__vue_app__) {
      console.log("[router] Vue unmount");
      window.__vue_app__.unmount();
      window.__vue_app__ = null;
    }

    // 🔓 釋放 page-level guard（避免 page JS 誤判已載入）
    delete window.__reg_by_doctor_loaded__;

    return Promise.resolve();
  }

  /* =================================================
   * Load Page (State Driven)
   * ================================================= */
  async function loadPage(page) {          // 👉【流程】

    // LOADING 中不接受新請求
    if (currentState === RouterState.LOADING) {
      console.warn("[router] blocked: LOADING");
      return;
    }

    const prevState = currentState;
    setState(RouterState.LOADING);

    try {
      // 若已有頁面 → 先 teardown
      if (prevState === RouterState.MOUNTED) {
        await destroyVueApp();
      }

      content.innerHTML = `<p>頁面載入中...</p>`;

      // 1️⃣ 共用 JS（只載一次）
      for (const src of COMMON_SCRIPTS) {
        await loadScriptOnce(src);
      }

      // 2️⃣ HTML
      const res = await fetch(`${PAGE_BASE}/${page}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      content.innerHTML = await res.text();

      // 3️⃣ Page JS（每次都重新載）
      const pageJS = PAGE_JS_MAP[page];
      if (pageJS) {
        const jsPath = `${JS_BASE}/${pageJS}`;

        // 移除舊 page script（避免 cached const / 重複宣告）
        document
          .querySelectorAll(`script[data-page-js="${pageJS}"]`)
          .forEach(s => s.remove());

        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = jsPath;
          s.dataset.pageJs = pageJS;
          s.onload = () => {
            console.log("[router] page script loaded:", pageJS);
            resolve();
          };
          s.onerror = reject;
          document.body.appendChild(s);
        });
      }

      setState(RouterState.MOUNTED);
      console.log("[router] page mounted:", page);

    } catch (err) {
      console.error("[router] load failed:", err);
      content.innerHTML = `<p style="color:red">載入失敗</p>`;
      setState(RouterState.IDLE);
    }
  }

  /* =================================================
   * Navigation Binding
   * ================================================= */
  document.querySelectorAll("[data-page]").forEach(link => {
    link.addEventListener("click", e => {     // 👉【事件】
      e.preventDefault();
      const page = link.dataset.page;
      if (page) loadPage(page);
    });
  });

})();
