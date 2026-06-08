// ==UserScript==
// @name         RSI - Oeffnet den Call
// @namespace    PumpkinHollow
// @version      1.0
// @description  Öffnet automatisch alle Rückfragen
// @match        https://rettungssimulator.online/*
// @updateURL    https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-Oeffnet-den-Call.js
// @downloadURL  https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-Oeffnet-den-Call.js
// @icon         https://github.com/xPumpkinHollow99x/Bilder/raw/main/pumpkinhollow.png
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function clickAnswerButtons() {
        const answers = ["name", "place", "object", "injured"];

        answers.forEach(type => {
            const btn = document.querySelector(`.answer-button[answer="${type}"]`);

            if (btn && !btn.classList.contains("clicked-by-script")) {
                btn.classList.add("clicked-by-script");

                // kleiner Delay, damit UI sauber reagiert
                setTimeout(() => {
                    btn.click();
                }, 100);
            }
        });
    }

    // Initial versuchen
    clickAnswerButtons();

    // Beobachtet DOM (weil Spiel dynamisch lädt)
    const observer = new MutationObserver(() => {
        clickAnswerButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
