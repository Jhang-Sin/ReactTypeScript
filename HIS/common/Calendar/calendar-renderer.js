/* =====================================================
 * HIS Calendar Renderer
 * 負責畫面結構（Table / Cell / Click）-20260203..
 * ===================================================== */

HIS.Calendar.Renderer = class {

  constructor(core, options = {}) {
    this.core = core;
    this.container = options.container;
    this.onCellClick = options.onCellClick || (() => {});
  }

  /* =========================
   * 主要進入點
   * ========================= */
  render() {
    if (!this.container) return;

    this.container.innerHTML = "";
    this.container.classList.add("his-calendar");

    this.container.appendChild(this._renderHeader());
    this.container.appendChild(this._renderTable());
  }

  /* =====================================================
   * 行事曆 Header（上月 / Today / 下月）
   * ===================================================== */
  _renderHeader() {
    const div = document.createElement("div");
    div.className = "his-calendar__header";

    /// 上一個月 ///
    const btnPrev = this._btn("← Last Month", () => {
      this.core.moveMonth(-1);
      this.render();
    });

    /// Today（回到今天起始區間） ///
    const btnToday = this._btn("Today", () => {
      this.core.setRange(
        new Date(),
        this.core._addDays(new Date(), this.core.defaultDays - 1)
      );
      this.render();
    });

    /// 下一個月 ///
    const btnNext = this._btn("Next Month →", () => {
      this.core.moveMonth(1);
      this.render();
    });

    div.append(btnPrev, btnToday, btnNext);
    return div;
  }

  /* =====================================================
   * 行事曆 Table（7 天一列）
   * ===================================================== */
  _renderTable() {
    const table = document.createElement("table");
    table.className = "his-calendar__table";

    const days = this.core.getDays();

    let tr = null;

    days.forEach((day, index) => {

      /// 每 7 天開新一列 ///
      if (index % 7 === 0) {
        tr = document.createElement("tr");
        table.appendChild(tr);
      }

      const td = document.createElement("td");
      td.className = "his-calendar__cell";

      /// 狀態樣式 ///
      if (day.isDisabled) td.classList.add("is-disabled");
      if (day.isToday) td.classList.add("is-today");

      /* =================================================
       * 內容容器（實際顯示 / 點擊的對象）
       * ================================================= */
      const dayDiv = document.createElement("div");
      dayDiv.className = "calendar-day";
      if (day.isToday) dayDiv.classList.add("today");

      /// 日期數字 ///
      const dateDiv = document.createElement("div");
      dateDiv.className = "date";
      dateDiv.textContent = day.key;

      /// 資料內容 ///
      const contentDiv = document.createElement("div");
      contentDiv.className = "content";

      if (day.data) {
        contentDiv.append(
          typeof day.data === "function"
            ? day.data(day)
            : document.createTextNode(day.data)
        );
      }

      dayDiv.append(dateDiv, contentDiv);
      td.appendChild(dayDiv);

      /// 點擊事件（僅限有效日期） ///
      if (!day.isDisabled) {
        dayDiv.onclick = () => {
          this._clearActive(table);
          dayDiv.classList.add("active");
           td.classList.add("is-active");/////20260203-Add
          this.onCellClick(day); //畫面點擊後觸發接這
        };
      }

      tr.appendChild(td);
    });

    return table;
  }

  /* =====================================================
   * 清除已選取日期的焦點
   * ===================================================== */
  _clearActive(table) {
    table.querySelectorAll(".calendar-day.active")
      .forEach(el => el.classList.remove("active"));

        table.querySelectorAll(".his-calendar__cell.is-active")///20260203-Add清除cell點選用
    .forEach(el => el.classList.remove("is-active"));///20260203-Add清除cell點選用
  }

  /* =====================================================
   * 共用按鈕產生器
   * ===================================================== */
  _btn(text, handler) {
    const b = document.createElement("button");
    b.textContent = text;
    b.onclick = handler;
    return b;
  }
};
