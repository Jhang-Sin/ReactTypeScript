window.AdminModules = {  ///const改成window.全域-20260228沒有s
    dbcheck: {
        name: "掛號資料表檢核",
        page: "admin_dbcheck.html",
        scripts: [  // ← 改這裡 有s        
            "../js/maintain.js","../js/admin_dbcheck.js"]  //20260227-增加maintain.JS載入

    },
    dbviewer: {
        name: "Data + Schema 展示",
        page: "pages/admin_dbviewer.html",
       scripts: ["../js/admin_dbviewer.js"] //20260227-單檔案也使用scripts(帶s)
    }
};
