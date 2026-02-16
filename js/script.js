const concreteWords = [
    "カニ", "ナイフ", "犬", "鳥居", "ろうそく", "風船", "リンゴ", "鍵", "時計", "鏡",
    "ヘッドフォン", "スーツケース", "傘", "手紙", "階段", "電車", "バラ", "仮面", "キャンドル", "指輪"
];
const abstractWords = [
    "境界", "静寂", "選択", "喪失", "再生", "衝動", "孤独", "祈り", "違和感", "余韻",
    "希望", "嫉妬", "赦し", "矛盾", "憧れ", "運命", "緊張", "回想", "安心", "解放"
];

let timerConcrete = null;
let timerAbstract = null;
let currentConcrete = null;
let currentAbstract = null;

const elSlotConcrete = document.getElementById("slotConcrete");
const elSlotAbstract = document.getElementById("slotAbstract");
const elCombo = document.getElementById("combo");
const elStatus = document.getElementById("status");

const btnStartConcrete = document.getElementById("startConcrete");
const btnStopConcrete = document.getElementById("stopConcrete");
const btnStartAbstract = document.getElementById("startAbstract");
const btnStopAbstract = document.getElementById("stopAbstract");

const btnStartBoth = document.getElementById("startBoth");
const btnStopBoth = document.getElementById("stopBoth");
const btnReroll = document.getElementById("reroll");

const historyKey = "artBattleRouletteHistory_v1";
const elHistoryList = document.getElementById("historyList");
const btnClearHistory = document.getElementById("clearHistory");

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function setRunning(el, running) {
    el.classList.toggle("running", running);
}

function updateCombo() {
    if (currentConcrete && currentAbstract) {
        elCombo.textContent = `${currentConcrete} × ${currentAbstract}`;
        elStatus.textContent = "両方確定！履歴に追加しました";
        addHistory(currentConcrete, currentAbstract);
    } else {
        elCombo.textContent = "—";
        elStatus.textContent = "両方STOPで履歴に追加";
    }
}

function startConcrete() {
    if (timerConcrete) return;
    setRunning(elSlotConcrete, true);
    btnStartConcrete.disabled = true;
    btnStopConcrete.disabled = false;

    currentConcrete = null;
    updateStopBothAvailability();

    timerConcrete = setInterval(() => {
        elSlotConcrete.textContent = pickRandom(concreteWords);
    }, 80);
}

function stopConcrete() {
    if (!timerConcrete) return;
    clearInterval(timerConcrete);
    timerConcrete = null;

    setRunning(elSlotConcrete, false);
    btnStartConcrete.disabled = false;
    btnStopConcrete.disabled = true;

    currentConcrete = elSlotConcrete.textContent;
    finalizeIfBothStopped();
    pawStamp(elSlotConcrete);

    elSlotConcrete.classList.remove("bounce"); void elSlotConcrete.offsetWidth; elSlotConcrete.classList.add("bounce");
    beep(660, 0.05, "sine", 0.04);
}

function startAbstract() {
    if (timerAbstract) return;
    setRunning(elSlotAbstract, true);
    btnStartAbstract.disabled = true;
    btnStopAbstract.disabled = false;

    currentAbstract = null;
    updateStopBothAvailability();

    timerAbstract = setInterval(() => {
        elSlotAbstract.textContent = pickRandom(abstractWords);
    }, 80);
}

function stopAbstract() {
    if (!timerAbstract) return;
    clearInterval(timerAbstract);
    timerAbstract = null;

    setRunning(elSlotAbstract, false);
    btnStartAbstract.disabled = false;
    btnStopAbstract.disabled = true;

    currentAbstract = elSlotAbstract.textContent;
    finalizeIfBothStopped();

    pawStamp(elSlotAbstract);

    elSlotAbstract.classList.remove("bounce"); void elSlotAbstract.offsetWidth; elSlotAbstract.classList.add("bounce");
    beep(660, 0.05, "sine", 0.04);
}

function finalizeIfBothStopped() {
    updateStopBothAvailability();

    if (currentConcrete && currentAbstract) {
        updateCombo();
        if (!limitsRunning && limitsSec === LIMITS_TOTAL) startLimits();

    } else {
        elStatus.textContent = "もう片方もSTOPで確定";
    }
}

