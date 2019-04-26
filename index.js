/* jshint esversion:6 */

window.onload = function () {
    forceHttps();
};

function forceHttps() {
    if (window.location.href.indexOf("greeny.cs.tlu.ee") != -1 || window.location.href.indexOf("www.tlu.ee") != -1) {
        if (location.protocol == 'http:') {
            location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
        }
    }
}
