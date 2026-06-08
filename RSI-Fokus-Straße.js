// ==UserScript==
// @name         RSI - Fokus Straße
// @namespace    PumpkinHollow
// @version      1.0.0
// @description  Setzt "." ins erste Feld und fokussiert danach Straße/Objekt
// @match        https://rettungssimulator.online/missionNew/*
// @updateURL    https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-Fokus-Straße.js
// @downloadURL  https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-Fokus-Straße.js
// @icon         https://github.com/xPumpkinHollow99x/Bilder/raw/main/pumpkinhollow.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function run() {

        const nameInput = document.getElementById("newMissionNameInput");
        const roadInput = document.getElementById("newMissionRoadInput");

        // 1. Erstes Feld nur mit "."
        if (nameInput) {
            nameInput.focus();
            nameInput.value = ".";

            nameInput.dispatchEvent(new Event("input", { bubbles: true }));
            nameInput.dispatchEvent(new Event("change", { bubbles: true }));
        }

        // 2. Danach Fokus auf Straße / Objekt
        setTimeout(() => {

            if (roadInput) {
                roadInput.focus();
                roadInput.scrollIntoView({ block: "center" });

                try {
                    roadInput.setSelectionRange(0, 0);
                } catch (e) {}
            }

        }, 200);

    }

    // Warten bis Seite geladen ist
    const interval = setInterval(() => {

        const name = document.getElementById("newMissionNameInput");
        const road = document.getElementById("newMissionRoadInput");

        if (name || road) {
            clearInterval(interval);
            run();
        }

    }, 200);

})();
