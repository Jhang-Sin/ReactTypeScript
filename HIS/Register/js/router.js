document.addEventListener('DOMContentLoaded', () => {
  const menuLinks = document.querySelectorAll('#menu a');
  const content = document.getElementById('content');

  menuLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      try {
        const res = await fetch(`pages/${page}`);
        const html = await res.text();
        content.innerHTML = html;
      } catch (err) {
        content.innerHTML = `<p style="color:red;">載入 ${page} 失敗。</p>`;
      }
    });
  });
});