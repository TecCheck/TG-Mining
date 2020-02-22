// powered by Chart.js (https://www.chartjs.org/)

function makeGraphs() {
    makeGraph1();
}

function showGraphLayouts() {
    prepareGraph1();
}

function fileSelect(event) {
    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        window.database = JSON.parse(text);
        showGraphLayouts();
        makeGraphs();
    };
    reader.readAsText(event.target.files[0]);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('theFile').addEventListener('change', fileSelect, false);
});