var chart4 = {
    chart: null,
    options: {
        alpha: 0.5,
        borderWidth: 2
    }
};

function setupChart4() {
    if (chart4.chart != null)
        chart4.chart.destroy();
    else
        createLayout(4, "Einträge pro Fach");

    var config = {
        type: 'bar',
        plugins: [],
        data: getChart4Data(),
        options: {
            responsive: true,
            maintainAspectRatio: !isMobile(),
            legend: {
                position: 'top'
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                }]
            },
            tooltips: {
                callbacks: {
                    title: function (tooltipItems, data) {
                        return getSubject(tooltipItems[0].label);
                    }
                }
            }
        }
    };

    var ctx = document.getElementById('chart4').getContext('2d');
    chart4.chart = new Chart(ctx, config);
}


function getChart4Data() {
    var color = Chart.helpers.color;
    var json = window.database;

    var labels = [];
    var labelsLenght = [];

    for (var d = 0; d < json.length; d++) {
        var day = json[d];

        for (var e = 0; e < day.entries.length; e++) {
            var entry = day.entries[e];
            var subject = getSimpleSubjectName(entry.subject.old);

            if (!labels.includes(subject)) {
                var i = labels.length;
                labels[i] = subject
                labelsLenght[i] = subject.length;
            }
        }
    }

    labels = selectionSort(labelsLenght, labels)[1];
    labels = selectionSort(labels, labelsLenght)[0];

    var length = labels.length;
    var replacementCounts = new Array(length).fill(0);
    var removeCounts = new Array(length).fill(0);
    var etcCounts = new Array(length).fill(0);

    for (var d = 0; d < json.length; d++) {
        var day = json[d];

        for (var e = 0; e < day.entries.length; e++) {
            var entry = day.entries[e];
            var index = labels.indexOf(entry.subject.old);

            if (isTypeRemove(entry.type)) {
                if (!removeCounts[index])
                    removeCounts[index] = 0;
                removeCounts[index]++;
            } else if (isTypeReplace(entry.type)) {
                if (!replacementCounts[index])
                    replacementCounts[index] = 0;
                replacementCounts[index]++;
            } else {
                if (!etcCounts[index])
                    etcCounts[index] = 0;
                etcCounts[index]++;
            }
        }
    }

    // Creating data
    var borderWidth = chart4.options.borderWidth;
    var alpha = chart4.options.alpha;

    var data = {
        labels: labels,
        datasets: [
            {
                label: "Vertretung",
                data: replacementCounts,
                backgroundColor: color(window.chartColors.green).alpha(alpha).rgbString(),
                borderColor: window.chartColors.green,
                borderWidth: borderWidth
            },
            {
                label: "Entfall",
                data: removeCounts,
                backgroundColor: color(window.chartColors.red).alpha(alpha).rgbString(),
                borderColor: window.chartColors.red,
                borderWidth: borderWidth
            },
            {
                label: "Sonstiges",
                data: etcCounts,
                backgroundColor: color(window.chartColors.yellow).alpha(alpha).rgbString(),
                borderColor: window.chartColors.yellow,
                borderWidth: borderWidth
            }
        ]
    }
    return data;
}