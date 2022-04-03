// ==UserScript==
// @name         r/placestart logo template
// @namespace    https://github.com/r-placestart/overlay/
// @version      5
// @description  r/placestart logo template
// @author       portalthree
// @match        https://hot-potato.reddit.com/embed*
// @match        https://www.reddit.com/r/place/*
// @match        https://new.reddit.com/r/place/*
// @match        https://localhost/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require	     https://cdn.jsdelivr.net/npm/toastify-js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

// credit to the osu! logo script


//TODO: When changing the version, please do change the version in the userscript information as well as the version in version.json
const VERSION = "5";

const updateURL = "https://github.com/r-placestart/overlay/raw/main/overlay.user.js";
const overlayLink = "https://raw.githubusercontent.com/r-placestart/overlay/main/dotted_overlay.png";
const versionLink = "https://raw.githubusercontent.com/r-placestart/overlay/main/version.json";

var NOTIFIED = false;
var START_NOTIFIED = false;

var SECOND = 1000;
var MINUTE = 60 * SECOND;


(async function () {

    GM_addStyle(GM_getResourceText('TOASTIFY_CSS'));

    if (window.top !== window.self) {    
        window.addEventListener('load', () => {
            // Load the image
                const image = document.createElement("img");
                image.src = overlayLink;
                image.onload = () => {
                    image.style = `position: absolute; left: 0; top: 0; width: 2000px; height: 2000px; image-rendering: pixelated; z-index: 1`;
                };
        
                // Add the image as overlay
                const camera = document.querySelector("mona-lisa-embed").shadowRoot.querySelector("mona-lisa-camera");
                const canvas = camera.querySelector("mona-lisa-canvas");
                canvas.shadowRoot.querySelector('.container').appendChild(image);

                const waitForPreview = setInterval(() => {
                const preview = camera.querySelector("mona-lisa-pixel-preview");
                    if (preview) {
                        clearInterval(waitForPreview);
                        const style = document.createElement('style')
                        style.innerHTML = '.pixel { clip-path: polygon(-20% -20%, -20% 120%, 37% 120%, 37% 37%, 62% 37%, 62% 62%, 37% 62%, 37% 120%, 120% 120%, 120% -20%); }'
                        preview.shadowRoot.appendChild(style);
                    }
                }, 100);
        }, false);
    }

   startNotify();

   setInterval(checkForUpdates, SECOND * 10);
   setInterval(refreshPage, MINUTE * 15)
})();

// Checks for an update every 1 minute
function checkForUpdates(){
    console.log("Checking for updates...");

    var cacheHeaders = new Headers();
    cacheHeaders.append('pragma', 'no-cache');
    cacheHeaders.append('cache-control', 'no-cache');

    var initRequest = {
        method: 'GET',
        headers: cacheHeaders,
      };
      

    fetch(versionLink, initRequest).then(async (response) => {
        const data = await response.json();

        if(!response.ok){
            return console.error("Failed to fetch version.json: " + response.statusText);
        } else {
            console.log("Latest version: " + data.version)
            if(data.version > VERSION){
                requiresUpdate();
            }
        }
    }).catch((e) => console.warn('Error!', e));
}

function requiresUpdate(){
    var toastUpdate = Toastify({
        text: "Update available! Click here to update!",
        duration: -1,
        position: "center",
        onClick: () => {
            window.location = updateURL;
        }
    })
    
    toastUpdate.showToast();

}

function startNotify(){
    if(!START_NOTIFIED){
        Toastify({
            text: `Thanks for contributing to r/placestart! (click here to join our discord)`,
            duration: SECOND * 10,
            onClick: () => {
                window.location = "https://discord.gg/sGCpCsjA45";
            }
        }).showToast();

        START_NOTIFIED = true;
    }
}

// Refreshs page every 5 minutes
function refreshPage(){
    location.reload()
}