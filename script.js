// ==UserScript==
// @name                WME Speeds
// @namespace           https://greasyfork.org/cs/scripts/12402-wme-speeds
// @author              Martin Kolář (based from WME Color Highlights v. 1.98)
// @description         Adds colours to road segments to show their speeds
// @include             https://editor-beta.waze.com/*
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @version             0.3.2
// @grant               none
// ==/UserScript==

(function()
{

// global variables

var wmeSpeedsVersion = "0.3.2";
var wmeSpeedsInit = false;
var wmeSpeedsColors =     ['#ff0000',    '#321325', '#540804', '#BA1200', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55'];
var wmeSpeedsColorsTransparent = [];
var wmeSpeedsTextColors = ['#000000', '#ffffff', '#ffffff', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#ffffff', '#ffffff'];
var wmeSpeedsColorsMph =     ['#ff0000',    '#321325', '#702632', '#540804', '#A00027', '#BA1200', '#F15872', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55', '#000000'];
var wmeSpeedsColorsMphTransparent = [];
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

//  icons
var wmeSpeedsTabIcon = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNjg3OEY2RjhFMEIxMUU1OTU1MUU5MjA0ODlFQjA1MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowNjg3OEY3MDhFMEIxMUU1OTU1MUU5MjA0ODlFQjA1MCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA2ODc4RjZEOEUwQjExRTU5NTUxRTkyMDQ4OUVCMDUwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA2ODc4RjZFOEUwQjExRTU5NTUxRTkyMDQ4OUVCMDUwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Dhzo6gAABIFJREFUeNqsV2tMU1kQnsWiVhG6Irrro1Br9IcJoMFH1j+AURLEB2CMGBWNIIgmZhMX/W+IupsYV+NzXR9IEE00+KpBjfiE4ApWs/5YHhbqA4EFWhArwg9nTs+9PffS1kthki/33plzZubcM3Nmju7aSNBKIYhliARELMKECOMyJ8KGsCLKEbcQn7Qo/UGDAzMQuxEZiLEane1BXEQcQNT7GxjkRzYasR/xGpE1COPAx2bxuQe4rkE5YEZU8pWPhMCJ5uZzXTO8DdB54c1FWBCT1IKwuAUweVUaRCQkgt5oBF1oKOP3d3WBy26HtvL78KH0KjifV6mnUsw8QSQjavzFAHlZgYgQmaFz4mB63g4wbszUtGx74XmwHT8Kzpp/1KI2xC9iXIgO6PmvihFnGDdlQ+zJUwH9f2tuDtjPDpj7CrEQ4aKPERkjZEEBIl0RCDt3QfThIwEHwE8py6G/uwc6qypENm1tMOKe6AAFXRF9yyvfvBWi/zwMQ6WJS5aC630zOK3VIns+T9MOKQv2cK/cwTZ3HsSeOAnDRaSLdAoUzG2yLBjHDxmZTLl5CgVXrpbCqdNnBigus1yX3588rYDii5eg4Y0NzNNNsHJFCiQtXeLRuW07WLM3idPXIn4N4qkxVkw1Y6ZiINTW1fldIRnfW7CfGSei58FDR6Dszl1PMGMGkW7VYZVMDiwWuVNS030aohWLkOjYcfd2rVu7hvHpSXS+sAi+o3sxORAtcibEJwww/ODhY59O/VdbC+0dnew9MTGePVOWJbMn8UnuR3d0EM8AmcaYTD6NJSWvgLwdO1lMuFwsjaGxsUmWT5s6lT3Dw8fLPFHuRbeZgjBUcTaHhChGvH33TvFN+0t4Xl0N+wr2Diob1LrJtu57k2hV0n7Tqi23y1hG1Lx4yYJvqERb0CUy+j/57iP0ej2kp63yFP2eHoiKipS/29s7FE8iUe5Fdxc50CByPttsihGkTFQophYpnzVzJoSP/5F937xl4UH7yB0LyCe5L91kW8eLg5yg/z8oB0NcnDyC9ppyWk2UapLyzI3r2ZjikssMEuVty1HMId3qwkS1YAy+rJY4X7G2R23J8rjY8AZ6e3uh+WOLu1mYEwMZaDw9LdVTw81mmBgxAVpb26Cz08FOws2ZGyAxIV5h7d/8XfDlgyKo/6ByTEdxs3gaxv51TnPt10r2C4VgzVLo/EwFk2KgG1EiSqiZGG7yopOqYbdUDan57JMk1MlQMzFcRLqc1c9EVh9vVuV+oIP3/YtkJ7B+UzNB9Xwo9Dr/N2g8MSCIDyIuqTuip4jlYjNKnQw1E9TZBLpyL8Yp6zZIf1x0oJ+3SYoLCP2JjxYLBI0aBWExMdoDLjcbWm/f8NaUJiFa/N2MfLblhnkL4eeVqe62PDISgg0G94Y6HOBqamJtefP1UnA8q/TmV4uWtlxsz6+oS/UQ6BVveOu13ozq+en4u5gdAVAf17HA1x3R393wC7+azUac5geHVqJm4W8+dzfXFfDtWLyep6iu5wYuc6iu5ze1Xs+/CTAA2tuMX1dHe2oAAAAASUVORK5CYII=';

//  cs translation
wmeSpeedsTranslation['cs'] = {
  'tabName': 'R',
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
  'transparentColorsTitle': 'Průhledné barvy',
  'transparentColorsContent': 'Zprůhlednit barvy rychlostí',
  'unverifiedSegmentsTitle': 'Zvýraznit nepotvrzené rychlosti na segmentech',
  'unverifiedSegmentsContent': 'Zvýraznit nepotvrzené rychlosti na segmentech',
}

//  sk translation
wmeSpeedsTranslation['sk'] = {
  'tabName': 'R',
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
  'transparentColorsTitle': 'Průhledné barvy',
  'transparentColorsContent': 'Zprůhlednit barvy rychlostí',
  'unverifiedSegmentsTitle': 'Zvýraznit nepotvrzené rychlosti na segmentech',
  'unverifiedSegmentsContent': 'Zvýraznit nepotvrzené rychlosti na segmentech',
}

//  en translation
wmeSpeedsTranslation['en'] = {
  'tabName': 'S',
  'speedsHeadline': 'Colors by speed',
  'forumLink': '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">English discussion</a>',
  'author': 'Author: martinkolar (CZ)',
  'version': 'Version:',
  'invertSpeedsTitle': 'Invert speed',
  'invertSpeedsContent': 'Highlight segments without set speed (red)',
  'oneWaySpeedsTitle': 'One-way speed',
  'oneWaySpeedsContent': 'Highlight one-way speeds with two speeds (white and gray dashed)',
  'noSpeedsSegmentsTitle': 'Non-drivable segments with speeds',
  'noSpeedsSegmentsContent': 'Highlight non-drivable segments with set speed (pink)',
  'transparentColorsTitle': 'Transparent color',
  'transparentColorsContent': 'Make speed\'s colors transparent',
  'unverifiedSegmentsTitle': 'Highlight unverified segments',
  'unverifiedSegmentsContent': 'Highlight unverified segments',
}

/* =========================================================================== */
function highlightSpeedsSegmentsReset(event) {
  wmeSpeedsHardResetColors = true;
  highlightSpeedsSegments();
}

function highlightSpeedsSegments(event) {
  wmeSpeedsInvertSpeedsColors = getId('_wmeSpeedsInvert').checked;
  wmeSpeedsNonDrivableSpeedsColors = getId('_wmeSpeedsDrivable').checked;
  wmeSpeedsTransparentColors = getId('_wmeSpeedsTransparentColors').checked;
  wmeSpeedsUnverified = getId('_wmeSpeedsUnverifed').checked;
  wmeSpeedsHighlightOneWay = false;

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
        if (wmeSpeedsTransparentColors) {
          speed1color = wmeSpeedsColorsMphTransparent[speed1];
          speed2color = wmeSpeedsColorsMphTransparent[speed2];
        }
        else {
          speed1color = wmeSpeedsColorsMph[speed1];
          speed2color = wmeSpeedsColorsMph[speed2];
        }
      }
      else {
        if (wmeSpeedsTransparentColors) {
          speed1color = wmeSpeedsColorsTransparent[speed1];
          speed2color = wmeSpeedsColorsTransparent[speed2];
        }
        else {
          speed1color = wmeSpeedsColors[speed1];
          speed2color = wmeSpeedsColors[speed2];
        }
      }

      if (!wmeSpeedsInvertSpeedsColors && ((speed1 == 0  && speed2 == 0) || (!speed2allow && speed1 == 0) || (!speed1allow && speed2 == 0))) {
        continue;
      }

      if (wmeSpeedsInvertSpeedsColors && ((speed1 == 0  && speed2 == 0) || (!speed2allow && speed1 == 0) || (!speed1allow && speed2 == 0))) {
        if (wmeSpeedsTransparentColors) {
          newColor = "rgba(255,0,0,0.4)";
        }
        else {
          newColor = "#ff0000";
        }

        newOpacity = 1;
        newWidth = 8;
      }
      else if (wmeSpeedsInvertSpeedsColors) {
        continue;
      }
      else {
        if (wmeSpeedsHighlightOneWay && ((!attributes.fwdDirection && typeof attributes.fwdMaxSpeed == 'number') || (!attributes.revDirection && typeof attributes.revMaxSpeed == 'number'))) {
          if (wmeSpeedsTransparentColors) {
            newColor = "rgba(255,255,255,0.4)";
          }
          else {
            newColor = "#ffffff";
          }

          newDashes = "10 10";
          newColor = '#ffffff';
          newWidth = 10;

          if (!attributes.fwdDirection) {
            if (wmeSpeedsTransparentColors) {
              newColor = "rgba(153,153,153,0.4)";
            }
            else {
              newColor = "#999999";
            }
          }
        }

        else if (speed1allow && speed2allow) {
          if (speed1 == 0 || speed2 == 0) {
            if (wmeSpeedsTransparentColors) {
              newColor = "rgba(255,0,255,0.4)";
            }
            else {
              newColor = "#ff00ff";
            }

            newDashes = "10 10";
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

        if (wmeSpeedsUnverified && (attributes.revMaxSpeedUnverified || attributes.fwdMaxSpeedUnverified)) {
          newDashes = "15 15";
          newWidth = 6;
        }
      }

      if ((attributes.fwdDirection && attributes.fwdMaxSpeed == 126) || (attributes.revDirection && attributes.revMaxSpeed == 126)) {
        if (wmeSpeedsTransparentColors) {
          newColor = "rgba(255,0,255,0.4)";
        }
        else {
          newColor = "#ff00ff";
        }

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

  addon.innerHTML += '<input type="checkbox" id="_wmeSpeedsInvert" title="' + fe_t('invertSpeedsTitle') + '" /> <span title="' + fe_t('invertSpeedsContent') + '">' + fe_t('invertSpeedsContent') + '</span><br>';
  addon.innerHTML += '<input type="checkbox" id="_wmeSpeedsDrivable" title="' + fe_t('noSpeedsSegmentsTitle') + '" /> <span title="' + fe_t('noSpeedsSegmentsContent') + '">' + fe_t('noSpeedsSegmentsContent') + '</span><br>';
  addon.innerHTML += '<input type="checkbox" id="_wmeSpeedsTransparentColors" title="' + fe_t('transparentColorsTitle') + '" /> <span title="' + fe_t('transparentColorsContent') + '">' + fe_t('transparentColorsContent') + '</span><br>';
  addon.innerHTML += '<input type="checkbox" id="_wmeSpeedsUnverifed" title="' + fe_t('unverifiedSegmentsTitle') + '" /> <span title="' + fe_t('unverifiedSegmentsContent') + '">' + fe_t('unverifiedSegmentsContent') + '</span><br>';

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

  addon.innerHTML += '<p style="font-size:11px;margin-top:5px;">' + fe_t('forumLink') + '<br>' + fe_t('author') + '<br>' + fe_t('version') + ' ' + wmeSpeedsVersion + '</p>';

  var userTabs = getId('user-info');
  var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
  var tabContent = getElementsByClassName('tab-content', userTabs)[0];

  newtab = document.createElement('li');
  newtab.innerHTML = '<a href="#sidepanel-wme-speeds" data-toggle="tab"><img src="data:image/png;base64,' + wmeSpeedsTabIcon + '" width="16" height="16" style="margin-top: -2px;">&nbsp;' + fe_t('tabName') + '</a>';
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

function hexToRgb(hex) {  //  http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
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
function initialiseSpeedsHighlights() {
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

  // restore saved settings
  if (localStorage.WMESpeedsScript) {
    console.log("WME Speeds: Loading Options");
    options = JSON.parse(localStorage.WMESpeedsScript);

    getId('_wmeSpeedsInvert').checked = options[1];
    getId('_wmeSpeedsDrivable').checked = options[3];
    getId('_wmeSpeedsTransparentColors').checked = options[4];
    getId('_wmeSpeedsUnverifed').checked = options[4];
  }

  // overload the WME exit function
  saveWmeSpeedsOptions = function() {
    if (localStorage) {
      console.log("WME Speeds: Saving Options");
      var options = [];

      // preserve previous options which may get lost after logout
      if (localStorage.WMESpeedsScript) {
        options = JSON.parse(localStorage.WMESpeedsScript);
      }

      options[1] = getId('_wmeSpeedsInvert').checked;
      options[3] = getId('_wmeSpeedsDrivable').checked;
      options[4] = getId('_wmeSpeedsTransparentColors').checked;

      localStorage.WMESpeedsScript = JSON.stringify(options);
    }
  }
  //  save options
  window.addEventListener("beforeunload", saveWmeSpeedsOptions, false);

  getId('_wmeSpeedsInvert').onclick = highlightSpeedsSegmentsReset;
  getId('_wmeSpeedsDrivable').onclick = highlightSpeedsSegmentsReset;
  getId('_wmeSpeedsTransparentColors').onclick = highlightSpeedsSegmentsReset;
  getId('_wmeSpeedsUnverifed').onclick = highlightSpeedsSegmentsReset;

  for (i = 0; i < wmeSpeedsColors.length; i++) {
    wmeSpeedsColorsTransparent[i] = 'rgba(' + hexToRgb(wmeSpeedsColors[i]).r + ', ' + hexToRgb(wmeSpeedsColors[i]).g + ', ' + hexToRgb(wmeSpeedsColors[i]).b + ', 0.4)';
    wmeSpeedsAvailableColor[wmeSpeedsAvailableColor.length] = wmeSpeedsColorsTransparent[i];
  }

  for (i = 0; i < wmeSpeedsColorsMph.length; i++) {
    wmeSpeedsColorsMphTransparent[i] = 'rgba(' + hexToRgb(wmeSpeedsColorsMph[i]).r + ', ' + hexToRgb(wmeSpeedsColorsMph[i]).g + ', ' + hexToRgb(wmeSpeedsColorsMph[i]).b + ', 0.4)';
    wmeSpeedsAvailableColor[wmeSpeedsAvailableColor.length] = wmeSpeedsColorsMphTransparent[i];
  }
}

/* engage! =================================================================== */
initialiseSpeedsHighlights();

})();
/* end ======================================================================= */
