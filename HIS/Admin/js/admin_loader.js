/**
 * ============================================================
 * 🧩 Admin Loader v2（穩定版）
 * ------------------------------------------------------------
 * 功能：
 * ✔ 動態載入 HTML
 * ✔ 動態載入 JS（依序）
 * ✔ 自動處理相對路徑
 * ✔ 防止 script 重複載入
 * ✔ 模組 init / destroy 生命週期
 * ✔ Debug log
 * 2026-03-17
 * ============================================================
 */

const AdminLoader = (function () {

    /* =========================================================
     * 🔹 模組快取（避免重複 init）
     * ========================================================= */
    let currentModule = null;


    /* =========================================================
     * 🔹 主入口：載入模組
     * ========================================================= */
    async function loadModule(moduleKey) {

        console.log("[AdminLoader] load module:", moduleKey);

        if (!window.AdminModules || !AdminModules[moduleKey]) {
            console.error("[AdminLoader] Module not found:", moduleKey);
            return;
        }

        const module = AdminModules[moduleKey];

        try {

            /* =================================================
             * 1️⃣ 切換模組前 → destroy 舊模組
             * ================================================= */
            if (currentModule &&
                window[currentModule] &&
                typeof window[currentModule].destroy === "function") {

                console.log("[AdminLoader] destroy module:", currentModule);
                window[currentModule].destroy();
            }

            currentModule = moduleKey;


            /* =================================================
             * 2️⃣ 載入 HTML
             * ================================================= */
            console.log("[AdminLoader] fetch page:", module.page);

            const response = await fetch(module.page);

            if (!response.ok) {
                throw new Error("HTML load failed: " + module.page);
            }

            const html = await response.text();

            const container = document.getElementById("admin-content");

            if (!container) {
                throw new Error("#admin-content not found");
            }

            container.innerHTML = html;


            /* =================================================
             * 3️⃣ 解析 scripts 設定
             * ================================================= */
            let scriptList = [];

            if (Array.isArray(module.scripts)) {
                scriptList = module.scripts;
            } else if (module.script) {
                scriptList = [module.script];
            }

            console.log("[AdminLoader] scripts:", scriptList);


            /* =================================================
             * 4️⃣ 依序載入 JS（重點）
             * ================================================= */
            for (const src of scriptList) {

                // ⭐ 自動轉換為完整路徑（解決 ../ 問題）
                const fullPath = new URL(src, document.baseURI).href;

                console.log("[AdminLoader] loading script:", fullPath);

                await loadScript(fullPath);

                console.log("[AdminLoader] loaded script:", fullPath);
            }


            /* =================================================
             * 5️⃣ 執行模組 init()
             * ================================================= */
            if (window[moduleKey] &&
                typeof window[moduleKey].init === "function") {

                console.log("[AdminLoader] init module:", moduleKey);
                 requestAnimationFrame(() =>        //20260318-延後「使用 DOM」的那一刻   
                    {
                        window[moduleKey].init();
                    });  //20260318-edit   

            } else {
                console.warn("[AdminLoader] init not found:", moduleKey);
            }

        } catch (error) {
            console.error("[AdminLoader] Module load error:", error);
        }
    }


    /* =========================================================
     * 🔹 動態載入 JS（安全版）
     * ========================================================= */
    function loadScript(src) {

        return new Promise((resolve, reject) => {

            // ==========================
            // 防止重複載入
            // ==========================
            const exist = document.querySelector(`script[src="${src}"]`);

            if (exist) {

                // 已載入完成
                if (exist.dataset.loaded === "true") {
                    resolve();
                    return;
                }

                // 尚未完成 → 等待
                exist.addEventListener("load", () => resolve());
                return;
            }


            // ==========================
            // 建立 script
            // ==========================
            const script = document.createElement("script");

            script.src = src;

            script.onload = () => {
                script.dataset.loaded = "true";
                resolve();
            };

            script.onerror = () => {
                console.error("[AdminLoader] script failed:", src);
                reject(new Error("Script load failed: " + src));
            };

            document.body.appendChild(script);

        });
    }


    /* =========================================================
     * 🔹 對外 API
     * ========================================================= */
    return {
        load: loadModule
    };

})();


/* ============================================================
 * ⭐ 掛到全域（讓 HTML onclick 可用）
 * ============================================================ */
window.AdminLoader = AdminLoader;