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

function sortClasses(classes) {
    var nullID = 1000;
    var identifiers = [];

    for (var i = 0; i < classes.length; i++) {
        var match = classes[i].match("[0-9]+\/[0-9]");
        identifiers[i] = match == null ? nullID : parseInt(match[0].replace("/", ""));
    }

    var ret = selectionSort(classes, identifiers);
    return ret[0];
}

function getSimpleSubjectName(subjectID) {
    var replace = "[0-9]"
    return subjectID.replace(new RegExp(replace), "");
}

function getSubject(subjectID) {
    var subject = subjectID.toLowerCase().replace("/","_");

    var subjects = {
        d: "Deutsch",
        e: "Englisch",
        m: "Mathe",
        s: "Sport",
        bk: "Bildende Kunst",
        ch: "Chemie",
        ct: "Computer Technik",
        gs: "Global Studies",
        it: "Informatik",
        ph: "Physik",
        te: "Technik",
        eth: "Ethik",
        evr: "Evangelische Religion",
        f_a: "Französisch A",
        f_b: "Französisch B",
        ggk: "Geschichte",
        gmt: "Gestaltungs- und Medientechnik",
        bio: "Biologie",
        itü: "Informatik Übungen",
        ait: "Angewante Informatik",
        rel: "Katholische Religion",
    }

    return subjects[subject] || subjectID;
}

function selectionSort(array, identifiers, inverse = false) {
    var length = array.length;
    for (var i = 0; i < length - 1; i++) {
        var min = i;

        for (var j = i + 1; j < length; j++)
            if (inverse) {
                if (identifiers[j] > identifiers[min])
                    min = j;
            } else {
                if (identifiers[j] < identifiers[min])
                    min = j;
            }

        if (min != i) {
            var tmp = array[i];
            array[i] = array[min];
            array[min] = tmp;

            tmp = identifiers[i];
            identifiers[i] = identifiers[min];
            identifiers[min] = tmp;
        }
    }

    return [array, identifiers];
}

function getParentNode(element, parentNodeName, maxIterations = 5) {
    var node = element;
    for (var i = 0; i < maxIterations; i++) {
        if (node.classList.contains(parentNodeName))
            return node;
        node = node.parentNode;
    }
    return null;
}

function createLayout(layoutID, title) {
    var baseChart = document.getElementById("base-chart-card");
    var graphLayout = baseChart.cloneNode(true);
    var customChart = document.getElementById("customChartInclude");;
    graphLayout.setAttribute("id", `chart${layoutID}-card`);
    graphLayout.style.removeProperty("display");
    graphLayout.getElementsByClassName("card-title")[0].innerText = title;
    graphLayout.getElementsByTagName("canvas")[0].setAttribute("id", `chart${layoutID}`);
    document.getElementsByClassName("mdc-top-app-bar--fixed-adjust")[0].insertBefore(graphLayout, customChart);
}