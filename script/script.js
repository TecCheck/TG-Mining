// powered by Chart.js (https://www.chartjs.org/)
const MDCIconButtonToggle = mdc.iconButton.MDCIconButtonToggle;
const MDCMenu = mdc.menu.MDCMenu;


function setup() {
    var darkNightButton = document.getElementById("dark-night-switch")
    var darkNightSwitch = new MDCIconButtonToggle(darkNightButton);

    darkNightButton.addEventListener("click", function () {
        updateDarkMode(darkNightSwitch);
    });

    darkNightSwitch.on = window.matchMedia("(prefers-color-scheme: dark)").matches;
    updateDarkMode(darkNightSwitch);

    // Setting locale for momentjs
    moment.locale("de");

    Chart.defaults.global.defaultFontFamily = "\'Rubik\', \'Roboto\'," + Chart.defaults.global.defaultFontFamily;
}

// https://www.w3schools.com/howto/howto_html_include.asp
function includeHTML() {
    var includes, element, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    includes = document.getElementsByTagName("*");
    for (var i = 0; i < includes.length; i++) {
        element = includes[i];
        /*search for elements with a certain atrribute:*/
        file = element.getAttribute("include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { element.innerHTML = this.responseText; }
                    if (this.status == 404) { element.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    element.removeAttribute("include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}

function updateDarkMode(darkNightSwitch) {
    var cssId = "dark-css";
    var css = document.getElementById(cssId);
    if (darkNightSwitch.on) {
        if (!css) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = document.location.href + "/css/theme-dark.css";
            link.media = 'all';
            head.appendChild(link);
        }

        Chart.defaults.global.defaultFontColor = "#999";
    } else if (css) {
        css.remove();
    }
}

function fileSelect(event) {
    var reader = new FileReader();
    reader.onload = setupCharts;
    reader.readAsText(event.target.files[0]);
}

function tryReadUrl() {
    var reader = new FileReader();
    reader.onload = setupCharts;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/tgm.json");
    xhr.responseType = "blob";
    xhr.onload = function () { reader.readAsText(xhr.response); }
    xhr.send();
}

function setupCharts(event) {
    var text = event.target.result;
    window.database = JSON.parse(text);
    showTime();

    setupChart1();
    setupChart2();
    setupChart4();
    setupChart3();
    setupChart5();
    feather.replace()
}

function showTime() {
    var json = window.database;
    var start = moment(json[0].date * 1000);
    var end = moment(json[json.length - 1].date * 1000);

    document.getElementById("time-card").style.removeProperty("display");

    document.getElementById("time-start").innerHTML = `Von: ${start.format("dddd, LL")}`;
    document.getElementById("time-end").innerHTML = `Bis: ${end.format("dddd, LL")}`;
    document.getElementById("time-lenght").innerHTML = `Das sind ${end.diff(start, 'months')} Monate, ${end.diff(start, 'weeks')} Wochen oder ${end.diff(start, 'days')} Tage.`;
    document.getElementById("time-school").innerHTML = `Davon sind ${json.length} Tage in der Datenbank und ${end.diff(start, 'days') - json.length} Tage nicht.`;
}

document.addEventListener("DOMContentLoaded", function () {
    includeHTML();
    setup();
    feather.replace()
    setTimeout(function () {
        tryReadUrl();
    }, 1000);

    document.getElementById('theFile').addEventListener('change', fileSelect, false);
});