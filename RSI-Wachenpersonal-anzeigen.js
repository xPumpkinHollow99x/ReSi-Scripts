// ==UserScript==
// @name         RSI - Wachenpersonal anzeigen
// @namespace    PumpkinHollow
// @version      2.1
// @description  Zeigt die aktuelle Personalanzahl direkt neben der Wache an
// @match        https://rettungssimulator.online/*
// @updateURL    https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-Wachenpersonal-anzeigen.js
// @downloadURL  https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-Wachenpersonal-anzeigen.js
// @icon         https://github.com/xPumpkinHollow99x/Bilder/raw/main/pumpkinhollow.png
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const CACHE = new Map();

    async function loadDepartment(url) {
        try {
            const response = await fetch(url, {
                credentials: 'include'
            });

            if (!response.ok) return null;

            return await response.text();
        } catch (err) {
            console.error('Fehler beim Laden der Wache:', err);
            return null;
        }
    }

    function extractPersonnel(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const rows = [...doc.querySelectorAll('tr')];

        for (const row of rows) {
            const firstTd = row.querySelector('td');

            if (!firstTd) continue;

            const label = firstTd.textContent.trim();

            if (label !== 'Personal') continue;

            const span = row.querySelector('td:nth-child(2) span');

            if (!span) return null;

            const text = span.textContent.trim();

            // Beispiel:
            // 41 / 12 / 29
            // => nur erste Zahl holen

            const match = text.match(/^(\d+)/);

            if (!match) return null;

            return parseInt(match[1], 10);
        }

        return null;
    }

    function createBadge() {
        const badge = document.createElement('span');

        badge.style.marginLeft = '8px';
        badge.style.fontWeight = 'bold';
        badge.style.fontSize = '12px';
        badge.style.padding = '2px 6px';
        badge.style.borderRadius = '6px';
        badge.style.background = '#1e1e1e';
        badge.style.display = 'inline-block';

        return badge;
    }

    async function processStation(element) {
        if (element.dataset.personnelLoaded) return;

        const link = element.querySelector('a');

        if (!link) return;

        const url = link.href;

        if (!url.includes('/department/')) return;

        element.dataset.personnelLoaded = '1';

        const badge = createBadge();
        badge.textContent = '👥 ...';
        badge.style.color = '#4fc3f7';

        element.appendChild(badge);

        try {
            let personnel;

            if (CACHE.has(url)) {
                personnel = CACHE.get(url);
            } else {
                const html = await loadDepartment(url);

                if (!html) {
                    badge.textContent = '👥 Fehler';
                    badge.style.color = '#ff5252';
                    return;
                }

                personnel = extractPersonnel(html);

                CACHE.set(url, personnel);
            }

            if (personnel === null) {
                badge.textContent = '👥 ?';
                badge.style.color = '#ff5252';
                return;
            }

            badge.textContent = `👥 ${personnel}`;

            if (personnel <= 5) {
                badge.style.color = '#ff5252';
            } else if (personnel <= 15) {
                badge.style.color = '#ffa726';
            } else {
                badge.style.color = '#66bb6a';
            }

        } catch (err) {
            console.error(err);

            badge.textContent = '👥 Fehler';
            badge.style.color = '#ff5252';
        }
    }

    function scanStations() {
        const stations = document.querySelectorAll(
            'span.frame-opener[frame-url*="department/"]'
        );

        stations.forEach(processStation);
    }

    const observer = new MutationObserver(() => {
        scanStations();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    scanStations();

})();
