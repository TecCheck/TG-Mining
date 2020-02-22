var chart1;

var classes = [];
var replacementCounts = [];
var removeCounts = [];
var etcCounts = [];

function prepareGraph1() {
    var graphLayout = document.getElementById("graph1");
    graphLayout.style.removeProperty("display");

    document.getElementById("switch-1-1").addEventListener('change', function () {
        updateGraph1();
    });

    document.getElementById("switch-1-2").addEventListener('change', function () {
        updateGraph1();
    });

    document.getElementById("switch-1-3").addEventListener('change', function () {
        updateGraph1();
    });
}

function makeGraph1() {
    makeData();
    var data = getData();
    var ctx = document.getElementById('chart1').getContext('2d');
    chart1 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data[1],
            datasets: data[0]
        },
        options: {
            responsive: true,
            maintainAspectRatio: !isMobile(),
            legend: {
                display: true,
            },
            tooltips: {
                enabled: true
            },
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
    showClassSelection(data[1]);
}

function updateGraph1() {
    var data = getData();
    chart1.data.datasets = data[0];
    chart1.data.labels = data[1];
    chart1.update();
}

function makeData() {
    var json = window.database;
    classes = ["6TG8/1", "6TG8/2", "6TG9/1", "6TG9/2", "6TG10/1", "6TG10/2", "TGM11/1", "TGTM11/2", "TGG11/3", "TGI11/4", "TGTM11/5", "TGG11/6", "TGM12/1", "TGTM12/2", "TGG12/3", "TGI12/4", "TGTM12/5", "TGG12/6", "TGM13/1", "TGTM13/2", "TGG13/3", "TGI13/4", "TGTM13/5", "TGG13/6", "_HUMP", "K2FR2", ""];
    replacementCounts = [];
    removeCounts = [];
    etcCounts = [];

    for (var i = 0; i < classes.length; i++) {
        replacementCounts[i] = 0;
        removeCounts[i] = 0;
        etcCounts[i] = 0;
    }

    for (var d = 0; d < json.length; d++) {
        var day = json[d];
        for (var e = 0; e < day.entries.length; e++) {
            var entry = day.entries[e];
            for (var c = 0; c < entry.class.length; c++) {
                var clazz = classes.indexOf(entry.class[c]);
                if (isTypeRemove(entry.type))
                    removeCounts[clazz]++;
                else if (isTypeReplace(entry.type))
                    replacementCounts[clazz]++;
                else
                    etcCounts[clazz]++;
            }
        }
    }
}

function getData() {
    var color = Chart.helpers.color;

    var repl = [];
    var rem = [];
    var etc = [];
    var cl = [];

    try {
        for (var i = 0; i < classes.length; i++) {
            var checkbox = document.getElementById(`checkbox-1-${i}`)
            var checked = checkbox.parentElement.MaterialCheckbox.inputElement_.checked;
            if (checked) {
                var index = repl.length;
                repl[index] = replacementCounts[i];
                rem[index] = removeCounts[i];
                etc[index] = etcCounts[i];
                cl[index] = classes[i];
            }
        }
    }
    catch (err) {
        repl = replacementCounts;
        rem = removeCounts;
        etc = etcCounts;
        cl = classes;
    }

    var datasets = [];
    if (document.getElementById("switch-1-1").parentElement.MaterialSwitch.inputElement_.checked) {
        datasets[datasets.length] = {
            label: "Vertretung",
            data: repl,
            backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
            borderColor: window.chartColors.green,
            borderWidth: 2
        };
    }

    if (document.getElementById("switch-1-2").parentElement.MaterialSwitch.inputElement_.checked) {
        datasets[datasets.length] = {
            label: "Entfall",
            data: rem,
            backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
            borderColor: window.chartColors.red,
            borderWidth: 2
        };
    }

    if (document.getElementById("switch-1-3").parentElement.MaterialSwitch.inputElement_.checked) {
        datasets[datasets.length] = {
            label: "Sonstiges",
            data: etc,
            backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(),
            borderColor: window.chartColors.yellow,
            borderWidth: 2
        };
    }

    return [datasets, cl];
}

function showClassSelection(classes) {
    classConfig = document.getElementById("class-selection1");
    classConfig.innerHTML = getClassesSwitches(1, classes, updateGraph1());

    // Fixed the whole thing thanks to Jon 
    // (https://stackoverflow.com/questions/32363511/how-can-i-update-refresh-google-mdl-elements-that-i-add-to-my-page-dynamically)
    componentHandler.upgradeDom();

    for (var i = 0; i < classes.length; i++) {
        var checkbox = document.getElementById(`checkbox-1-${i}`);
        checkbox.addEventListener('change', function () {
            updateGraph1();
        });
    }
}