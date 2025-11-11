document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const keyword = document.getElementById("searchInput").value.trim();
      searchDoctors(keyword);
    });
  }
});
