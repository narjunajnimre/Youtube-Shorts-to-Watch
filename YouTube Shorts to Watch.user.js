// ==UserScript==
// @name        YouTube Shorts to Watch
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Redirect YouTube shorts to regular watch URLs
// @author      narju
// @match       *://*.youtube.com/*
// @grant       none
// ==/UserScript==

// Define the pattern for YouTube shorts URLs
let shortsPattern = /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;
let intervalId;

// Function to redirect from 'shorts' to 'watch' URLs
function redirectShorts() {
    let match = window.location.href.match(shortsPattern);
    if (match) {
        // Construct new URL
        let newUrl = 'https://www.youtube.com/watch?v=' + match[1];
        // Replace the current history entry with the new URL
        history.replaceState(null, '', newUrl);
        // Reload the page
        location.reload();
    }
    // Clear the interval once the URL has been checked
    clearInterval(intervalId);
}

// Run the function once when the script loads
redirectShorts();

// Listen for click events on the document
document.addEventListener('click', function(event) {
    var target = event.target;
    while (target && target.nodeName !== 'A') {
        target = target.parentNode;
    }
    if (target && target.href.match(shortsPattern)) {
        event.preventDefault();
        event.stopPropagation();
        let videoId = target.href.split('shorts/')[1];
        let newUrl = 'https://www.youtube.com/watch?v=' + videoId;
        window.location.href = newUrl;
    }
}, true);

// Set up a MutationObserver to start the interval when the page's content changes
new MutationObserver(function() {
    // Start the interval to check the URL
    intervalId = setInterval(redirectShorts, 100);
}).observe(document.body, {childList: true, subtree: true});