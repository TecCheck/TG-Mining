var customChart = {
    chart: null
};

function setupCustomChart() {

    setupTextFields();
    setupSelects();
    setupFABRipple();
    setupDataList();

    if (customChart.chart != null)
        customChart.chart.destroy();

    var graphLayout = document.getElementById("custom-chart-card");
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
            title: {
                display: true,
                text: 'Erweitert'
            },
            legend: {
                position: isMobile() ? 'bottom' : 'left',
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
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var num = data.datasets[0].data[tooltipItem.index];
                        var title = data.labels[tooltipItem.index];
                        var perc = Math.round(num / total * 100);
                        console.log(tooltipItem);
                        console.log(data);
                        return `${title}: ${num} (${perc}%)`;
                    }
                }
            }
        }
    };

    while (config.data.datasets[0].borderColor.length < config.data.datasets[0].data.length) {
        var length = config.data.datasets[0].borderColor.length;
        config.data.datasets[0].borderColor[length] = window.chartColors.grey;
    }

    var ctx = document.getElementById('custom-chart').getContext('2d');
    //customChart.chart = new Chart(ctx, config);
}

function setupTextFields() {
    var tf = document.getElementsByClassName('mdc-text-field');
    var textFields = [];

    for (var i = 0; i < tf.length; i++)
        textFields[i] = new MDCTextField(tf[i]);
}

function setupSelects() {
    var sl = document.getElementsByClassName('mdc-select');
    var selects = [];

    for (var i = 0; i < sl.length; i++) {
        selects[i] = new MDCSelect(sl[i]);
    }
}

function setupDataList() {
    var list = document.getElementById('data-list');
    var baseDataItem = document.getElementById('base-data-item');
    var addItemButton = document.getElementById('data-add-item').getElementsByTagName("button")[0];

    var checkbox = new MDCCheckbox(baseDataItem.getElementsByClassName('mdc-checkbox')[0]);
    checkbox.checked = true;

    addItemButton.addEventListener('click', function (event) {
        var item = baseDataItem.cloneNode(true);
        item.removeAttribute("id");
        item.style.setProperty("display", "flex");

        // Selects
        var sl = item.getElementsByClassName('mdc-select');
        var selects = [];
        for (var i = 0; i < sl.length; i++) {
            selects[i] = new MDCSelect(sl[i]);
        }

        // Text Field
        var textField = new MDCTextField(item.getElementsByClassName('mdc-text-field')[0]);

        // Remove Button
        var removeButton = item.getElementsByClassName('mdc-icon-button')[0];
        removeButton.addEventListener('click', function () {
            console.log(event);
            item.remove();
        });

        list.insertBefore(item, document.getElementById('data-add-item'));
    });
}

function setupFABRipple() {
    // Get all available buttons
    var fabs = document.getElementsByClassName('mdc-fab');

    // Apply a ripple effect to all of them
    for (var i = 0; i < fabs.length; i++)
        var ripple = new MDCRipple(fabs[i]);
}

function getCustomConfig() {

    var config = {
        type: null,
        data: []
    };

    // Chart Type
    var chartType = document.getElementById('chart-type-select');
    config.type = new MDCSelect(chartType).value;
    
    // Labels (TODO)


    // Data
    var list = document.getElementById('data-list');
    var listItems = list.children;

    for (var i = 0; i < listItems.length; i++) {
        var item = listItems[i]
        if (!item.id) {
            var index = config.data.length;
            config.data[index] = {};

            var nameField = new MDCTextField(item.getElementsByClassName('mdc-text-field')[0]);
            var selects = item.getElementsByClassName('mdc-select');
            var colorSelect = new MDCSelect(selects[0]);
            var subjectSelect = new MDCSelect(selects[1]);
            var classSelect = new MDCSelect(selects[2]);
            var typeSelect = new MDCSelect(selects[3]);
            var timeSelect = new MDCSelect(selects[4]);

            config.data[index].name = nameField.value;
            config.data[index].color = colorSelect.value;
            config.data[index].subject = subjectSelect.value;
            config.data[index].class = classSelect.value;
            config.data[index].type = typeSelect.value;
            config.data[index].time = timeSelect.value;
        }
    }

    return config;
}