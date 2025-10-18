// ==UserScript==
// @name        WME Speedlimits
// @namespace   https://greasyfork.org/cs/scripts/12402-wme-speeds
// @version     1.0.3
// @description Adds colours to road segments to show their speeds
// @author      Martin Kolář
// @match       https://www.waze.com/editor*
// @match       https://beta.waze.com/editor*
// @match       https://www.waze.com/*/editor*
// @match       https://beta.waze.com/*/editor*
// @exclude     https://www.waze.com/user/editor*
// @exclude     https://beta.waze.com/user/editor*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNjg3OEY2RjhFMEIxMUU1OTU1MUU5MjA0ODlFQjA1MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowNjg3OEY3MDhFMEIxMUU1OTU1MUU5MjA0ODlFQjA1MCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA2ODc4RjZEOEUwQjExRTU5NTUxRTkyMDQ4OUVCMDUwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA2ODc4RjZFOEUwQjExRTU5NTUxRTkyMDQ4OUVCMDUwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Dhzo6gAABIFJREFUeNqsV2tMU1kQnsWiVhG6Irrro1Br9IcJoMFH1j+AURLEB2CMGBWNIIgmZhMX/W+IupsYV+NzXR9IEE00+KpBjfiE4ApWs/5YHhbqA4EFWhArwg9nTs+9PffS1kthki/33plzZubcM3Nmju7aSNBKIYhliARELMKECOMyJ8KGsCLKEbcQn7Qo/UGDAzMQuxEZiLEane1BXEQcQNT7GxjkRzYasR/xGpE1COPAx2bxuQe4rkE5YEZU8pWPhMCJ5uZzXTO8DdB54c1FWBCT1IKwuAUweVUaRCQkgt5oBF1oKOP3d3WBy26HtvL78KH0KjifV6mnUsw8QSQjavzFAHlZgYgQmaFz4mB63g4wbszUtGx74XmwHT8Kzpp/1KI2xC9iXIgO6PmvihFnGDdlQ+zJUwH9f2tuDtjPDpj7CrEQ4aKPERkjZEEBIl0RCDt3QfThIwEHwE8py6G/uwc6qypENm1tMOKe6AAFXRF9yyvfvBWi/zwMQ6WJS5aC630zOK3VIns+T9MOKQv2cK/cwTZ3HsSeOAnDRaSLdAoUzG2yLBjHDxmZTLl5CgVXrpbCqdNnBigus1yX3588rYDii5eg4Y0NzNNNsHJFCiQtXeLRuW07WLM3idPXIn4N4qkxVkw1Y6ZiINTW1fldIRnfW7CfGSei58FDR6Dszl1PMGMGkW7VYZVMDiwWuVNS030aohWLkOjYcfd2rVu7hvHpSXS+sAi+o3sxORAtcibEJwww/ODhY59O/VdbC+0dnew9MTGePVOWJbMn8UnuR3d0EM8AmcaYTD6NJSWvgLwdO1lMuFwsjaGxsUmWT5s6lT3Dw8fLPFHuRbeZgjBUcTaHhChGvH33TvFN+0t4Xl0N+wr2Diob1LrJtu57k2hV0n7Tqi23y1hG1Lx4yYJvqERb0CUy+j/57iP0ej2kp63yFP2eHoiKipS/29s7FE8iUe5Fdxc50CByPttsihGkTFQophYpnzVzJoSP/5F937xl4UH7yB0LyCe5L91kW8eLg5yg/z8oB0NcnDyC9ppyWk2UapLyzI3r2ZjikssMEuVty1HMId3qwkS1YAy+rJY4X7G2R23J8rjY8AZ6e3uh+WOLu1mYEwMZaDw9LdVTw81mmBgxAVpb26Cz08FOws2ZGyAxIV5h7d/8XfDlgyKo/6ByTEdxs3gaxv51TnPt10r2C4VgzVLo/EwFk2KgG1EiSqiZGG7yopOqYbdUDan57JMk1MlQMzFcRLqc1c9EVh9vVuV+oIP3/YtkJ7B+UzNB9Xwo9Dr/N2g8MSCIDyIuqTuip4jlYjNKnQw1E9TZBLpyL8Yp6zZIf1x0oJ+3SYoLCP2JjxYLBI0aBWExMdoDLjcbWm/f8NaUJiFa/N2MfLblhnkL4eeVqe62PDISgg0G94Y6HOBqamJtefP1UnA8q/TmV4uWtlxsz6+oS/UQ6BVveOu13ozq+en4u5gdAVAf17HA1x3R393wC7+azUac5geHVqJm4W8+dzfXFfDtWLyep6iu5wYuc6iu5ze1Xs+/CTAA2tuMX1dHe2oAAAAASUVORK5CYII
// @grant       none
// ==/UserScript==

