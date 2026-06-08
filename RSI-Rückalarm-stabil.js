// ==UserScript==
// @name         RSI - Rückalarm stabil
// @namespace    PumpkinHollow
// @version      6.1
// @match        https://rettungssimulator.online/*
// @updateURL    https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-Rückalarm-stabil.js
// @downloadURL  https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-Rückalarm-stabil.js
// @icon         https://github.com/xPumpkinHollow99x/Bilder/raw/main/pumpkinhollow.png
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const DELAY = 120;

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function createButton() {
        const card = document.querySelector('.card.onscene');

        if (!card || document.getElementById('rsi-backalarm')) {
            return;
        }

        const btn = document.createElement('button');
        btn.id = 'rsi-backalarm';
        btn.textContent = '🚨 Alle Fahrzeuge rückalarmieren';

        Object.assign(btn.style, {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            background: '#c62828',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
        });

        btn.addEventListener('click', async () => {
    const els = [...document.querySelectorAll('.vehicle-backalarm[uservehicleid]')];

    if (!els.length) {
        alert('Keine Fahrzeuge gefunden.');
        return;
    }

    btn.disabled = true;
    btn.style.opacity = '0.7';

    const BATCH_SIZE = 5;   // Anzahl pro Block
    const PAUSE = 200;      // Pause zwischen Blöcken

    for (let i = 0; i < els.length; i += BATCH_SIZE) {
        const batch = els.slice(i, i + BATCH_SIZE);

        // parallel innerhalb des Batches
        batch.forEach(el => el.click());

        await new Promise(r => setTimeout(r, PAUSE));
    }

    btn.disabled = false;
    btn.style.opacity = '1';
});

        card.prepend(btn);
    }

    // einmal nach DOM-Load
    window.addEventListener('load', createButton);

})();
