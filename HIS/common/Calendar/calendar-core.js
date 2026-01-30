/* =====================================================
 * HIS Calendar Core
 * 純資料模型，不含任何 DOM
 * ===================================================== */

window.HIS = window.HIS || {};
HIS.Calendar = HIS.Calendar || {};

HIS.Calendar.Core = class {

  constructor(options = {}) {
    this.today = this._normalizeDate(options.today || new Date());
    this.defaultDays = options.defaultDays || 30;

    this.minDay = this.today;
    this.maxDay = this._addDays(this.minDay, this.defaultDays - 1);

    this.disabledDates = new Set(
      (options.disabledDates || []).map(d => this._format(d))
    );

    this.dataMap = new Map(); // yyyy-mm-dd → any
  }

  /* =========================
   * Public API
   * ========================= */

  setRange(minDay, maxDay) {
    this.minDay = this._normalizeDate(minDay);
    this.maxDay = this._normalizeDate(maxDay);
  }

  setData(date, payload) {
    this.dataMap.set(this._format(date), payload);
  }

  getDays() {
    const days = [];
    let cur = new Date(this.minDay);

    while (cur <= this.maxDay) {
      const key = this._format(cur);

      days.push({
        date: new Date(cur),
        key,
        isToday: key === this._format(this.today),
        isDisabled: this.disabledDates.has(key),
        data: this.dataMap.get(key) || null
      });

      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }

  moveMonth(offset) {
    const base = new Date(this.minDay);
    base.setMonth(base.getMonth() + offset);

    this.minDay = this._normalizeDate(base);
    this.maxDay = this._addDays(this.minDay, this.defaultDays - 1);
  }

  /* =========================
   * Utils
   * ========================= */

  _normalizeDate(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  _addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }

  _format(d) {
    const x = new Date(d);
    return x.toISOString().slice(0, 10);
  }
};
