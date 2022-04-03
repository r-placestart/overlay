// ==UserScript==
// @name         r/placestart logo template
// @namespace    https://github.com/portalthree/place-taskbar-bot
// @version      2
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
// @updateURL    https://github.com/portalthree/place-taskbar-bot/raw/main/overlay.user.js
// @downloadURL  https://github.com/portalthree/place-taskbar-bot/raw/main/overlay.user.js
// ==/UserScript==

// credit to the osu! logo script


const updateURL = "https://github.com/portalthree/place-taskbar-bot/raw/main/overlay.user.js";

const VERSION = "3";

const imageLink = "https://raw.githubusercontent.com/portalthree/place-taskbar-bot/main/!dotted_overlay.png";

var NEEDS_UPDATE = false;

(async function () {

    GM_addStyle(GM_getResourceText('TOASTIFY_CSS'));
    Toast("Thanks for contributing to r/placestart!", 10000)
    Toastify({
        text: `Join our discord! https://discord.gg/sGCpCsjA45`,
        duration: -1,
        onClick: () => {
            window.location = "https://discord.gg/sGCpCsjA45";
        }
    }).showToast();

    if (window.top !== window.self) {    
        window.addEventListener('load', () => {
            // Load the image
                const image = document.createElement("img");
                image.src = imageLink;
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

   //setInterval(checkForUpdates, 1000);
})();

function Toast(text, duration) {
    console.log("Got a Toastify job: " + text);

    Toastify({
        text: text,
        duration: duration
    }).showToast();
}

/*
function checkForUpdates(){
    console.log("Checking for updates...");
    fetch(`https://raw.githubusercontent.com/portalthree/place-taskbar-bot/main/version.json`, { cache: "no-store" }).then(async (response) => {
        if (!response.ok) return console.warn('Failed to fetch version.json');
        const data = await response.json();

        if (data?.version !== VERSION && NEEDS_UPDATE) {
            NEEDS_UPDATE = true;
            Toastify({
                text: `NEW VERSION AVAILABLE! Update here: https://github.com/portalthree/place-taskbar-bot`,
                duration: -1,
                onClick: () => {
                    window.location = updateURL;
                }
            }).showToast();

        } else {
            NEEDS_UPDATE = false;
            console.log("No update found!");
        }
    }).catch((e) => console.warn('Error!', e));
}
*/