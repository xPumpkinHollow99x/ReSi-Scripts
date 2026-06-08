// ==UserScript==
// @name         RSI - Missionshud
// @namespace    PumpkinHollow
// @version      2.0
// @description  Type-ID + ELW2 + Patienten HUD
// @match        https://rettungssimulator.online/mission*
// @updateURL    https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-Missionshud.js
// @downloadURL  https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-Missionshud.js
// @icon         https://github.com/xPumpkinHollow99x/Bilder/raw/main/pumpkinhollow.png
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // =========================
    // 🔎 DATA LAYER
    // =========================

    function getMissionTypeId() {
        const el = document.querySelector('.detail-title[missionid]');
        return el ? el.getAttribute('missionid') : null;
    }

    function needsELW2() {
        const cells = document.querySelectorAll("table td");
        const missing = document.querySelector("#missingVehicles");

        const checkText = (text) => {
            const t = text.replace(/\s+/g, " ").toLowerCase();
            return (
                t.includes("einsatzleitwagen 2") ||
                t.includes("abrollbehälter einsatzleitung")
            );
        };

        for (const c of cells) {
            if (checkText(c.textContent)) return true;
        }

        if (missing && checkText(missing.textContent)) {
            return true;
        }

        return false;
    }

    function getPatientInfo() {
    const el = document.querySelector("#patientCountHeader");

    if (!el) return { active: false, text: "" };

    const match = el.textContent.match(/(\d+)/);
    const count = match ? parseInt(match[1], 10) : 0;

    return {
        active: count > 0,
        text: count > 0 ? el.textContent.replace(/\s+/g, " ").trim() : ""
    };
}

    // =========================
    // 🧱 UI LAYER
    // =========================

    function createBox() {
        const box = document.createElement("div");
        box.id = "rsi-hud";

        box.style.position = "fixed";
        box.style.top = "10px";
        box.style.left = "50%";
        box.style.transform = "translateX(-50%)";

        box.style.background = "rgba(0,0,0,0.88)";
        box.style.color = "#00ffcc";

        box.style.padding = "8px 16px";
        box.style.borderRadius = "10px";

        box.style.fontSize = "18px";
        box.style.fontWeight = "bold";

        box.style.zIndex = "999999";
        box.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

        document.body.appendChild(box);

        return box;
    }

    function applyELWStyle(box, active) {
        let el = document.getElementById("elw-warning");

        if (!active) {
            if (el) el.remove();
            return;
        }

        if (!el) {
            el = document.createElement("span");
            el.id = "elw-warning";
            box.appendChild(el);
        }

        el.textContent = " | 🚨 ELW2";
        el.style.color = "#ff3b3b";
        el.style.animation = "blink 1s infinite";
    }

    function applyPatientStyle(box, patient) {
    let el = document.getElementById("patient-info");

    // ❌ KEINE Patienten → komplett entfernen
    if (!patient.active) {
        if (el) el.remove();
        return;
    }

    // ✅ nur erstellen wenn nötig
    if (!el) {
        el = document.createElement("span");
        el.id = "patient-info";
        box.appendChild(el);
    }

    el.textContent = ` | 🧑‍⚕️ ${patient.text}`;
    el.style.color = "#ff3b3b";
    el.style.animation = "blink 1s infinite";
}

    // =========================
    // 🚀 INIT
    // =========================

    const style = document.createElement("style");
    style.textContent = `
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.25; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    function init() {
        const id = getMissionTypeId();
        if (!id) return;

        const box = createBox();

        function render() {
            const elw = needsELW2();
            const patient = getPatientInfo();

            box.innerHTML = `Mission Type-ID: ${id}`;

            applyELWStyle(box, elw);
            applyPatientStyle(box, patient);
        }

        render();
    }

    setTimeout(init, 2000);

})();
