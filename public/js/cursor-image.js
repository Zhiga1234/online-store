
function setCustomCursor() {
    document.documentElement.style.cursor = "url('img/cursor.png'), auto";
}

window.addEventListener("load", setCustomCursor);








function zoomIn(element) {
    element.style.transform = "scale(1.2)"; // You can adjust the scale factor as needed
    element.style.transition = "transform 0.2s";
}

function zoomOut(element) {
    element.style.transform = "scale(1)";
}