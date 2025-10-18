// ==UserScript==//
// @name        WME Speeds
// @namespace   https://greasyfork.org/cs/scripts/12402-wme-speeds
// @version     1.0.4
// @description Adds colors to road segments to show their speeds
// @author      Martin Kolář
// @match       https://www.waze.com/editor*
// @match       https://beta.waze.com/editor*
// @match       https://www.waze.com/*/editor*
// @match       https://beta.waze.com/*/editor*
// @exclude     https://www.waze.com/user/editor*
// @exclude     https://beta.waze.com/user/editor*
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMzMgMjMzIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSJyZWQiIHN0cm9rZS13aWR0aD0iMjUiIGZpbGw9IiNmZmYiIGN4PSIxMTYuNSIgY3k9IjExNi41IiByPSIxMDQiLz48ZyBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjxwYXRoIGQ9Im00Ni40IDEzNy4yIDE5LjEtMnEuOCA2LjYgNC45IDEwLjNhMTMgMTMgMCAwIDAgMTkuNC0xcTQuMi01IDQuMi0xNC44IDAtOS4yLTQuMS0xMy44LTQuMi00LjYtMTAuOC00LjYtOC4zIDAtMTQuOCA3LjNsLTE1LjYtMi4zIDkuOC01Mi4xaDUwLjh2MThINzMuMWwtMyAxN2EyOSAyOSAwIDAgMSAxMy4xLTMuM3ExMi44IDAgMjEuNyA5LjN0OC45IDI0LjJxMCAxMi4zLTcuMiAyMmEzMiAzMiAwIDAgMS0yNy4yIDEzLjNxLTEzLjggMC0yMi42LTcuNC04LjctNy41LTEwLjQtMjBNMTU2LjQgNjIuNHExNC41IDAgMjIuOCAxMC40UTE4OSA4NSAxODkgMTEzLjZ0LTkuOSA0MC45YTI3IDI3IDAgMCAxLTIyLjcgMTAuMnEtMTQuNiAwLTIzLjYtMTEuMi05LTExLjMtOS00MC4xIDAtMjguMyAxMC00MC44IDgtMTAuMiAyMi42LTEwLjJtMCAxNS45cS0zLjUgMC02LjIgMi4ydC00LjIgOHEtMiA3LjUtMiAyNSAwIDE3LjggMS44IDI0LjMgMS43IDYuNiA0LjQgOC44YTEwIDEwIDAgMCAwIDYuMiAyLjJxMy41IDAgNi4yLTIuMnQ0LjMtOHEyLTcuNSAyLTI1YTEwOSAxMDkgMCAwIDAtMS44LTI0LjNxLTEuOC02LjYtNC41LTguOGExMCAxMCAwIDAgMC02LjItMi4yIi8+PC9nPjwvZz48L3N2Zz4=
// @grant       none

// @require       file:///C:/Users/[USERNAME]/Documents/MyDir/.out/main.user.js
// ==/UserScript==

// make sure that inside Tampermonkey's extension settings (on the browser, not from TM) and allow "Local file access", as shown here: https://www.tampermonkey.net/faq.php?locale=en#Q204
// make sure that the snippts inside header.js and header-dev.js are the same, except for the one @require field
// adjust the require field to the location of the .out/main.user.js file inside this directory
// copy the above snippet (up to ==/Userscript==) inside Tampermonkey's editor and save it