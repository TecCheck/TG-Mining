// powered by Chart.js (https://www.chartjs.org/)

function makeGraphs() {
    makeGraph1();
    makeGraph2();
}

function showGraphLayouts() {
    prepareGraph1();
    prepareGraph2();
}

function showTime() {
    var json = window.database;
    var time = document.getElementById("code");
    var start = new Date(json[0].date * 1000);
    var end = new Date(json[json.length - 1].date * 1000);

    time.innerHTML = `Zeitraum: ${getFormatedDate(start)} bis ${getFormatedDate(end)}`
}

function fileSelect(event) {
    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        window.database = JSON.parse(text);
        showTime();
        showGraphLayouts();
        makeGraphs();
    };
    reader.readAsText(event.target.files[0]);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('theFile').addEventListener('change', fileSelect, false);
});