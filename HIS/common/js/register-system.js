// register-system.js (核心掛號流程)
// 會使用 HIS.util.loadJSON、HIS.modal、HIS.conditionEngine
window.HIS = window.HIS || {};
HIS.register = (function(){
  // 模擬判斷：檢查是否可超掛（簡單示範）
  function finalizeRegister({ patientId, patientName, doctorId, doctorName, date, noon, userType }){
    const ts = new Date().toLocaleString();
    HIS.modal.alert(`掛號成功\n病歷：${patientId} ${patientName}\n醫師：${doctorName}\n日期：${date}\n時段：${noon}\n時間：${ts}`, "掛號成功");
  }

  // 嘗試掛號入口
  // opts: { userType, patientId, patientName, doctorId, doctorName, date, noon }
  function tryRegister(opts){
    opts = opts || {};
    const userType = opts.userType || "Q1";
    const timePeriod = (opts.noonLabel) ? opts.noonLabel : HIS.util.getTimePeriod();
    // 實作檢查邏輯時，可把檢查回呼傳入
    const check = HIS.conditionEngine.checkAll(userType, timePeriod, (rule)=>{
      // 範例檢查：隨機允許（實務請以實際判斷替換）
      // 這裡回傳 true 表示通過該條件
      return Math.random() > 0.2;
    });

    if (!check.ok) {
      // 若不允許則視 userType 決定是否彈出確認
      if (["Q4","Q5"].includes(userType)) {
        HIS.modal.confirm(`此醫師已達上限：${check.failedRule}。是否仍然掛號？`, ()=>{
          finalizeRegister(opts);
        }, ()=>{
          // 取消
        }, "額滿，但可覆核");
      } else {
        HIS.modal.alert(`已達掛號限制（規則：${check.failedRule}），無法掛號`, "掛號失敗");
      }
    } else {
      finalizeRegister(opts);
    }
  }

  return { tryRegister };
})();
