// ==UserScript==
// @name         r/placestart logo template
// @namespace    http://tampermonkey.net/
// @version      1
// @description  r/placestart logo template
// @author       portalthree
// @match        https://hot-potato.reddit.com/embed*
// @match        https://www.reddit.com/r/place/*
// @match        https://new.reddit.com/r/place/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require	     https://cdn.jsdelivr.net/npm/toastify-js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

// credit to the osu! logo script


const updateURL = "https://github.com/portalthree/place-taskbar-bot/raw/main/overlay.user.js";
const VERSION = "1";
var UPDATE_PENDING = false;

if (window.top !== window.self) {

	GM_addStyle(GM_getResourceText('TOASTIFY_CSS'));

    Toastify({
        text: 'Thank you for contributing to r/placestart!',
        duration: 10000
    }).showToast();

    window.addEventListener('load', () => {
        // Load the image
        const image = document.createElement("img");
        image.src = "https://raw.githubusercontent.com/portalthree/place-taskbar-bot/main/overlay_dotted.png";
        image.onload = () => {
            image.style = `position: absolute; left: 0; top: 0; width: ${image.width/3}px; height: ${image.height/3}px; image-rendering: pixelated; z-index: 1`;
        };

        // Add the image as overlay
        const camera = document.querySelector("mona-lisa-embed").shadowRoot.querySelector("mona-lisa-camera");
        const canvas = camera.querySelector("mona-lisa-canvas");
        canvas.shadowRoot.querySelector('.container').appendChild(image);

        // Add a style to put a hole in the pixel preview (to see the current or desired color)
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

    checkForUpdates();
}

function checkForUpdates(){
    Toastify({
        text: 'Checking for updates...',
        duration: 10000
    }).showToast();

	fetch(`https://raw.githubusercontent.com/portalthree/place-taskbar-bot/main/version.json`, { cache: "no-store" }).then(async (response) => {
		if (!response.ok) return console.warn('There was an error fetching the version file.');
		const data = await response.json();

		if (data?.version !== VERSION && !UPDATE_PENDING) {
			UPDATE_PENDING = true
			Toastify({
				text: `NEW VERSION AVAILABLE! Update here: https://github.com/portalthree/place-taskbar-bot`,
				duration: -1,
				onClick: () => {
					// Tapermonkey captures this and opens a new tab
					window.location = updateURL
				}
			}).showToast();

		}
	}).catch((e) => console.warn('Error!', e));
}