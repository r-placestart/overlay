// ==UserScript==
// @name        r/placestart logo template
// @namespace   https://github.com/r-placestart/overlay/
// @version     8
// @description r/placestart logo template
// @author      portalthree
// @match       https://hot-potato.reddit.com/embed*
// @match       https://www.reddit.com/r/place/*
// @match       https://new.reddit.com/r/place/*
// @match       https://localhost/
// @icon        https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require	    https://cdn.jsdelivr.net/npm/toastify-js
// @resource    TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @grant       GM_info
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// ==/UserScript==

// credit to the osu! logo script

// IMPORTANT: When changing the version:
// pls change the version in the userscript information above;
// as well as the version in version.json, those two are essensial;
// version below reads from userscript information first.

// https://violentmonkey.github.io/api/gm/#gm_info
// https://www.tampermonkey.net/documentation.php#GM_info

// Constants

const VERSION = Number.parseInt(window?.GM_info?.script?.version) || 8;

const updateURL = "https://github.com/r-placestart/overlay/raw/main/overlay.user.js";
const overlayLink = "https://raw.githubusercontent.com/r-placestart/overlay/main/overlay.png";
const versionLink = "https://raw.githubusercontent.com/r-placestart/overlay/main/version.json";

const overlayImageStyle = `
    position: absolute;
    left: 0;
    top: 0;
    width: 2000px;
    height: 2000px;
    image-rendering: pixelated;
    z-index: 1;
`.trim().replace(/\s+/, " ");

const overlayImageProps = {
    className: "overlay-placestart",
    src: overlayLink,
    decoding: "async",
    crossorigin: "anonymous",
    fetchpriority: "high",
    referrerpolicy: "no-referrer",
    style: overlayImageStyle
};

const pixelCSS = `.pixel {
    clip-path: polygon(
        -20% -20%, -20% 120%, 37% 120%,  37%  37%,  62%  37%,
         62%  62%,  37%  62%, 37% 120%, 120% 120%, 120% -20%
    );
}`;

const SECOND = 1000;
const MINUTE = 60 * SECOND;

// logging

const formatMsg = msg => "R/PLACESTART " + VERSION + " | " + msg;
const LOG = (msg, ...args) => console.log(formatMsg(msg), ...args);
const WARN = (msg, ...args) => console.warn(formatMsg(msg), ...args);

// Toast

const showToast = options => Toastify(options).showToast();

const startToast = () => showToast({
    text: `Thanks for contributing to r/placestart! (click here to join our discord)`,
    duration: SECOND * 10,
    onClick: () => location.assign("https://discord.gg/sGCpCsjA45")
});

const updateToast = () => Toastify({
    text: "Update available! Click here to update!",
    duration: -1,
    position: "center",
    onClick: () => location.assign(updateURL)
});

// -----------------------------------------------------------------------------

const iframeOnLoad = () => {

    const $ = (tagName, ...props) =>
        Object.assign(document.createElement(tagName), ...props);

    // embed shadowRoot
    const embedSR = document.querySelector("mona-lisa-embed")?.shadowRoot;
    if (!embedSR) {
        LOG("root element not found! Can't do anything!");
        return;
    }

    // canvas container
    const container = embedSR.querySelector("mona-lisa-canvas")
        ?.shadowRoot?.querySelector(".container");
    if (container) {
        // append overlay image
        container.appendChild( $("img", overlayImageProps) );
    } else {
        LOG("image container element not found! Can't append overlay image!");
    }

    const waitForPreview = setInterval(() => {
        const previewSR = embedSR.querySelector("mona-lisa-pixel-preview")?.shadowRoot;
        if (previewSR) {
            clearInterval(waitForPreview);
            // append pixel style
            previewSR.appendChild( $("style", { textContent: pixelCSS }) );
        }
    }, 100);

};

const checkForUpdates = () => {
    LOG("Checking for updates...");

    // https://violentmonkey.github.io/api/gm/#gm_xmlhttprequest
    GM_xmlhttpRequest({
        url: versionLink,
        method: "GET",
        headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" },
        overrideMimeType: "application/json",
        responseType: "json",
        onload: xhr => {
            if (xhr.status !== 200) {
                throw `Failed to fetch version.json: ${xhr.status} ${ xhr.statusText }`;
            } else {
                LOG("Latest verion is : " + xhr.response.version);
                if (xhr.response.version > VERSION) {
                    LOG("Update available! Sending a notification");
                    updateToast();
                }
            }
        },
        onerror: error => WARN("Error!", error)
    });

}

// -----------------------------------------------------------------------------

GM_addStyle(GM_getResourceText("TOASTIFY_CSS"));

if (location.hostname === "hot-potato.reddit.com") {

    // inside iframe
    window.addEventListener("load", iframeOnLoad, false);

} else {

    // out of iframe
    startToast();
    setInterval(checkForUpdates, SECOND * 15); // Checks for an update every 15 seconds

}
