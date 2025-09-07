const splitNames = ["K1","K2","V1","V2","S1","S2","M1","M2","P1","P2","E1","END"];
const splits = splitNames.map(name => ({ name, current: "", best: "", diff: "" }));

function renderSplits() {
  const list = document.getElementById("split-list");
  list.innerHTML = "";
  splits.forEach((s, idx) => {
    const label = document.createElement("div");
    label.textContent = s.name;
    label.className = "label";

    const currentInput = document.createElement("input");
    currentInput.value = s.current;
    currentInput.placeholder = "0:00";
    currentInput.addEventListener("input", () => { 
      splits[idx].current = currentInput.value; 
      updateTotals(); 
    });
    currentInput.id = `current-${idx}`;

    const bestInput = document.createElement("input");
    bestInput.value = s.best;
    bestInput.placeholder = "0:00";
    bestInput.addEventListener("input", () => { 
      splits[idx].best = bestInput.value; 
      updateTotals(); 
    });
    bestInput.id = `best-${idx}`;

    const diffDiv = document.createElement("div");
    diffDiv.className = "diff";
    diffDiv.id = `diff-${idx}`;
    diffDiv.textContent = "";

    list.appendChild(label);
    list.appendChild(currentInput);
    list.appendChild(bestInput);
    list.appendChild(diffDiv);
  });
}

function updateTotals() {
  let lastBest = 0;
  let lastCurrent = 0;
  splits.forEach((s, idx) => {
    const current = toSeconds(s.current);
    const best = toSeconds(s.best);
    const currentCumulative = current || lastCurrent;
    const bestCumulative = best || lastBest;
    const diffDiv = document.getElementById(`diff-${idx}`);
    if(currentCumulative && bestCumulative) {
      const diff = currentCumulative - bestCumulative;
      s.diff = diff;
      diffDiv.textContent = formatSigned(diff);
      diffDiv.className = "diff " + diffClass(diff);
    } else diffDiv.textContent = "";
    lastCurrent = currentCumulative;
    lastBest = bestCumulative;
  });
  document.getElementById("current-total").textContent = formatTime(lastCurrent);
  document.getElementById("best-total").textContent = formatTime(lastBest);
  document.getElementById("diff-total").textContent = formatSigned(lastCurrent - lastBest);
}

function resetCurrentTimes() {
  splits.forEach((s, idx) => {
    s.current = "";
    document.getElementById(`current-${idx}`).value = "";
  });
  updateTotals();
}

function setNachoBest() {
  const nachoTimes = ["0:53","2:00","2:56","4:26","5:30","6:59","7:53","9:08","10:35","12:38","13:34","15:07"];
  splits.forEach((s, idx) => {
    s.best = nachoTimes[idx] || "";
    document.getElementById(`best-${idx}`).value = s.best;
  });
  updateTotals();
}

function toSeconds(t){ if(!t) return 0; const parts=t.split(":").map(Number); if(parts.length===2) return parts[0]*60+parts[1]; return 0; }
function formatTime(sec){ const m=Math.floor(sec/60); const s=sec%60; return `${m}:${s.toString().padStart(2,'0')}`; }
function formatSigned(sec){ if(sec===0) return "±0"; const sign=sec<0?"-":"+"; return `${sign}${formatTime(Math.abs(sec))}`; }
function diffClass(diff){ if(diff<-10)return"gold"; if(diff<0)return"ahead"; if(diff>0)return"behind"; return""; }

renderSplits(); 
updateTotals();
