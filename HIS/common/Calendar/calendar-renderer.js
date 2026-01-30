/* =====================================================
 * HIS Calendar Renderer
 * ===================================================== */

HIS.Calendar.Renderer = class {

  constructor(core, options = {}) {
    this.core = core;
    this.container = options.container;
    this.onCellClick = options.onCellClick || (() => {});
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = "";
    this.container.classList.add("his-calendar");

    this.container.appendChild(this._renderHeader());
    this.container.appendChild(this._renderTable());
  }

  /* ========================= */

  _renderHeader() {
    const div = document.createElement("div");
    div.className = "his-calendar__header";

    const btnPrev = this._btn("← Last Month", () => {
      this.core.moveMonth(-1);
      this.render();
    });

    const btnToday = this._btn("Today", () => {
      this.core.setRange(new Date(), this.core._addDays(new Date(), this.core.defaultDays - 1));
      this.render();
    });

    const btnNext = this._btn("Next Month →", () => {
      this.core.moveMonth(1);
      this.render();
    });

    div.append(btnPrev, btnToday, btnNext);
    return div;
  }

  _renderTable() {
    const table = document.createElement("table");
    table.className = "his-calendar__table";

    const tr = document.createElement("tr");
    this.core.getDays().forEach(day => {
      const td = document.createElement("td");
      td.className = "his-calendar__cell";

      if (day.isDisabled) td.classList.add("is-disabled");
      if (day.isToday) td.classList.add("is-today");

      td.innerHTML = `
        <div class="date">${day.key}</div>
        <div class="content"></div>
      `;

      if (day.data) {
        td.querySelector(".content").append(
          typeof day.data === "function"
            ? day.data(day)
            : document.createTextNode(day.data)
        );
      }

      if (!day.isDisabled) {
        td.onclick = () => this.onCellClick(day);
      }

      tr.appendChild(td);
    });

    table.appendChild(tr);
    return table;
  }

  _btn(text, handler) {
    const b = document.createElement("button");
    b.textContent = text;
    b.onclick = handler;
    return b;
  }
};