(function () {
    'use strict';

    const i18n = {
        cs: {
            'scriptName': 'WME Speeds',
            'speedsHeadline': 'Barvy segmentů dle rychlostí',
            'forumLink': '<a href="https://www.waze.com/forum/viewtopic.php?f=22&t=166406" target="_blank">České fórum</a>',
            'author': 'Autor: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (5)</a>',
            'version': 'Verze:',
            'invertSpeedsTitleNonDrivable': 'Zobrazit pouze segmenty bez rychlostí',
            'hideWithoutSpeeds': 'Skrýt segmenty bez rychlostí',
            'noSpeedsSegmentsOtherTitle': 'Skrýt rychlosti na nedůležitých segmentech',
            'transparentColorsTitle': 'Průsvitné barvy',
            'dashedHint': 'Bíle přerušovaná barva znamená, že rychlostní limit není kulaté číslo.'
        },
        sk: {
            'tabName': 'R',
            'speedsHeadline': 'Farby segmentov podľa rýchlostí',
            'forumLink': '<a href="https://www.waze.com/forum/viewtopic.php?f=22&t=166406" target="_blank">České fórum</a>',
            'author': 'Autor: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (CZ)</a>',
            'version': 'Verzia:',
            'invertSpeedsTitleNonDrivable': 'Invertovať farby rýchlostí (pouze s možností nastavení rychlosti)',
            'invertSpeedsContentNonDrivable': 'Zvýrazní iba segmenty bez rýchlosti (sjízdné) (červená)',
            'invertSpeedsTitle': 'Invertovať farby rýchlostí',
            'invertSpeedsContent': 'Zvýrazní iba segmenty bez rýchlosti (červená)',
            'noSpeedsSegmentsTitle': 'Nezjazdné segmenty s rýchlosťou',
            'noSpeedsSegmentsContent': 'Zvýrazní nezjazdné segmenty s rýchlosťami (ružová)',
            'noSpeedsSegmentsOtherTitle': 'Inak zjazdné segmenty s rýchlosťou',
            'noSpeedsSegmentsOtherContent': 'Zvýrazní inak zjazdné segmenty s rýchlosťami (ružová)',
            'transparentColorsTitle': 'Priehľadné farby',
            'transparentColorsContent': 'Spriehľadniť farby rýchlostí',
            'unverifiedSegmentsTitle': 'Nepotvrdené rýchlosti na segmentoch',
            'unverifiedSegmentsContent': 'Zvýrazniť nepotvrdené rýchlosti na segmentoch',
            'scriptName': 'WME Speeds',
            'layerName': 'Rýchlosti'
        },
        en: {
            'scriptName': 'WME Speeds',
            'speedsHeadline': 'Colors by speed',
            'forumLink': '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">English discussion</a>',
            'author': 'Author: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (CZ)</a>',
            'version': 'Version:',
            'invertSpeedsTitleNonDrivable': 'Show only segments without speeds',
            'hideWithoutSpeeds': 'Hide segments without speeds',
            'noSpeedsSegmentsOtherTitle': 'Hide speeds on other-drivable segments without speeds',
            'transparentColorsTitle': 'Transparent color',
            'dashedHint': 'White dashed styles mean that the speed limit is not round number.'
        },
        he: {
            'tabName': 'S',
            'speedsHeadline': 'מקרא מהירויות לפי צבעים',
            'forumLink': '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">דיון בפורום (אנגלית)</a>',
            'author': 'יוצר התוסף: martinkolar (CZ)',
            'version': 'גרסא:',
            'invertSpeedsTitleNonDrivable': 'הדגש את כל המקטעים ללא מהירות מוגדרת',
            'invertSpeedsContentNonDrivable': 'הדגש מקטעים מותרים לנהיגה ללא מהירות מוגדרת (אדום)',
            'invertSpeedsTitle': 'הפוך הגדרות',
            'invertSpeedsContent': 'הדגש מקטעים ללא מהירות מוגדרת (אדום)',
            'noSpeedsSegmentsTitle': 'מקטעים שאינם ניתנים לנהיגה עם מהירות מוגדרת',
            'noSpeedsSegmentsContent': 'הדגש מקטעים שאינם ניתנים לנהיגה עם מהירות מוגדרת (ורוד)',
            'noSpeedsSegmentsOtherTitle': 'אחר- מקטעים המותרים לנהיגה עם מהירות מוגדרת',
            'noSpeedsSegmentsOtherContent': 'הדגש מקטעים המותרים לנהיגה עם מהירות מוגדרת (ורוד)',
            'transparentColorsTitle': 'מצב שקיפות',
            'transparentColorsContent': 'הפעל מצב שקיפות צבעי מהירויות',
            'unverifiedSegmentsTitle': 'הדגש מקטעים לא מאומתים',
            'unverifiedSegmentsContent': 'הדגש מקטעים לא מאומתים',
            'scriptName': 'WME Speeds',
            'layerName': 'מהירויות'
        },
        pl: {
            'scriptName': 'WME Speeds',
            'layerName': 'Ograniczenia prękości',
            'tabName': 'P',
            'speedsHeadline': 'Kolory ograniczeń prędkości',
            'forumLink': 'Forum: <a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">angielskie</a> | <a href="https://www.waze.com/forum/viewtopic.php?f=22&t=166406" target="_blank">czeskie</a>',
            'author': 'Autor: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (CZ)</a>',
            'version': 'Wersja:',
            'invertSpeedsTitleNonDrivable': 'Inwersja kolorów (tylko z opcją ograniczenia)',
            'invertSpeedsContentNonDrivable': 'Zaznacza drogi bez ustawionych ograniczeń prędkości z dostępną opcją ograniczenia (czerwony)',
            'invertSpeedsTitle': 'Inwersja kolorów',
            'invertSpeedsContent': 'Zaznacza drogi bez ustawionych ograniczeń prędkości (czerwony)',
            'noSpeedsSegmentsTitle': 'Nieprzejezdne drogi z prędkościami',
            'noSpeedsSegmentsContent': 'Zaznacza nieprzejezdne drogi z ustawionymi ograniczeniami prędkości (różowy)',
            'noSpeedsSegmentsOtherTitle': 'Inne przejezdne drogi z prędkościami',
            'noSpeedsSegmentsOtherContent': 'Zaznacza inne przejezdne drogi z ustawionymi ograniczeniami prędkości (różowy)',
            'transparentColorsTitle': 'Przeźroczyste kolory',
            'transparentColorsContent': 'Przeźroczyste kolory ograniczeń',
            'unverifiedSegmentsTitle': 'Niezweryfikowane prędkości',
            'unverifiedSegmentsContent': 'Wyróżnia segmenty z niezweryfikowanymi ograniczeniami prędkości'
        }
    };
    function getTranslations(localeCode) {
        return i18n[localeCode] || i18n['en'];
    }

    window.SDK_INITIALIZED.then(initScript);
    function initScript() {
        if (!window.getWmeSdk) {
            throw new Error("SDK not available");
        }
        const wmeSDK = window.getWmeSdk({
            scriptId: "wme-speedlimits",
            scriptName: "WME Speedlimits"
        });
        const _layerName = getTranslation('scriptName');
        const _styleName = 'wmeSpeedlimits';
        const _config = {
            wmeSpeedsColors: ['#e300ff', '#321325', '#540804', '#BA1200', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55'],
            wmeSpeedsColorsMph: ['#e300ff', '#321325', '#702632', '#540804', '#A00027', '#BA1200', '#F15872', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55', '#000000'],
            wmeSpeedsMaxSpeed: 130,
            wmeSpeedsMaxMphSpeed: 85,
            wmeSpeedsOtherDrivableSegments: [8, 20, 17, 15],
            wmeSpeedsNonDrivableSegments: [5, 9, 10, 16, 18, 19],
            wmeSpeedsMiles: false,
            wmeSpeedsKmphToMphRatio: 0.621371192,
            speedsForTab: null,
            wmeSpeedsInvertNonDrivableSpeedsColors: null,
            wmeSpeedsOtherDrivableSpeedsColors: null,
            wmeSpeedsTransparentColors: null,
            wmeSpeedsHideWithoutSpeeds: null,
            wmeSpeedsHighlightOneWay: false
        };
        console.debug(`SDK v. ${wmeSDK.getSDKVersion()} on ${wmeSDK.getWMEVersion()} initialized`);
        function getTranslation(key) {
            const localeCode = wmeSDK.Settings.getLocale().localeCode;
            return getTranslations(localeCode)[key] || key;
        }
        function setKeyboardShortcuts() {
            wmeSDK.Shortcuts.createShortcut({
                callback: () => {
                    wmeSDK.LayerSwitcher.setLayerCheckboxChecked({
                        name: _layerName,
                        isChecked: !wmeSDK.LayerSwitcher.isLayerCheckboxChecked({ name: _layerName }),
                    });
                    drawSegments();
                    saveSettings();
                },
                description: getTranslation("scriptName") + " shortcut",
                shortcutId: _styleName + "-shortcut",
                shortcutKeys: "A+s",
            });
        }
        function getStylesRules() {
            let rules = [];
            rules.push({
                predicate: (featureProperties) => !!featureProperties.problemSegment,
                style: {
                    strokeColor: '#e300ff',
                    strokeWidth: 8,
                    strokeOpacity: _config.wmeSpeedsTransparentColors ? .5 : 1
                },
            });
            var colors = _config.wmeSpeedsColors;
            if (_config.wmeSpeedsMiles) {
                colors = _config.wmeSpeedsColorsMph;
            }
            colors.forEach((color, index) => {
                rules.push({
                    predicate: (featureProperties) => !!featureProperties[`speed${index}`],
                    style: {
                        strokeColor: color,
                        strokeWidth: 8,
                        strokeOpacity: _config.wmeSpeedsTransparentColors ? .5 : 1
                    },
                });
                rules.push({
                    predicate: (featureProperties) => !!featureProperties[`speedFwd${index}`],
                    style: {
                        strokeColor: color,
                        strokeDashstyle: '0 20 20 0',
                        strokeLinecap: 'butt',
                        strokeWidth: 8,
                        strokeOpacity: _config.wmeSpeedsTransparentColors ? .75 : 1
                    },
                });
                rules.push({
                    predicate: (featureProperties) => !!featureProperties[`speedRev${index}`],
                    style: {
                        strokeColor: color,
                        strokeDashstyle: '20 20',
                        strokeLinecap: 'butt',
                        strokeWidth: 8,
                        strokeOpacity: _config.wmeSpeedsTransparentColors ? .75 : 1
                    },
                });
            });
            rules.push({
                predicate: (featureProperties) => !!featureProperties.nonExactSpeed,
                style: {
                    strokeColor: '#ffffff',
                    strokeDashstyle: '2 8 2 8',
                    strokeLinecap: 'butt',
                    strokeWidth: 8,
                    strokeOpacity: _config.wmeSpeedsTransparentColors ? .75 : 1
                },
            });
            rules.push({
                predicate: (featureProperties) => !!featureProperties.nonExactSpeedFwd,
                style: {
                    strokeColor: '#ffffff',
                    strokeDashstyle: '0 20 2 8 2 8 0 0',
                    strokeLinecap: 'butt',
                    strokeWidth: 8,
                    strokeOpacity: _config.wmeSpeedsTransparentColors ? .75 : 1
                },
            });
            rules.push({
                predicate: (featureProperties) => !!featureProperties.nonExactSpeedRev,
                style: {
                    strokeColor: '#ffffff',
                    strokeDashstyle: '2 8 2 8 0 20',
                    strokeLinecap: 'butt',
                    strokeWidth: 8,
                    strokeOpacity: _config.wmeSpeedsTransparentColors ? .75 : 1
                },
            });
            return rules;
        }
        function addLayer() {
            _config.wmeSpeedsTransparentColors = getLocalStorage()[4];
            wmeSDK.Map.addLayer({
                layerName: _layerName,
                styleRules: getStylesRules()
            });
            wmeSDK.LayerSwitcher.addLayerCheckbox({
                name: _layerName,
            });
            wmeSDK.LayerSwitcher.setLayerCheckboxChecked({
                name: _layerName,
                isChecked: getLocalStorage()[7] || false,
            });
        }
        function addEventListeners() {
            wmeSDK.Events.once({ eventName: "wme-ready" }).then(wmeReady);
            wmeSDK.Events.on({ eventName: "wme-map-move", eventHandler: drawSegments });
            wmeSDK.Events.on({ eventName: "wme-map-data-loaded", eventHandler: drawSegments });
            wmeSDK.Events.on({
                eventName: "wme-layer-checkbox-toggled",
                eventHandler: (event) => {
                    if (event.name === _layerName) {
                        drawSegments();
                        saveSettings();
                    }
                }
            });
        }
        function wmeReady() {
            getId('_wmeSpeedsOtherDrivable').addEventListener('change', settingsChanged);
            getId('_wmeSpeedsTransparentColors').addEventListener('change', () => {
                _config.wmeSpeedsTransparentColors = getId('_wmeSpeedsTransparentColors').checked;
                resetLayers();
                settingsChanged();
            });
            getId('_wmeSpeedsInvertNonDrivable').addEventListener('change', settingsChanged);
            getId('_wmeSpeedsHideWithoutSpeeds').addEventListener('change', settingsChanged);
            drawSegments();
        }
        function resetLayers() {
            wmeSDK.Map.removeLayer({
                layerName: _layerName
            });
            wmeSDK.Map.addLayer({
                layerName: _layerName,
                styleRules: getStylesRules()
            });
        }
        function settingsChanged() {
            drawSegments();
            saveSettings();
        }
        function getContrastColor(hex_color) {
            var r = parseInt(hex_color.substr(1, 2), 16);
            var g = parseInt(hex_color.substr(3, 2), 16);
            var b = parseInt(hex_color.substr(5, 2), 16);
            var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return (yiq >= 128) ? 'black' : 'white';
        }
        async function addScriptTab() {
            function optionHtml(labelId, title_t) {
                return `
        <li style="list-style-type: none;">
          <label class="wz-checkbox" style="align-items: flex-start;cursor: pointer;display: flex;font-size: 14px;min-height: 24px;outline: none;user-select: none;">
            <input type="checkbox" name="" value="on" id="${labelId}" style="display:none;">
            <div class="border" style="border: 2px solid var(--hairline_strong, #90959c);border-radius: 3px;box-sizing: border-box;display: inline-block;flex-shrink: 0;height: 18px;margin-inline-end: var(--wz-checkbox-margin, var(--space-always-s, 12px));position: relative;width: 18px;">
              <div class="fill" style="background: var(--primary_variant, #0075e3);height: 100%;position: absolute;width: 100%;"></div>
              <div class="mask" style="background: var(--background_default, #ffffff);clip-path: circle(10px at center);height: 100%;position: absolute;transition: 100ms cubic-bezier(0.25, 0.1, 0.25, 1);width: 100%;"></div>
              <svg width="14px" height="14px" viewBox="0 0 24 24" style="position: absolute;stroke: var(--on_primary, #ffffff);stroke-width: 2;"><g fill="none"><polygon fill="#ffffff" points="9.5 15.5 6 12 4.5 13.5 9.5 18.5 20 8 18.5 6.5"></polygon></g></svg>
            </div>
            <span class="label" style="font-family: var(--wz-font-family);color: var(--content_default, #202124);font-weight: normal;-webkit-transition: 0.25s;transition: 0.25s;">${getTranslation(title_t)}</span>
          </label>
        </li>
      `;
            }
            const { tabLabel, tabPane } = await wmeSDK.Sidebar.registerScriptTab();
            tabLabel.innerHTML = `
      <span style="display:flex;align-items:center;justify-content:center;height:100%;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 233 233" width="20" height="20"><g fill="none" fill-rule="evenodd"><circle stroke="red" stroke-width="25" cx="116.5" cy="116.5" r="104"/><g fill="#000" fill-rule="nonzero"><path d="m46.4 137.2 19.1-2q.8 6.6 4.9 10.3a13 13 0 0 0 19.4-1q4.2-5 4.2-14.8 0-9.2-4.1-13.8-4.2-4.6-10.8-4.6-8.3 0-14.8 7.3l-15.6-2.3 9.8-52.1h50.8v18H73.1l-3 17a29 29 0 0 1 13.1-3.3q12.8 0 21.7 9.3t8.9 24.2q0 12.3-7.2 22a32 32 0 0 1-27.2 13.3q-13.8 0-22.6-7.4-8.7-7.5-10.4-20M156.4 62.4q14.5 0 22.8 10.4Q189 85 189 113.6t-9.9 40.9a27 27 0 0 1-22.7 10.2q-14.6 0-23.6-11.2-9-11.3-9-40.1 0-28.3 10-40.8 8-10.2 22.6-10.2m0 15.9q-3.5 0-6.2 2.2t-4.2 8q-2 7.5-2 25 0 17.8 1.8 24.3 1.7 6.6 4.4 8.8a10 10 0 0 0 6.2 2.2q3.5 0 6.2-2.2t4.3-8q2-7.5 2-25a109 109 0 0 0-1.8-24.3q-1.8-6.6-4.5-8.8a10 10 0 0 0-6.2-2.2"/></g></g></svg>
      </span>`;
            var speedsTemplate = function () {
                _config.speedsForTab = _config.wmeSpeedsMiles ? _config.wmeSpeedsColorsMph : _config.wmeSpeedsColors;
                var speedTemplate = '<div style="display:grid;gap:5px;grid-template-columns:repeat(3, 1fr);margin-bottom: 15px;">';
                speedTemplate += '<div style="background-color: ' + _config.wmeSpeedsColors[0] + ';padding:2px 0;border-radius:5px;color:' + getContrastColor(_config.wmeSpeedsColors[0]) + ';font-size:14px;text-align:center;">---</div>';
                for (var i = 1; i < _config.speedsForTab.length; i++) {
                    var actualSpeedForTab;
                    if ((i + 1) === _config.speedsForTab.length) {
                        if (_config.wmeSpeedsMiles) {
                            actualSpeedForTab = ' &gt; ' + _config.wmeSpeedsMaxMphSpeed + '&nbsp;mph';
                        }
                        else {
                            actualSpeedForTab = ' &gt; ' + _config.wmeSpeedsMaxSpeed + '&nbsp;km/h';
                        }
                    }
                    else if (_config.wmeSpeedsMiles) {
                        actualSpeedForTab = (i * 5) + '&nbsp;mph';
                    }
                    else {
                        actualSpeedForTab = (i * 10) + '&nbsp;km/h';
                    }
                    speedTemplate += '<div style="background-color: ' + _config.speedsForTab[i] + ';padding:2px 0;border-radius:5px;color:' + getContrastColor(_config.speedsForTab[i]) + ';font-size:14px;text-align:center;">' + actualSpeedForTab + '</div>';
                }
                speedTemplate += '</div>';
                return speedTemplate;
            };
            tabPane.innerHTML = `
      <style type="text/css">
        .${_styleName} .wz-checkbox input:checked + .border {
          background-color: var(--primary_variant, #0075e3) !important;
          border: 2px solid var(--primary_variant, #0075e3) !important;
        }
        .${_styleName} .wz-checkbox input:checked + .border .mask {
          clip-path: circle(0 at center) !important;
        }
      </style>
      <div class="${_styleName}">
        <h3 style="margin-bottom: 15px;font-size: 20px; text-align:center;">${getTranslation('speedsHeadline')}</h3>

        <ul style="list-style-type: none;padding:0;display:grid;gap:2px;margin-bottom:10px;">

          ${optionHtml('_wmeSpeedsInvertNonDrivable', 'invertSpeedsTitleNonDrivable')}
          ${optionHtml('_wmeSpeedsHideWithoutSpeeds', 'hideWithoutSpeeds')}
          ${optionHtml('_wmeSpeedsOtherDrivable', 'noSpeedsSegmentsOtherTitle')}
          ${optionHtml('_wmeSpeedsTransparentColors', 'transparentColorsTitle')}
        </ul>

        ${speedsTemplate()}

        <p style="font-size:12px;">
          ${getTranslation('dashedHint')}
        </p>
        <p style="font-size:12px;">
          ${getTranslation('forumLink')}
          <br>
          ${getTranslation('author')}
          <br>
          ${getTranslation('version')} <a href="https://greasyfork.org/scripts/12402" target="_blank">${GM_info.script.version}</a>
        </p>
      </div>
    `;
            let storageData = getLocalStorage();
            getId('_wmeSpeedsOtherDrivable').checked = storageData[3];
            getId('_wmeSpeedsTransparentColors').checked = storageData[4];
            getId('_wmeSpeedsInvertNonDrivable').checked = storageData[6];
            getId('_wmeSpeedsHideWithoutSpeeds').checked = storageData[8];
        }
        function getLocalStorage() {
            if (localStorage.WMESpeedsScript) {
                return JSON.parse(localStorage.WMESpeedsScript);
            }
            return {
                options: [null, false, false, false, false, null, false, false, false]
            };
        }
        function drawSegment(segment, layerProperties) {
            wmeSDK.Map.addFeatureToLayer({
                layerName: _layerName,
                feature: {
                    id: "wme-speedlimits-" + segment.id,
                    geometry: {
                        type: "LineString",
                        coordinates: segment.geometry.coordinates
                    },
                    type: "Feature",
                    properties: layerProperties,
                },
            });
        }
        function getId(id) {
            return document.getElementById(id);
        }
        function drawSegments() {
            wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: _layerName });
            function getSpeedValue(speed) {
                if (_config.wmeSpeedsMiles) {
                    return Math.round(speed * _config.wmeSpeedsKmphToMphRatio);
                }
                return speed;
            }
            function proceedSpeed(segment, direction) {
                var speed = direction === 'fwd' ? segment.fwdSpeedLimit : segment.revSpeedLimit;
                var speedValue = -1;
                var speedExact = false;
                var speedIndex = 0;
                if (speed !== null) {
                    speedValue = getSpeedValue(speed);
                    speedExact = (speedValue % speedDiv) === 0;
                    if (speedValue >= maxSpeed) {
                        speedIndex = Math.ceil(maxSpeed / speedDiv);
                    }
                    else {
                        speedIndex = Math.ceil(speedValue / speedDiv);
                    }
                }
                return {
                    nonDrivableType: _config.wmeSpeedsNonDrivableSegments.indexOf(segment.roadType) !== -1,
                    otherDrivableType: _config.wmeSpeedsOtherDrivableSegments.indexOf(segment.roadType) !== -1,
                    direction: segment.isTwoWay || direction === 'fwd' && segment.isAtoB || direction === 'rev' && segment.isBtoA,
                    value: speedValue,
                    exact: speedExact,
                    index: speedIndex,
                    color: _config.wmeSpeedsMiles ? _config.wmeSpeedsColorsMph[speedIndex] : _config.wmeSpeedsColors[speedIndex]
                };
            }
            if (wmeSDK.LayerSwitcher.isLayerCheckboxChecked({ name: _layerName })) {
                var segments = wmeSDK.DataModel.Segments.getAll();
                _config.wmeSpeedsInvertNonDrivableSpeedsColors = getId('_wmeSpeedsInvertNonDrivable').checked;
                _config.wmeSpeedsHideWithoutSpeeds = getId('_wmeSpeedsHideWithoutSpeeds').checked;
                _config.wmeSpeedsOtherDrivableSpeedsColors = getId('_wmeSpeedsOtherDrivable').checked;
                _config.wmeSpeedsHighlightOneWay = false;
                var speedDiv = _config.wmeSpeedsMiles ? 5 : 10;
                var maxSpeed = _config.wmeSpeedsMiles ? _config.wmeSpeedsMaxMphSpeed : _config.wmeSpeedsMaxSpeed;
                segments.forEach(segment => {
                    var fwdSpeed = proceedSpeed(segment, 'fwd');
                    var revSpeed = proceedSpeed(segment, 'rev');
                    if (fwdSpeed.nonDrivableType) {
                        return;
                    }
                    if (_config.wmeSpeedsInvertNonDrivableSpeedsColors) {
                        if (((fwdSpeed.value === -1 && fwdSpeed.direction) || (revSpeed.value === -1 && revSpeed.direction))) {
                            drawSegment(segment, {
                                problemSegment: 1
                            });
                        }
                        return;
                    }
                    if (_config.wmeSpeedsHideWithoutSpeeds) {
                        if (((fwdSpeed.value === -1 && fwdSpeed.direction) || (revSpeed.value === -1 && revSpeed.direction))) {
                            return;
                        }
                    }
                    if (_config.wmeSpeedsOtherDrivableSpeedsColors && fwdSpeed.otherDrivableType) {
                        return;
                    }
                    if (fwdSpeed.value === revSpeed.value || (fwdSpeed.value >= 0 && !revSpeed.direction) || (revSpeed.value >= -1 && !fwdSpeed.direction)) {
                        drawSegment(segment, {
                            [`speed${fwdSpeed.direction ? fwdSpeed.index : revSpeed.index}`]: 1
                        });
                        if ((!fwdSpeed.exact && fwdSpeed.direction && fwdSpeed.value > 0) || (!revSpeed.exact && revSpeed.direction && revSpeed.value > 0)) {
                            drawSegment(segment, {
                                nonExactSpeed: 1
                            });
                        }
                    }
                    else {
                        drawSegment(segment, {
                            [`speedFwd${fwdSpeed.index}`]: 1
                        });
                        if (!fwdSpeed.exact && fwdSpeed.value > 0) {
                            drawSegment(segment, {
                                nonExactSpeedFwd: 1
                            });
                        }
                        drawSegment(segment, {
                            [`speedRev${revSpeed.index}`]: 1
                        });
                        if (!revSpeed.exact && revSpeed.value > 0) {
                            drawSegment(segment, {
                                nonExactSpeedRev: 1
                            });
                        }
                    }
                });
            }
        }
        function saveSettings() {
            if (localStorage) {
                var options = [];
                if (localStorage.WMESpeedsScript) {
                    options = JSON.parse(localStorage.WMESpeedsScript);
                }
                options[3] = getId('_wmeSpeedsOtherDrivable').checked;
                options[4] = getId('_wmeSpeedsTransparentColors').checked;
                options[6] = getId('_wmeSpeedsInvertNonDrivable').checked;
                options[7] = wmeSDK.LayerSwitcher.isLayerCheckboxChecked({ name: _layerName });
                options[8] = getId('_wmeSpeedsHideWithoutSpeeds').checked;
                localStorage.WMESpeedsScript = JSON.stringify(options);
            }
        }
        function init() {
            _config.wmeSpeedsMiles = wmeSDK.Settings.getUserSettings().isImperial ?? false;
            addScriptTab();
            setKeyboardShortcuts();
            addLayer();
            addEventListeners();
        }
        init();
    }

})();
