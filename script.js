// ==UserScript==
// @name                WME Speeds
// @namespace           https://greasyfork.org/cs/scripts/12402-wme-speeds
// @author              Martin Kolář (based from WME Color Highlights v. 1.98)
// @description         Adds colours to road segments to show their speeds
// @include             https://editor-beta.waze.com/*
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @version             0.1.4
// @grant               none
// ==/UserScript==

(function()
{

// global variables

var wmeSpeedsVersion = "0.1.4";
var wmeSpeedsInit = false;
var wmeSpeedsColors = ['#f00', '#321325', '#540804', '#BA1200', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55'];
var wmeSpeedsAvailableColor = ['#f00', '#321325', '#540804', '#BA1200', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55', '#ff00ff', '#000', '#ffffff', '#999999'];
var wmeSpeedsMaxSpeed = 131;
var wmeSpeedsLayer;
var wmeResetColors = false;


/* =========================================================================== */
function highlightSpeedsSegments(event) {
  // console.log('highlightSpeedsSegments');

  if (wmeSpeedsLayer.getVisibility()) {
    wmeResetColors = true;

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

      if (opacity == 1 || lineWidth == 9)
        continue;

      // turn off highlights when roads are no longer visible
      var roadType = attributes.roadType;
      if (Waze.map.zoom <= 3 && (roadType < 2 || roadType > 7)) {
        if (opacity > 0.1) {
          line.setAttribute("stroke","#dd7700");
          line.setAttribute("stroke-opacity",0.001);
          line.setAttribute("stroke-dasharray", "none");
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

      if (roadType != 5 && roadType != 10) {
        newColor = "#fff";
        newOpacity = 1;
        newWidth = 8;

        speed1allow = attributes.fwdDirection;
        speed2allow = attributes.revDirection;

        if (!speed1allow && !speed2allow) {
          continue;
        }

        if (speed1allow && typeof attributes.fwdMaxSpeed == 'number') {
          if (attributes.fwdMaxSpeed >= wmeSpeedsMaxSpeed) {
            speed1 = Math.ceil(wmeSpeedsMaxSpeed / 10);
          }
          else {
            speed1 = Math.ceil(attributes.fwdMaxSpeed / 10);

            if (attributes.fwdMaxSpeed % 10 != 0) {
              newDashes = "30 30";
            }
          }
        }
        else {
          speed1 = 0;
        }

        if (speed2allow && typeof attributes.revMaxSpeed == 'number') {
          if (attributes.revMaxSpeed >= wmeSpeedsMaxSpeed) {
            speed2 = Math.ceil(wmeSpeedsMaxSpeed / 10);
          }
          else {
            speed2 = Math.ceil(attributes.revMaxSpeed / 10);

            if (attributes.revMaxSpeed % 10 != 0) {
              newDashes = "30 30";
            }
          }
        }
        else {
          speed2 = 0;
        }

        speed1color = wmeSpeedsColors[speed1];
        speed2color = wmeSpeedsColors[speed2];

        if ((speed1 == 0  && speed2 == 0) || (!speed2allow && speed1 == 0) || (!speed1allow && speed2 == 0)) {
          continue;
        }

        // if ((!attributes.fwdDirection && typeof attributes.fwdMaxSpeed == 'number') || (!attributes.revDirection && typeof attributes.revMaxSpeed == 'number')) {
        //   newDashes = "10 10";
        //   newColor = '#ffffff';
        //   newWidth = 9;

        //   if (!attributes.fwdDirection) {
        //     newColor = '#999999';
        //   }
        // }

        else if (speed1allow && speed2allow) {
          if (speed1 == 0 || speed2 == 0) {
            newDashes = "10 10";
            newColor = '#ff00ff';
            newWidth = 9;
          }
          else if (speed1 != speed2) {
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

        if ((attributes.fwdDirection && attributes.fwdMaxSpeed == 126) || (attributes.revDirection && attributes.revMaxSpeed == 126)) {
          newColor = "#000";
          newOpacity = 1;
          newWidth = 9;
        }
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
  else if (wmeResetColors) {
    wmeResetColors = false;

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
  }
} // end of function

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

/* =========================================================================== */
function initialiseSpeedsHighlights()
{
  if (wmeSpeedsInit) {
    return;
  }

  // init shortcuts
  if(!window.Waze.map)
  {
      window.console.log("WME Speeds: waiting for WME...");
      setTimeout(initialiseSpeedsHighlights, 555);
      return;
  }

  if(typeof(unsafeWindow.OpenLayers) === 'undefined'){
    console.log("WME Speeds: OpenLayers : NOK");
    setTimeout(initialiseSpeedsHighlights, 500);
    return;
  }

  if(typeof(unsafeWindow.Waze) === 'undefined'){
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

  // register some events...
  Waze.map.events.register("zoomend", null, highlightSpeedsSegments);

  wmeSpeedsInit = true;
}

/* engage! =================================================================== */
initialiseSpeedsHighlights();

})();
/* end ======================================================================= */
