// ==UserScript==
// @name         RSI - Felder ausblenden
// @namespace    PumpkinHollow
// @version      1.0
// @description  Blendet bestimmte Eingabefelder aus
// @match        https://rettungssimulator.online/*
// @updateURL    https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-Felder-ausblenden.js
// @downloadURL  https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-Felder-ausblenden.js
// @icon         https://github.com/xPumpkinHollow99x/Bilder/raw/main/pumpkinhollow.png
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        #newNameInput,
        #newMissionHousenumberInput,
        #newMissionCustomText {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();
