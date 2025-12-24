// modal.js
window.HIS = window.HIS || {};
HIS.modal = (function(){
  function makeOverlay(){
    const ov = document.createElement("div");
    ov.className = "modal-overlay";
    return ov;
  }

  function alert(message, title){
    const ov = makeOverlay();
    const box = document.createElement("div");
    box.className = "modal-box";
    box.innerHTML = `<h3>${title||"提示"}</h3><p>${message}</p><div class="modal-buttons"><button id="m_ok">確定</button></div>`;
    ov.appendChild(box);
    document.body.appendChild(ov);
    document.getElementById("m_ok").addEventListener("click", ()=> ov.remove());
  }

  function confirm(message, onYes, onNo, title){
    const ov = makeOverlay();
    const box = document.createElement("div");
    box.className = "modal-box";
    box.innerHTML = `<h3>${title||"確認"}</h3><p>${message}</p><div class="modal-buttons"><button id="m_yes">是</button><button id="m_no">否</button></div>`;
    ov.appendChild(box);
    document.body.appendChild(ov);
    box.querySelector("#m_yes").addEventListener("click", ()=>{ ov.remove(); if (onYes) onYes();});
    box.querySelector("#m_no").addEventListener("click", ()=>{ ov.remove(); if (onNo) onNo();});
  }

  return { alert, confirm };
})();
