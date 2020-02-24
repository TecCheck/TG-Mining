// Colors from chartjs example (https://www.chartjs.org/samples/latest/charts/bar/stacked.html)

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

function isTypeRemove(t) {
    return t == 'Entfall';
}

function isTypeReplace(t) {
    var replace = ['Raum-Vtr.', 'Statt-Vertretung', 'Betreuung', 'Vertretung', 'Lehrertausch', 'Verlegung', 'Unterricht geändert', 'Tausch'];
    return (replace.indexOf(t) != -1);
}

function getRandomColors(length) {
    var backgroundColors = [];
    var borderColors = [];

    var hue = 0;
    for (var i = 0; i < length; i++) {
        hue += 1 / length + 0.2;
        if (hue > 1)
            hue -= 1;
        //var rgb = hslToRgb(hue, 0.6, 0.5);
        var rgb = hslToRgb(hue, 1, 0.4);
        rgb[0] = Math.round(rgb[0]);
        rgb[1] = Math.round(rgb[1]);
        rgb[2] = Math.round(rgb[2]);
        backgroundColors[i] = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.2)`;
        borderColors[i] = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
    }

    return [backgroundColors, borderColors];
}

function hslToRgb(h, s, l) {
    // This function was written by mjackson (https://gist.github.com/mjackson/5311256)
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}

function getClassesSwitches(graphNumber, classes) {
    var colSize = 2;
    html = "";
    for (var i = 0; i < classes.length; i++) {
        var id = `checkbox-${graphNumber}-${i}`
        html += `<div class="mdl-cell--${colSize}-col class-switch">\n` +
            `<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="${id}">
                <input type="checkbox" id="${id}" class="mdl-checkbox__input" checked>
                <span class="mdl-checkbox__label">${classes[i]}</span>
            </label>` +
            "\n</div>"
    }
    return html;
}

function isMobile() {
    let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    return isMobile;
}

function getFormatedDate(date) {
    var day = String(date.getDate());
    var month = String(date.getMonth() + 1);
    var year = String(date.getFullYear());
    return `${day.padStart(2, '0')}.${month.padStart(2, '0')} ${year.padStart(4, '0')}`;
}