function updateStopBothAvailability() {
    const anyRunning = Boolean(timerConcrete || timerAbstract);
    btnStopBoth.disabled = !anyRunning;
}

function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem(historyKey)) ?? [];
    } catch {
        return [];
    }
}

function saveHistory(items) {
    localStorage.setItem(historyKey, JSON.stringify(items));
}

function addHistory(conc, abs) {
    const now = new Date();
    const stamp = now.toLocaleString("ja-JP", { hour12: false });

    const items = loadHistory();

    if (items[0] && items[0].conc === conc && items[0].abs === abs) return;

    items.unshift({ conc, abs, stamp });

    saveHistory(items.slice(0, 50));
    renderHistory();
}

function renderHistory() {
    const items = loadHistory();
    elHistoryList.innerHTML = "";

    if (items.length === 0) {
        const li = document.createElement("li");
        li.innerHTML = `<span>履歴はまだありません</span><small>まずは回してみよう</small>`;
        elHistoryList.appendChild(li);
        return;
    }

    for (const it of items) {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${it.conc} × ${it.abs}</strong><small>${it.stamp}</small>`;
        elHistoryList.appendChild(li);
    }
}

function startBoth() {
    startConcrete();
    startAbstract();
    btnStopBoth.disabled = false;
    elStatus.textContent = "回転中…好きなタイミングでSTOP";
    elCombo.textContent = "—";
}

function stopBoth() {
    if (timerConcrete) stopConcrete();
    if (timerAbstract) stopAbstract();
    updateStopBothAvailability();
}

function rerollInstant() {
    currentConcrete = pickRandom(concreteWords);
    currentAbstract = pickRandom(abstractWords);

    elSlotConcrete.textContent = currentConcrete;
    elSlotAbstract.textContent = currentAbstract;

    setRunning(elSlotConcrete, false);
    setRunning(elSlotAbstract, false);

    if (timerConcrete) { clearInterval(timerConcrete); timerConcrete = null; }
    if (timerAbstract) { clearInterval(timerAbstract); timerAbstract = null; }
    btnStartConcrete.disabled = false;
    btnStopConcrete.disabled = true;
    btnStartAbstract.disabled = false;
    btnStopAbstract.disabled = true;
    btnStopBoth.disabled = true;

    updateCombo();
}

btnStartConcrete.addEventListener("click", startConcrete);
btnStopConcrete.addEventListener("click", stopConcrete);
btnStartAbstract.addEventListener("click", startAbstract);
btnStopAbstract.addEventListener("click", stopAbstract);

btnStartBoth.addEventListener("click", startBoth);
btnStopBoth.addEventListener("click", stopBoth);
btnReroll.addEventListener("click", rerollInstant);

btnClearHistory.addEventListener("click", () => {
    localStorage.removeItem(historyKey);
    renderHistory();
    elStatus.textContent = "履歴を消しました";
});

renderHistory();
updateStopBothAvailability();

function pawStamp(targetEl) {
    const stamp = document.createElement("div");
    stamp.textContent = "🐾";
    stamp.style.position = "absolute";
    stamp.style.right = "14px";
    stamp.style.top = "12px";
    stamp.style.fontSize = "18px";
    stamp.style.opacity = "0";
    stamp.style.transform = "scale(.6) rotate(-12deg)";
    stamp.style.transition = "all .25s ease";
    stamp.style.filter = "grayscale(.25)";

    targetEl.style.position = "relative";
    targetEl.appendChild(stamp);

    requestAnimationFrame(() => {
        stamp.style.opacity = "0.9";
        stamp.style.transform = "scale(1) rotate(-6deg)";
    });

    setTimeout(() => stamp.remove(), 650);
}

const LIMITS_TOTAL = 20 * 60;

let limitsSec = LIMITS_TOTAL;
let limitsTimerId = null;
let limitsRunning = false;

const elLimitsTime = document.getElementById("limitsTime");
const elLimitsSub = document.getElementById("limitsSub");
const btnLimitsStart = document.getElementById("limitsStart");
const btnLimitsPause = document.getElementById("limitsPause");
const btnLimitsReset = document.getElementById("limitsReset");
const elTimerBar = document.querySelector(".timerBar");

function fmtMMSS(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function renderLimits() {
    elLimitsTime.textContent = fmtMMSS(limitsSec);
    elTimerBar.classList.toggle("timerWarn", limitsSec <= 60 && limitsSec > 0);
}
renderLimits();

function syncLimitsBtns() {
    btnLimitsStart.disabled = limitsRunning;
    btnLimitsPause.disabled = !limitsRunning;
}

elLimitsSub.textContent = "両方STOPで自動スタート（本番音源はYouTubeで再生）";

let audioCtx = null;
function beep(freq = 880, dur = 0.08, type = "sine", gain = 0.05) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") audioCtx.resume();

        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = type;
        o.frequency.value = freq;
        g.gain.value = gain;

        o.connect(g); g.connect(audioCtx.destination);
        o.start();
        setTimeout(() => o.stop(), dur * 1000);
    } catch (e) {
    }
}

function stopLimitsInternal() {
    if (limitsTimerId) clearInterval(limitsTimerId);
    limitsTimerId = null;
    limitsRunning = false;
    syncLimitsBtns();
}

function tickLimits() {
    limitsSec -= 1;
    if (limitsSec < 0) limitsSec = 0;
    renderLimits();

    if (limitsSec === 5 * 60) {
        elLimitsSub.textContent = "残り5分 — 仕上げに入ろう！";
        beep(740, 0.06, "sine", 0.04);

        elLimitsTime.classList.remove("bounce");
        void elLimitsTime.offsetWidth;
        elLimitsTime.classList.add("bounce");

        setTimeout(() => {
            if (limitsRunning) elLimitsSub.textContent = "制作中…";
        }, 8000);
    }

    if (limitsSec === 60) {
        elLimitsSub.textContent = "残り1分 — 最終調整！";

        elLimitsTime.classList.remove("bounce");
        void elLimitsTime.offsetWidth;
        elLimitsTime.classList.add("bounce");

        beep(880, 0.06, "sine", 0.05);
        setTimeout(() => {
            if (limitsRunning) elLimitsSub.textContent = "制作中…";
        }, 8000);
    }

    if (limitsSec === 3) beep(880, 0.07, "sine", 0.06);
    if (limitsSec === 2) beep(988, 0.07, "sine", 0.06);
    if (limitsSec === 1) beep(1108, 0.07, "sine", 0.06);

    if (limitsSec === 0) {
        stopLimitsInternal();

        elLimitsSub.textContent = "TIME UP — 次のテーマを引いてみよう！";

        elLimitsTime.classList.remove("bounce");
        void elLimitsTime.offsetWidth;
        elLimitsTime.classList.add("bounce");

        beep(660, 0.12, "triangle", 0.07);
        setTimeout(() => beep(990, 0.14, "triangle", 0.07), 120);

        const dog = document.getElementById("dogLogo");
        dog.classList.remove("dogHappy");
        void dog.offsetWidth;
        dog.classList.add("dogHappy");
    }
}

function startLimits() {
    if (limitsRunning) return;
    if (limitsSec === 0) limitsSec = LIMITS_TOTAL;

    limitsRunning = true;
    syncLimitsBtns();
    elLimitsSub.textContent = "制作中…";

    const dog = document.getElementById("dogLogo");
    dog.classList.remove("dogHappy");
    void dog.offsetWidth;
    dog.classList.add("dogHappy");

    beep(523, 0.06, "sine", 0.05);
    setTimeout(() => beep(784, 0.06, "sine", 0.05), 90);

    limitsTimerId = setInterval(tickLimits, 1000);
}

function pauseLimits() {
    if (!limitsRunning) return;
    stopLimitsInternal();
    elLimitsSub.textContent = "一時停止中";
    beep(440, 0.06, "sine", 0.04);
}

function resetLimits() {
    stopLimitsInternal();
    limitsSec = LIMITS_TOTAL;
    renderLimits();
    elLimitsSub.textContent = "両方STOPで自動スタート（本番音源はYouTubeで再生）";
    beep(392, 0.06, "sine", 0.04);
}

btnLimitsStart.addEventListener("click", startLimits);
btnLimitsPause.addEventListener("click", pauseLimits);
btnLimitsReset.addEventListener("click", resetLimits);