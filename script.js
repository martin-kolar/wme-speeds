// ==UserScript==
// @name                WME Speeds
// @namespace           https://greasyfork.org/cs/scripts/12402-wme-speeds
// @author              Martin Kolář (based from WME Color Highlights v. 1.98)
// @description         Adds colours to road segments to show their speeds
// @include             https://editor-beta.waze.com/*
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @version             0.2.2
// @grant               none
// ==/UserScript==

(function()
{

// global variables

var wmeSpeedsVersion = "0.2.2";
var wmeSpeedsInit = false;
var wmeSpeedsColors =     ['#ff0000',    '#321325', '#540804', '#BA1200', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55'];
var wmeSpeedsTextColors = ['#000000', '#ffffff', '#ffffff', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#ffffff', '#ffffff'];
var wmeSpeedsColorsMph =     ['#ff0000',    '#321325', '#702632', '#540804', '#A00027', '#BA1200', '#F15872', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55', '#000000'];
var wmeSpeedsTextColorsMph = ['#000000', '#ffffff', '#ffffff', '#ffffff', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#ffffff', '#ffffff', '#ffffff'];
var wmeSpeedsAvailableColor = ['#ff0000', '#321325', '#702632', '#540804', '#A00027', '#BA1200', '#F15872', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55', '#ff00ff', '#000', '#ffffff', '#999999', '#DC0073'];
var wmeSpeedsMaxSpeed = 131;
var wmeSpeedsMaxMphSpeed = 86;
var wmeSpeedsLayer;
var wmeSpeedsResetColors = false;
var wmeSpeedsHardResetColors = false;
var wmeSpeedsNonDrivableSegments = [5, 10, 16, 18, 19, 20, 17, 15];
var wmeSpeedsMiles = false;
var wmeSpeedsKmphToMphRatio = 0.621371192;
var wmeSpeedsInvertSpeedsColors, wmeSpeedsHighlightOneWay, wmeSpeedsNonDrivableSpeedsColors;
var wmeSpeedsChatAddonCounter = 0;

//  language settings
var wmeSpeedsAllowLanguage = ['cs', 'en', 'sk'];
var wmeSpeedsLanguage = 'en';  //  default language
var wmeSpeedsTranslation = [];

//  cs translation
wmeSpeedsTranslation['cs'] = {
  'tabName': 'Rychlosti',
  'speedsHeadline': 'Barvy segmentů dle rychlostí',
  'forumLink': '<a href="https://www.waze.com/forum/viewtopic.php?f=22&t=166406" target="_blank">České fórum</a>',
  'author': 'Autor: martinkolar (4)',
  'version': 'Verze:',
  'invertSpeedsTitle': 'Invertovat barvy rychlostí',
  'invertSpeedsContent': 'Zvýrazní pouze segmenty bez rychlosti (červená)',
  'oneWaySpeedsTitle': 'Jednosměrky s rychlostmi',
  'oneWaySpeedsContent': 'Zvýrazní jednosměrky se špatně nastavenou rychlostí (bílá a šedá čárkovaná)',
  'noSpeedsSegmentsTitle': 'Nesjízdné segmenty s rychlostí',
  'noSpeedsSegmentsContent': 'Zvýrazní nesjízdné segmenty s rychlostmi (růžová)',
}

//  sk translation
wmeSpeedsTranslation['sk'] = {
  'tabName': 'Rýchlosti',
  'speedsHeadline': 'Farby segmentov podľa rýchlostí',
  'forumLink': '<a href="https://www.waze.com/forum/viewtopic.php?f=22&t=166406" target="_blank">České fórum</a>',
  'author': 'Autor: martinkolar (4)',
  'version': 'Verzia:',
  'invertSpeedsTitle': 'Invertovať farby rýchlostí',
  'invertSpeedsContent': 'Zvýrazní iba segmenty bez rýchlosti (červená)',
  'oneWaySpeedsTitle': 'Jednosmerky s rýchlosťami',
  'oneWaySpeedsContent': 'Zvýrazní jednosmerky s rýchlosťou nastavenou pre protismer (biela a šedá čiarkovaná)',
  'noSpeedsSegmentsTitle': 'Nezjazdné segmenty s rýchlosťou',
  'noSpeedsSegmentsContent': 'Zvýrazní nezjazdné segmenty s rýchlosťami (ružová)',
}

//  en translation
wmeSpeedsTranslation['en'] = {
  'tabName': 'Speeds',
  'speedsHeadline': 'Colors by speed',
  'forumLink': '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">English discussion</a>',
  'author': 'Author: martinkolar (CZ)',
  'version': 'Version:',
  'invertSpeedsTitle': 'Invert Speeds',
  'invertSpeedsContent': 'Highlight segments without speeds (red)',
  'oneWaySpeedsTitle': 'One-way Speeds',
  'oneWaySpeedsContent': 'Highlight one-way speeds with two speeds (white and gray dashed)',
  'noSpeedsSegmentsTitle': 'Non-drivable segments with speeds',
  'noSpeedsSegmentsContent': 'Highlight non-drivable segments with speeds (pink)',
}

/* =========================================================================== */
function highlightSpeedsSegmentsReset(event) {
  wmeSpeedsHardResetColors = true;
  highlightSpeedsSegments();
}

function highlightSpeedsSegments(event) {
  wmeSpeedsInvertSpeedsColors = getId('_wmeSpeedsInvert').checked;
  wmeSpeedsNonDrivableSpeedsColors = getId('_wmeSpeedsDrivable').checked;

  if (wmeSpeedsLanguage && me.rank >= 3) {
    wmeSpeedsHighlightOneWay = getId('_wmeSpeedsOneWay').checked;
  }
  else {
    wmeSpeedsHighlightOneWay = false;
  }

  if (wmeSpeedsLayer.getVisibility() && !wmeSpeedsHardResetColors) {
    wmeSpeedsResetColors = true;

    for (var seg in Waze.model.segments.objects) {
      var segment = Waze.model.segments.get(seg);
      var attributes = segment.attributes;
      var line = getId(segment.geometry.id);

      if (line === null) {
        continue;
      }
      // check that WME hasn't highlighted this segment
      var opacity = line.getAttribute("stroke-opacity");
      var lineWidth = line.getAttribute("stroke-width");

      if (opacity == 1 || lineWidth == 9) {
        continue;
      }

      // turn off highlights when roads are no longer visible
      var roadType = attributes.roadType;

      // if (Waze.map.zoom <= 3 && (roadType < 2 || roadType > 7 || roadType == 5)) {
      //   if (opacity > 0.1) {
      //     line.setAttribute("stroke","#dd7700");
      //     line.setAttribute("stroke-opacity",0.001);
      //     line.setAttribute("stroke-dasharray", "none");
      //   }
      //   continue;
      // }

      if (wmeSpeedsNonDrivableSegments.indexOf(roadType) != -1) {
        if (wmeSpeedsNonDrivableSpeedsColors && (typeof attributes.fwdMaxSpeed == 'number' || typeof attributes.revMaxSpeed == 'number')) {
          line.setAttribute("stroke", '#DC0073');
          line.setAttribute("stroke-opacity", 1);
          line.setAttribute("stroke-dasharray", "none");
          line.setAttribute("stroke-width", 10);
        }

        continue;
      }

      // get current state of the line
      var lineColor = line.getAttribute("stroke");

      // default colours
      var newColor = "#dd7700";
      var newOpacity = 0.001;
      var newDashes = "none";
      var newWidth = 8;

      newColor = "#fff";
      newOpacity = 1;
      newWidth = 8;

      speed1allow = attributes.fwdDirection;
      speed2allow = attributes.revDirection;

      if (!speed1allow && !speed2allow) {
        continue;
      }

      if (speed1allow && typeof attributes.fwdMaxSpeed == 'number') {
        if (wmeSpeedsMiles) {
          speed1Full = kmphToMph(attributes.fwdMaxSpeed);
        }
        else {
          speed1Full = attributes.fwdMaxSpeed;
        }

        if (wmeSpeedsMiles && speed1Full >= wmeSpeedsMaxMphSpeed) {
          speed1 = Math.ceil(wmeSpeedsMaxMphSpeed / 5);
        }
        else if (!wmeSpeedsMiles && speed1Full >= wmeSpeedsMaxSpeed) {
          speed1 = Math.ceil(wmeSpeedsMaxSpeed / 10);
        }
        else {
          if (wmeSpeedsMiles) {
            speed1 = Math.ceil(speed1Full / 5);
          }
          else {
            speed1 = Math.ceil(speed1Full / 10);
          }

          if (wmeSpeedsMiles && speed1Full % 5 != 0) {
            newDashes = "30 30";
          }
          else if (!wmeSpeedsMiles && speed1Full % 10 != 0) {
            newDashes = "30 30";
          }
        }
      }
      else {
        speed1 = 0;
      }

      if (speed2allow && typeof attributes.revMaxSpeed == 'number') {
        if (wmeSpeedsMiles) {
          speed2Full = kmphToMph(attributes.revMaxSpeed);
        }
        else {
          speed2Full = attributes.revMaxSpeed;
        }

        if (wmeSpeedsMiles && speed2Full >= wmeSpeedsMaxMphSpeed) {
          speed2 = Math.ceil(wmeSpeedsMaxMphSpeed / 5);
        }
        else if (!wmeSpeedsMiles && speed2Full >= wmeSpeedsMaxSpeed) {
          speed2 = Math.ceil(wmeSpeedsMaxSpeed / 10);
        }
        else {
          if (wmeSpeedsMiles) {
            speed2 = Math.ceil(speed2Full / 5);
          }
          else {
            speed2 = Math.ceil(speed2Full / 10);
          }

          if (wmeSpeedsMiles && speed2Full % 5 != 0) {
            newDashes = "30 30";
          }
          else if (!wmeSpeedsMiles && speed2Full % 10 != 0) {
            newDashes = "30 30";
          }
        }
      }
      else {
        speed2 = 0;
      }

      if (wmeSpeedsMiles) {
        speed1color = wmeSpeedsColorsMph[speed1];
        speed2color = wmeSpeedsColorsMph[speed2];
      }
      else {
        speed1color = wmeSpeedsColors[speed1];
        speed2color = wmeSpeedsColors[speed2];
      }

      if (!wmeSpeedsInvertSpeedsColors && ((speed1 == 0  && speed2 == 0) || (!speed2allow && speed1 == 0) || (!speed1allow && speed2 == 0))) {
        continue;
      }

      if (wmeSpeedsInvertSpeedsColors && ((speed1 == 0  && speed2 == 0) || (!speed2allow && speed1 == 0) || (!speed1allow && speed2 == 0))) {
        newColor = "#ff0000";
        newOpacity = 1;
        newWidth = 8;
      }
      else if (wmeSpeedsInvertSpeedsColors) {
        continue;
      }
      else {
        if (wmeSpeedsHighlightOneWay && ((!attributes.fwdDirection && typeof attributes.fwdMaxSpeed == 'number') || (!attributes.revDirection && typeof attributes.revMaxSpeed == 'number'))) {
          newDashes = "10 10";
          newColor = '#ffffff';
          newWidth = 10;

          if (!attributes.fwdDirection) {
            newColor = '#999999';
          }
        }

        else if (speed1allow && speed2allow) {
          if (speed1 == 0 || speed2 == 0) {
            newDashes = "10 10";
            newColor = '#ff00ff';
            newWidth = 8;
          }
          else if (speed1Full != speed2Full) {
            if (speed1 < speed2) {
              newColor = speed1color;
            }
            else {
              newColor = speed2color;
            }

            if (newDashes == "none") {
              newDashes = "10 10";
            }
            else {
              newDashes = "20 20";
            }
          }
          else {
            newColor = speed1color;
          }
        }

        else if (speed1allow) {
          newColor = speed1color;
        }
        else {
          newColor = speed2color;
        }
      }

      if ((attributes.fwdDirection && attributes.fwdMaxSpeed == 126) || (attributes.revDirection && attributes.revMaxSpeed == 126)) {
        newColor = "#000";
        newOpacity = 1;
        newWidth = 8;
      }

      // if colour has changed, update the line attributes
      if (lineColor != newColor) {
        line.setAttribute("stroke", newColor);
        line.setAttribute("stroke-opacity", newOpacity);
        line.setAttribute("stroke-dasharray", newDashes);

        if (newColor != "#dd7700") { //default
          line.setAttribute("stroke-width", newWidth);
        } else {
          line.setAttribute("stroke-width", 6);
        }
      }
    } // end of loop
  }
  else if (wmeSpeedsResetColors) {
    wmeSpeedsResetColors = false;

    for (var seg in Waze.model.segments.objects) {
      var segment = Waze.model.segments.get(seg);
      var line = getId(segment.geometry.id);

      if (line === null) {
        continue;
      }

      // turn off all highlights
      var opacity = line.getAttribute("stroke-opacity");
      var stroke = line.getAttribute("stroke");

      if ((opacity > 0.1 && opacity < 1) || (wmeSpeedsAvailableColor.indexOf(stroke) != -1)) {
        line.setAttribute("stroke","#dd7700");
        line.setAttribute("stroke-opacity",0.001);
        line.setAttribute("stroke-dasharray", "none");
      }
    }

    if (wmeSpeedsHardResetColors) {
      wmeSpeedsHardResetColors = false;
      highlightSpeedsSegments();
    }
  }
} // end of function

function makeSpeedsTab() {
  var addon = document.createElement('section');

  addon.innerHTML += '<h3 style="margin-bottom: 5px;">' + fe_t('speedsHeadline') + '</h3>';

  if (wmeSpeedsMiles) {
    speedsForTab = wmeSpeedsColorsMph;
    colorForSpeedText = wmeSpeedsTextColorsMph;
  }
  else {
    speedsForTab = wmeSpeedsColors;
    colorForSpeedText = wmeSpeedsTextColors;
  }

  for (i = 1; i < speedsForTab.length; i++) {
    if ((i+1) == speedsForTab.length) {
      if (wmeSpeedsMiles) {
        actualSpeedForTab = ' &gt; ' + wmeSpeedsMaxMphSpeed + 'mph';
      }
      else {
        actualSpeedForTab = ' &gt; ' + wmeSpeedsMaxSpeed + 'km/h';
      }
    }
    else if (wmeSpeedsMiles) {
      actualSpeedForTab = (i * 5) + 'mph';
    }
    else {
      actualSpeedForTab = (i * 10) + 'km/h';
    }

    addon.innerHTML += '<div style="background-color: ' + speedsForTab[i] + ';padding:2px 0;border-radius: 5px;color:' + colorForSpeedText[i] + ';font-size:14px;text-align:center;margin-bottom: 3px;">' + actualSpeedForTab + '</div>';
  }

  addon.innerHTML += '<input type="checkbox" id="_wmeSpeedsInvert" title="' + fe_t('invertSpeedsTitle') + '" /> <span title="' + fe_t('invertSpeedsContent') + '">' + fe_t('invertSpeedsContent') + '</span><br>';

  if (wmeSpeedsLanguage && me.rank >= 3) {
    addon.innerHTML += '<input type="checkbox" id="_wmeSpeedsOneWay" title="' + fe_t('oneWaySpeedsTitle') + '" /> <span title="' + fe_t('oneWaySpeedsContent') + '">' + fe_t('oneWaySpeedsContent') + '</span><br>';
  }

  addon.innerHTML += '<input type="checkbox" id="_wmeSpeedsDrivable" title="' + fe_t('noSpeedsSegmentsTitle') + '" /> <span title="' + fe_t('noSpeedsSegmentsContent') + '">' + fe_t('noSpeedsSegmentsContent') + '</span><br>';

  addon.innerHTML += '<p style="font-size:11px;margin-top:5px;">' + fe_t('forumLink') + '<br>' + fe_t('author') + '<br>' + fe_t('version') + ' ' + wmeSpeedsVersion + '</p>';

  var userTabs = getId('user-info');
  var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
  var tabContent = getElementsByClassName('tab-content', userTabs)[0];

  newtab = document.createElement('li');
  newtab.innerHTML = '<a href="#sidepanel-wme-speeds" data-toggle="tab">' + fe_t('tabName') + '</a>';
  navTabs.appendChild(newtab);

  addon.id = "sidepanel-wme-speeds";
  addon.className = "tab-pane";
  tabContent.appendChild(addon);
}

/* helper function */
function getElementsByClassName(classname, node) {
  if(!node) node = document.getElementsByTagName("body")[0];
  var a = [];
  var re = new RegExp('\\b' + classname + '\\b');
  var els = node.getElementsByTagName("*");
  for (var i=0,j=els.length; i<j; i++)
    if (re.test(els[i].className)) a.push(els[i]);
  return a;
}

function getId(node) {
  return document.getElementById(node);
}

function changeLayer() {
  localStorage.DrawSegmentSpeeds = wmeSpeedsLayer.getVisibility();
}

function kmphToMph(kmph) {
  return Math.round(kmph * wmeSpeedsKmphToMphRatio);
}

function fe_t(name, params) { //  function for translation
  if (typeof params === 'object') {
    returnString = wmeSpeedsTranslation[wmeSpeedsLanguage][name];

    for (var i in params) {
      do {
        returnString = returnString.replace('{' + i + '}', params[i]);
      } while (returnString.indexOf('{' + i + '}') !== -1);
    }

    return returnString;
  }
  else {
    return wmeSpeedsTranslation[wmeSpeedsLanguage][name];
  }
}

/* =========================================================================== */
function initialiseSpeedsHighlights()
{
  if (wmeSpeedsInit) {
    return;
  }

  // init shortcuts
  if (!window.Waze.map) {
      window.console.log("WME Speeds: waiting for WME...");
      setTimeout(initialiseSpeedsHighlights, 555);
      return;
  }

  if (typeof(unsafeWindow.OpenLayers) === 'undefined') {
    console.log("WME Speeds: OpenLayers : NOK");
    setTimeout(initialiseSpeedsHighlights, 500);
    return;
  }

  if (typeof(unsafeWindow.Waze) === 'undefined') {
    console.log("WME Speeds: Waze : NOK");
    setTimeout(initialiseSpeedsHighlights, 500);
    return;
  }

  if (typeof(me) === 'undefined') {
    if (wmeSpeedsChatAddonCounter > 10) {
      console.log("WME Speeds: Stop - WME Chat addon not instal.");
      alert('WME Speeds needs WME Chat addon - instal or enable - https://greasyfork.org/scripts/2103-wme-chat-addon');

      return ;
    }
    else {
      console.log("WME Speeds: WME Chat addon : NOK");
      setTimeout(initialiseSpeedsHighlights, 500);
      wmeSpeedsChatAddonCounter++;

      return;
    }
  }

  wmeSpeedsLayer = new unsafeWindow.OpenLayers.Layer.Vector("Speeds", {
      displayInLayerSwitcher: true,
      uniqueName: "__DrawSegmentSpeeds"
    });

  I18n.translations.en.layers.name["__DrawSegmentSpeeds"] = "WME Speeds";
  unsafeWindow.Waze.map.addLayer(wmeSpeedsLayer);

  if (localStorage.DrawSegmentSpeeds) {
    wmeSpeedsLayer.setVisibility(localStorage.DrawSegmentSpeeds == "true");
  } else {
    wmeSpeedsLayer.setVisibility(true);
  }

  // begin periodic updates
  window.setInterval(highlightSpeedsSegments,333);

  // trigger code when page is fully loaded, to catch any missing bits
  window.addEventListener("load", function(e) {
    var mapProblems = getId('map-problems-explanation')
    if (mapProblems !== null) mapProblems.style.display = "none";
  });

  if (unsafeWindow.Waze.model.isImperial) {
    wmeSpeedsMiles = true;
  }

  if (wmeSpeedsAllowLanguage.indexOf(unsafeWindow.I18n.locale) != -1) {
    wmeSpeedsLanguage = unsafeWindow.I18n.locale;
  }

  // register some events...
  Waze.map.events.register("zoomend", null, highlightSpeedsSegments);
  Waze.map.events.register("changelayer", null, changeLayer);

  wmeSpeedsInit = true;

  makeSpeedsTab();

  getId('_wmeSpeedsInvert').onclick = highlightSpeedsSegmentsReset;
  getId('_wmeSpeedsOneWay').onclick = highlightSpeedsSegmentsReset;
  getId('_wmeSpeedsDrivable').onclick = highlightSpeedsSegmentsReset;
}

/* engage! =================================================================== */
initialiseSpeedsHighlights();

})();
/* end ======================================================================= */
