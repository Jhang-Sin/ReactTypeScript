document.addEventListener("DOMContentLoaded", () => {
  console.log("[router.js] initialized ✅");

  const links = document.querySelectorAll("[data-page]");
  const content = document.getElementById("content");

  if (!content) {
    console.error("[router.js] ❌ 找不到 #content 區域，無法載入頁面。");
    return;
  }

  // 🔹 導航列事件註冊
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      if (page) {
        console.log(`[router.js] 🔗 點擊連結，載入頁面: ${page}`);
        loadPage(`pages/${page}`); // 統一從 /pages/ 資料夾載入
      }
    });
  });

  // 🔹 載入指定頁面
  async function loadPage(page) {
    try {
      console.log(`[router.js] 🚀 載入頁面中: ${page}`);
      content.innerHTML = `<p style="text-align:center; color:gray;">正在載入頁面...</p>`;

      const res = await fetch(page);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();

      // 插入頁面內容
      content.innerHTML = html;

      // ✅ 重新執行該頁的 <script>
      const scripts = content.querySelectorAll("script[src]");
      console.log(`[router.js] 📜 準備載入 ${scripts.length} 個 script`);

      scripts.forEach(oldScript => {
        const newScript = document.createElement("script");
        let src = oldScript.getAttribute("src");

        // 🔧 修正相對路徑（確保在 Register/js 內載入）
        if (!src.startsWith("http") && !src.startsWith("/")) {
          src = `js/${src.split("/").pop()}`;
        }

        newScript.src = src;
        newScript.onload = () =>
          console.log(`[router.js] ✅ Script loaded successfully: ${src}`);
        newScript.onerror = () =>
          console.error(`[router.js] ❌ Script load failed: ${src}`);

        document.body.appendChild(newScript);
      });

      console.log(`[router.js] ✅ 頁面載入完成: ${page}`);
    } catch (err) {
      console.error(`[router.js] ❌ 載入失敗: ${err.message}`);
      content.innerHTML = `<p style="color:red; text-align:center;">載入失敗，請確認路徑或檔案存在。</p>`;
    }
  }
});
