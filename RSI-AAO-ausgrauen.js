// ==UserScript==
// @name         RSI - AAO ausgrauen
// @namespace    PumpkinHollow
// @version      1.3
// @description  Graut alle AAOs aus, die nicht zum Missionsnamen passen
// @author       ChatGPT
// @match        https://rettungssimulator.online/*
// @updateURL    https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-AAO-ausgrauen.js
// @downloadURL  https://raw.githubusercontent.com/xPumpkinHollow99x/ReSi-Scripts/main/RSI-AAO-ausgrauen.js
// @icon         https://github.com/xPumpkinHollow99x/Bilder/raw/main/pumpkinhollow.png
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const GREY_OPACITY = '0.20';

    // =====================================================
    // Text normalisieren
    // =====================================================

    function normalize(text) {

        return text
            .toLowerCase()
            .replace(/ä/g, 'ae')
            .replace(/ö/g, 'oe')
            .replace(/ü/g, 'ue')
            .replace(/ß/g, 'ss')
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // =====================================================
    // Missionsname holen
    // =====================================================

    function getMissionName() {

        // Originalname bevorzugen
        const realMission =
            document.querySelector(
                '#realMissionNameIcon'
            );

        if (realMission) {

            const tooltip =
                realMission.getAttribute(
                    'data-tooltip'
                );

            if (tooltip) {
                return normalize(tooltip);
            }
        }

        // Fallback
        const missionName =
            document.querySelector(
                '#missionName'
            );

        if (missionName) {
            return normalize(
                missionName.textContent
            );
        }

        return '';
    }

    // =====================================================
    // AAOs holen
    // =====================================================

    function getAAOs() {

        return document.querySelectorAll(
            '.all-vehicle .mission-aao'
        );
    }

    // =====================================================
    // Reset
    // =====================================================

    function resetAAO(aao) {

        aao.style.opacity = '1';
        aao.style.filter = 'none';
        aao.style.transition =
            'all 0.2s ease';
    }

    // =====================================================
    // Ausgrauen
    // =====================================================

    function greyAAO(aao) {

        aao.style.opacity = GREY_OPACITY;
        aao.style.filter =
            'grayscale(100%)';
    }

    // =====================================================
    // Vergleich
    // =====================================================
    // Ignoriert Text vor/nach Missionsnamen
    //
    // Beispiel:
    //
    // Mission:
    // brand im supermarkt
    //
    // Erlaubt:
    // fw | brand im supermarkt
    // brand im supermarkt - groß
    // aa0 brand im supermarkt
    //
    // Nicht erlaubt:
    // zimmerbrand
    // brand klein
    // =====================================================

    function matchesMission(
        missionName,
        aaoName
    ) {

        return aaoName.includes(
            missionName
        );
    }

    // =====================================================
    // Hauptfunktion
    // =====================================================

    function applyFilter() {

        const missionName =
            getMissionName();

        if (!missionName) {
            return;
        }

        const aaos =
            getAAOs();

        if (!aaos.length) {
            return;
        }

        aaos.forEach(aao => {

            resetAAO(aao);

            const nameElement =
                aao.querySelector(
                    '.mission-aao-name'
                );

            if (!nameElement) {
                return;
            }

            const aaoName =
                normalize(
                    nameElement.textContent
                );

            const isMatch =
                matchesMission(
                    missionName,
                    aaoName
                );

            if (!isMatch) {
                greyAAO(aao);
            }
        });
    }

    // =====================================================
    // Observer
    // =====================================================

    let timeout;

    const observer =
        new MutationObserver(() => {

            clearTimeout(timeout);

            timeout = setTimeout(() => {
                applyFilter();
            }, 150);
        });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial
    setTimeout(applyFilter, 1000);

})();
