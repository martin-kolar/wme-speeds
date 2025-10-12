import { WmeSDK } from "wme-sdk-typings";
import { getTranslations } from "./config.js";
import type { Segment } from "wme-sdk-typings";

window.SDK_INITIALIZED.then(initScript);

function initScript() {
  const _layerName = 'wmeSpeedlimits';
  const _config = {
    wmeSpeedsColors: ['#ff0000', '#321325', '#540804', '#BA1200', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55'],
    wmeSpeedsColorsMph: ['#ff0000', '#321325', '#702632', '#540804', '#A00027', '#BA1200', '#F15872', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55', '#000000'],
    wmeSpeedsMaxSpeed: 130,
    wmeSpeedsMaxMphSpeed: 85,
    wmeSpeedsOtherDrivableSegments: [8, 20, 17, 15],
    wmeSpeedsNonDrivableSegments: [5, 9, 10, 16, 18, 19],
    wmeSpeedsMiles: false,
    wmeSpeedsKmphToMphRatio: 0.621371192,
    speedsForTab: null as string[] | null,
    wmeSpeedsInvertSpeedsColors: null as boolean | null,
    wmeSpeedsInvertNonDrivableSpeedsColors: null as boolean | null,
    wmeSpeedsOtherDrivableSpeedsColors: null as boolean | null,
    wmeSpeedsTransparentColors: null as boolean | null,
    wmeSpeedsHighlightOneWay: false
  }

  if (!window.getWmeSdk) {
    throw new Error("SDK not available");
  }
  const wmeSDK: WmeSDK = window.getWmeSdk(
    {
      scriptId: "wme-speedlimits",
      scriptName: "WME Speedlimits"
    }
  )

  console.debug(`SDK v. ${wmeSDK.getSDKVersion()} on ${wmeSDK.getWMEVersion()} initialized`)

  function getTranslation(key: string): string {
    const localeCode = wmeSDK.Settings.getLocale().localeCode
    return getTranslations(localeCode)[key] || key
  }

  function setKeyboardShortcuts() {
    wmeSDK.Shortcuts.createShortcut({
      callback: () => {
        wmeSDK.LayerSwitcher.setLayerCheckboxChecked({
          name: _layerName,
          isChecked: !wmeSDK.LayerSwitcher.isLayerCheckboxChecked({ name: _layerName }),
        })

        drawSegments()
        saveSettings()
      },
      description: getTranslation("scriptName") + " shortcut",
      shortcutId: _layerName + "-shortcut",
      shortcutKeys: "A+s",
    })
  }

  function getStylesRules() {
    let rules = [];

    rules.push({
      predicate: (featureProperties: any) => !!featureProperties.nonDrivable,
      style: {
        strokeColor: '#DC0073',
        strokeWidth: 8,
        strokeOpacity: _config.wmeSpeedsTransparentColors ? .5 : 1
      },
    })

    rules.push({
      predicate: (featureProperties: any) => !!featureProperties.problemSegments,
      style: {
        strokeColor: '#DC0073',
        strokeWidth: 8,
        strokeOpacity: _config.wmeSpeedsTransparentColors ? .5 : 1
      },
    })

    var colors = _config.wmeSpeedsColors;

    if (_config.wmeSpeedsMiles) {
      colors = _config.wmeSpeedsColorsMph;
    }

    colors.forEach((color, index) => {
      rules.push({
        predicate: (featureProperties: any) => !!featureProperties[`speed${index}`],
        style: {
          strokeColor: color,
          strokeWidth: 8,
          strokeOpacity: _config.wmeSpeedsTransparentColors ? .5 : 1
        },
      })

      rules.push({
        predicate: (featureProperties: any) => !!featureProperties[`speedFwd${index}`],
        style: {
          strokeColor: color,
          strokeDashstyle: "0 20 20 0",
          strokeLinecap: "butt",
          strokeWidth: 8,
          strokeOpacity: _config.wmeSpeedsTransparentColors ? .75 : 1
        },
      })

      rules.push({
        predicate: (featureProperties: any) => !!featureProperties[`speedRev${index}`],
        style: {
          strokeColor: color,
          strokeDashstyle: "10 0 10 20",
          strokeLinecap: "butt",
          strokeWidth: 8,
          strokeOpacity: _config.wmeSpeedsTransparentColors ? .75 : 1
        },
      })
    })

    return rules;
  }

  function addLayer() {
    _config.wmeSpeedsTransparentColors = getLocalStorage()[4];

    const layer = wmeSDK.Map.addLayer({
      layerName: _layerName,
      styleRules: getStylesRules()
    });

    wmeSDK.LayerSwitcher.addLayerCheckbox({
      name: _layerName,
    })

    wmeSDK.LayerSwitcher.setLayerCheckboxChecked({
        name: _layerName,
        isChecked: getLocalStorage()[7] || false,
    });
  }

  function addEventListeners() {
    wmeSDK.Events.once({ eventName: "wme-ready" }).then(wmeReady)
    wmeSDK.Events.on({ eventName: "wme-map-move", eventHandler: drawSegments })
    wmeSDK.Events.on({ eventName: "wme-map-data-loaded", eventHandler: drawSegments })
    wmeSDK.Events.on({
      eventName: "wme-layer-checkbox-toggled",
      eventHandler: (event) => {
        console.log('wme-layer-checkbox-toggled', event);

        if (event.name === _layerName) {
          drawSegments()
          saveSettings()
        }
      }
    })
  }

  function wmeReady() {
    getId('_wmeSpeedsInvert').addEventListener('change', settingsChanged)
    getId('_wmeSpeedsOtherDrivable').addEventListener('change', settingsChanged)
    getId('_wmeSpeedsTransparentColors').addEventListener('change', () => {
      _config.wmeSpeedsTransparentColors = getId('_wmeSpeedsTransparentColors').checked;
      resetLayers()
      settingsChanged()
    });
    getId('_wmeSpeedsInvertNonDrivable').addEventListener('change', settingsChanged)

    drawSegments()
  }

  function resetLayers() {
    wmeSDK.Map.removeLayer({
      layerName: _layerName
    });


    const layer = wmeSDK.Map.addLayer({
      layerName: _layerName,
      styleRules: getStylesRules()
    });

  }

  function settingsChanged() {
    drawSegments();
    saveSettings();
  }

  function getContrastColor(hex_color: string) {
    var r = parseInt(hex_color.substr(1, 2), 16);
    var g = parseInt(hex_color.substr(3, 2), 16);
    var b = parseInt(hex_color.substr(5, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  async function addScriptTab() {
    function optionHtml(labelId: string, title_t: string, content_t: string): string {
      return `
        <li style="list-style-type: none;">
          <label class="wz-checkbox" title="${getTranslation(content_t)}" style="align-items: flex-start;cursor: pointer;display: flex;font-size: 14px;min-height: 24px;outline: none;user-select: none;">
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

    const { tabLabel, tabPane } = await wmeSDK.Sidebar.registerScriptTab()
    tabLabel.innerText = getTranslation("scriptName")

    var speedsTemplate = function() {
      _config.speedsForTab = _config.wmeSpeedsMiles ? _config.wmeSpeedsColorsMph : _config.wmeSpeedsColors;

      var speedTemplate = '<div style="display:grid;gap:5px;grid-template-columns:repeat(3, 1fr);margin-bottom: 15px;">';

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
        .${_layerName} .wz-checkbox input:checked + .border {
          background-color: var(--primary_variant, #0075e3) !important;
          border: 2px solid var(--primary_variant, #0075e3) !important;
        }
        .${_layerName} .wz-checkbox input:checked + .border .mask {
          clip-path: circle(0 at center) !important;
        }
      </style>
      <div class="${_layerName}">
        <h3 style="margin-bottom: 15px;font-size: 20px; text-align:center;">${getTranslation('speedsHeadline')}</h3>

        <ul style="list-style-type: none;padding:0;display:grid;gap:2px;margin-bottom:10px;">
          ${optionHtml('_wmeSpeedsInvert', 'invertSpeedsTitle', 'invertSpeedsContent')}
          ${optionHtml('_wmeSpeedsInvertNonDrivable', 'invertSpeedsTitleNonDrivable', 'invertSpeedsContentNonDrivable')}
          ${optionHtml('_wmeSpeedsOtherDrivable', 'noSpeedsSegmentsOtherTitle', 'noSpeedsSegmentsOtherContent')}
          ${optionHtml('_wmeSpeedsTransparentColors', 'transparentColorsTitle', 'transparentColorsContent')}
        </ul>

        ${speedsTemplate()}

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
    getId('_wmeSpeedsInvert').checked = storageData[1];
    getId('_wmeSpeedsOtherDrivable').checked = storageData[3];
    getId('_wmeSpeedsTransparentColors').checked = storageData[4];
    getId('_wmeSpeedsInvertNonDrivable').checked = storageData[6];
  }

  function getLocalStorage(): any {
    if (localStorage.WMESpeedsScript) {
      return JSON.parse(localStorage.WMESpeedsScript);
    }

    return {
      options: [null, false, false, false, false, null, false, false]
    }
  };

  function drawSegment(segment: Segment, layerProperties: Record<string, any>): void {
    wmeSDK.Map.addFeatureToLayer(
      {
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
      }
    )
  }

  function getId(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
  }

  function drawSegments(): void {
    wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: _layerName });

    type SpeedInfo = {
      nonDrivableType: boolean;
      otherDrivableType: boolean;
      direction: boolean;
      value: number;
      exact: boolean;
      index: number;
      color: string;
    };

    function getSpeedValue(speed: number): number {
      if (_config.wmeSpeedsMiles) {
        return Math.round(speed * _config.wmeSpeedsKmphToMphRatio);
      }

      return speed;
    }

    function proceedSpeed(segment: Segment, direction: 'fwd' | 'rev'): SpeedInfo {
      var speed = direction === 'fwd' ? segment.fwdSpeedLimit : segment.revSpeedLimit;
      var speedValue = -1;
      var speedExact = false;
      var speedIndex = 0;

      if (speed !== null) {
        speedValue = getSpeedValue(speed);
        speedExact = (speedValue % speedDiv) === 0;

        if (speedValue >= maxSpeed) {
          speedIndex = Math.ceil(maxSpeed / speedDiv);
        } else {
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
      }
    }

    if (wmeSDK.LayerSwitcher.isLayerCheckboxChecked({ name: _layerName })) {
      var segments: Segment[] = wmeSDK.DataModel.Segments.getAll()

      _config.wmeSpeedsInvertSpeedsColors = getId('_wmeSpeedsInvert').checked;
      _config.wmeSpeedsInvertNonDrivableSpeedsColors = getId('_wmeSpeedsInvertNonDrivable').checked;
      _config.wmeSpeedsOtherDrivableSpeedsColors = getId('_wmeSpeedsOtherDrivable').checked;
      _config.wmeSpeedsHighlightOneWay = false;

      var speedDiv = _config.wmeSpeedsMiles ? 5 : 10;
      var maxSpeed = _config.wmeSpeedsMiles ? _config.wmeSpeedsMaxMphSpeed : _config.wmeSpeedsMaxSpeed;
      var speedsColors = _config.wmeSpeedsMiles ? _config.wmeSpeedsColorsMph : _config.wmeSpeedsColors;

      segments.forEach(segment => {
        var fwdSpeed: SpeedInfo = proceedSpeed(segment, 'fwd');
        var revSpeed: SpeedInfo = proceedSpeed(segment, 'rev');

        if (_config.wmeSpeedsOtherDrivableSpeedsColors && fwdSpeed.otherDrivableType) {
          if (fwdSpeed.value >= 0 || revSpeed.value >= 0) {
            drawSegment(segment, {
              nonDrivable: 1
            });
          }

          return;
        }

        if (_config.wmeSpeedsInvertSpeedsColors) {
          if (((fwdSpeed.value === -1 && fwdSpeed.direction) || (revSpeed.value === -1 && revSpeed.direction))) {
            drawSegment(segment, {
              problemSegments: 1
            });
          }
          return;
        }

        if (_config.wmeSpeedsInvertNonDrivableSpeedsColors && !fwdSpeed.nonDrivableType) {
          if (((fwdSpeed.value === -1 && fwdSpeed.direction) || (revSpeed.value === -1 && revSpeed.direction))) {
            drawSegment(segment, {
              problemSegments: 1
            });
          }
          return;
        }

        if (fwdSpeed.nonDrivableType) {
          return;
        }

        if (fwdSpeed.value === revSpeed.value || (fwdSpeed.value >= 0 && !revSpeed.direction) || (revSpeed.value >= -1 && !fwdSpeed.direction)) {
          drawSegment(segment, {
            [`speed${fwdSpeed.direction ? fwdSpeed.index : revSpeed.index}`]: 1
          });
        }
        else {
          drawSegment(segment, {
            [`speedFwd${fwdSpeed.index}`]: 1
          });

          drawSegment(segment, {
            [`speedRev${revSpeed.index}`]: 1
          });
        }
      })
    }
  }

  function saveSettings(): void {
    if (localStorage) {
      var options = [];

      if (localStorage.WMESpeedsScript) {
        options = JSON.parse(localStorage.WMESpeedsScript);
      }

      options[1] = getId('_wmeSpeedsInvert').checked;
      options[3] = getId('_wmeSpeedsOtherDrivable').checked;
      options[4] = getId('_wmeSpeedsTransparentColors').checked;
      options[6] = getId('_wmeSpeedsInvertNonDrivable').checked;
      options[7] = wmeSDK.LayerSwitcher.isLayerCheckboxChecked({ name: _layerName });

      localStorage.WMESpeedsScript = JSON.stringify(options);
    }
  }

  function init(): void {
    _config.wmeSpeedsMiles = wmeSDK.Settings.getUserSettings().isImperial ?? false;
    addScriptTab()
    setKeyboardShortcuts()
    addLayer()
    addEventListeners()
  }

  init()
}
