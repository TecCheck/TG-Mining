var chart5 = {
    chart: null,
    options: {
        alpha: 0.5,
        borderWidth: 2,
        fill: false
    }
};

function setupChart5() {
    if (chart5.chart != null)
        chart5.chart.destroy();
    else
        createLayout(5, "Einträge pro Woche");

    var config = {
        type: 'line',
        plugins: [],
        data: getChart5Data(),
        options: {
            responsive: true,
            maintainAspectRatio: !isMobile(),
            legend: {
                position: 'top'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        parser: '[Woche] ww yyyy',
                        displayFormats: {
                            week: "[Woche] ww"
                        },
                        tooltipFormat: '[Woche] ww yyyy',
                        unit: 'week'
                    }
                }],
                yAxes: [{
                    stacked: false,
                }]
            },
        }
    };

    var ctx = document.getElementById('chart5').getContext('2d');
    chart5.chart = new Chart(ctx, config);
}


function getChart5Data() {
    var color = Chart.helpers.color;
    var json = window.database;

    var replacementCounts = [];
    var removeCounts = [];
    var etcCounts = [];
    var totalCounts = [];
    var labels = [];

    var start = moment(json[0].date * 1000);
    var end = moment(json[json.length - 1].date * 1000);
    var weeks = [];
    var days = [];
    var d = 0;

    while (start < end) {
        var day = json[d];
        if (!day) break;

        var week = start.week();

        if (!weeks.includes(week)) {
            var l = weeks.length;
            weeks[l] = week;
            days[l] = 0
            labels[l] = start.toDate();

            replacementCounts[l] = 0;
            removeCounts[l] = 0;
            etcCounts[l] = 0;
            totalCounts[l] = 0;
        }
        var index = weeks.indexOf(week);
        days[index]++;

        for (var e = 0; e < day.entries.length; e++) {
            var entry = day.entries[e];
            totalCounts[index]++;

            if (isTypeRemove(entry.type))
                removeCounts[index]++;
            else if (isTypeReplace(entry.type))
                replacementCounts[index]++;
            else
                etcCounts[index]++;
        }

        start = start.add(1, "days");
        d++;
    }


    console.log("Weeks | Days | ETC | Remove | Replace | Total | Label")
    console.log("----- | ---- | --- | ------ | ------- | ----- | -----")
    for (var i = 0; i < weeks.length; i++) {
        console.log(`${weeks[i]} | ${days[i]} | ${etcCounts[i]} | ${removeCounts[i]} | ${replacementCounts[i]} | ${totalCounts[i]} | ${labels[i]} `)
    }

    // Creating data
    var borderWidth = chart5.options.borderWidth;
    var alpha = chart5.options.alpha;
    var fill = chart5.options.fill;

    var data = {
        labels: labels,
        datasets: [
            {
                label: "Vertretung",
                data: replacementCounts,
                backgroundColor: color(window.chartColors.green).alpha(alpha).rgbString(),
                borderColor: window.chartColors.green,
                borderWidth: borderWidth,
                fill: fill
            },
            {
                label: "Entfall",
                data: removeCounts,
                backgroundColor: color(window.chartColors.red).alpha(alpha).rgbString(),
                borderColor: window.chartColors.red,
                borderWidth: borderWidth,
                fill: fill
            },
            {
                label: "Sonstiges",
                data: etcCounts,
                backgroundColor: color(window.chartColors.yellow).alpha(alpha).rgbString(),
                borderColor: window.chartColors.yellow,
                borderWidth: borderWidth,
                fill: fill
            },
            {
                label: "Gesamt",
                data: totalCounts,
                backgroundColor: color(window.chartColors.purple).alpha(alpha).rgbString(),
                borderColor: window.chartColors.purple,
                borderWidth: borderWidth,
                fill: fill,
                hidden: true
            }
        ]
    }
    return data;
}