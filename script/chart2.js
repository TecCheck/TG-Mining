var chart2 = {
    chart: null
};

function setupChart2() {
    if (chart2.chart != null)
        chart2.chart.destroy();

    var graphLayout = document.getElementById("chart2-card");
    graphLayout.style.removeProperty("display");

    var json = window.database;
    var color = Chart.helpers.color;

    var types = [];
    var counts = [];
    var total = 0;

    for (var d = 0; d < json.length; d++) {
        var day = json[d];
        for (var e = 0; e < day.entries.length; e++) {
            var entry = day.entries[e];
            if (!types.includes(entry.type)) {
                counts[types.length] = 0;
                types[types.length] = entry.type;
            }
            counts[types.indexOf(entry.type)]++;
            total++;
        }
    }

    var sort = selectionSort(types, counts, true);
    types = sort[0];
    counts = sort[1];

    var config = {
        type: 'doughnut',
        plugins: [],
        data: {
            datasets: [{
                data: counts,
                backgroundColor: [
                    color(window.chartColors.red).alpha(0.5).rgbString(),
                    color(window.chartColors.orange).alpha(0.5).rgbString(),
                    color(window.chartColors.yellow).alpha(0.5).rgbString(),
                    color(window.chartColors.green).alpha(0.5).rgbString(),
                    color(window.chartColors.blue).alpha(0.5).rgbString(),
                    color(window.chartColors.purple).alpha(0.5).rgbString(),
                ],
                borderColor: [
                    window.chartColors.red,
                    window.chartColors.orange,
                    window.chartColors.yellow,
                    window.chartColors.green,
                    window.chartColors.blue,
                    window.chartColors.purple
                ],
                label: 'Dataset 1',
                borderWidth: 2,
                borderAlign: "inner"
            }],
            labels: types
        },
        options: {
            responsive: true,
            maintainAspectRatio: !isMobile(),
            legend: {
                position: isMobile() ? 'bottom' : 'right',
            },
            plugins: {
                doughnutlabel: {
                    labels: [{
                        text: `${total}`,
                        font: {
                            size: '36'
                        }
                    }]
                }
            }
        }
    };

    while (config.data.datasets[0].borderColor.length < config.data.datasets[0].data.length) {
        var length = config.data.datasets[0].borderColor.length;
        config.data.datasets[0].borderColor[length] = window.chartColors.grey;
    }

    var ctx = document.getElementById('chart2').getContext('2d');
    chart2.chart = new Chart(ctx, config);
}