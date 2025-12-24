// condition-engine.js
window.HIS = window.HIS || {};
HIS.conditionEngine = (function(){
  function getConditions(userType, timePeriodLabel){
    const key = timePeriodLabel === "上午" ? "morning" : "afternoon";
    const map = window.HIS.conditions && window.HIS.conditions[key] ? window.HIS.conditions[key] : {};
    return map[userType] || [];
  }

  // logicCheckFn: (rule) => boolean
  function checkAll(userType, timePeriodLabel, logicCheckFn){
    const rules = getConditions(userType, timePeriodLabel);
    for (const r of rules){
      const ok = logicCheckFn ? logicCheckFn(r) : true;
      if (!ok) return { ok:false, failedRule: r };
    }
    return { ok:true };
  }

  return { getConditions, checkAll };
})();
