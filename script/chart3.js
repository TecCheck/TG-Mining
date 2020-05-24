var chart3 = {
    chart: null,
    options: {
        steppedLine: false,
        fill: false,
        alpha: 1
    }
};

function setupChart3() {
    if (chart3.chart != null)
        chart3.chart.destroy();

    var graphLayout = document.getElementById("chart3-card");
    graphLayout.style.removeProperty("display");

    var config = {
        type: 'bar',
        plugins: [],
        data: getChart3Data(),
        options: {
            responsive: true,
            maintainAspectRatio: !isMobile(),
            legend: {
                position: 'top'
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    type: 'time',
                    time: {
                        parser: 'll',
                        tooltipFormat: 'dddd ll',
                        unit: 'week'
                    }
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'value'
                    }
                }]
            },
        }
    };

    var ctx = document.getElementById('chart3').getContext('2d');
    chart3.chart = new Chart(ctx, config);
}


function getChart3Data() {
    var color = Chart.helpers.color;
    var json = window.database;

    var length = json.length;

    var replacementCounts = new Array(length).fill(0);
    var removeCounts = new Array(length).fill(0);
    var etcCounts = new Array(length).fill(0);
    var totalCounts = new Array(length).fill(0);
    var labels = new Array(length).fill(0);

    for (var d = 0; d < json.length; d++) {
        var day = json[d];
        labels[d] = new Date(day.date * 1000);

        for (var e = 0; e < day.entries.length; e++) {
            var entry = day.entries[e];
            totalCounts[d]++;

            if (isTypeRemove(entry.type))
                removeCounts[d]++;
            else if (isTypeReplace(entry.type))
                replacementCounts[d]++;
            else
                etcCounts[d]++;
        }
    }

    // Creating data

    var borderWidth = 2;
    var steppedLine = chart3.options.steppedLine; //"middle";
    var fill = chart3.options.fill;
    var alpha = chart3.options.alpha;

    var total = {
        label: "Gesamt",
        data: totalCounts,
        backgroundColor: color(window.chartColors.purple).alpha(alpha).rgbString(),
        borderColor: window.chartColors.purple,
        borderWidth: borderWidth,
        steppedLine: steppedLine,
        fill: fill,
        hidden: true
    };

    var data = {
        labels: labels,
        datasets: [
            {
                label: "Vertretung",
                data: replacementCounts,
                backgroundColor: color(window.chartColors.green).alpha(alpha).rgbString(),
                borderColor: window.chartColors.green,
                borderWidth: borderWidth,
                steppedLine: steppedLine,
                fill: fill
            },
            {
                label: "Entfall",
                data: removeCounts,
                backgroundColor: color(window.chartColors.red).alpha(alpha).rgbString(),
                borderColor: window.chartColors.red,
                borderWidth: borderWidth,
                steppedLine: steppedLine,
                fill: fill
            },
            {
                label: "Sonstiges",
                data: etcCounts,
                backgroundColor: color(window.chartColors.yellow).alpha(alpha).rgbString(),
                borderColor: window.chartColors.yellow,
                borderWidth: borderWidth,
                steppedLine: steppedLine,
                fill: fill
            }
        ]
    }
    return data;
}