function init() {
    console.log("Hello world!");
}

if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
} else {
    window.addEventListener("DOMContentLoaded", init);
}