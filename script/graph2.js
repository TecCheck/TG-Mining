function prepareGraph2() {
    var graphLayout = document.getElementById("graph2");
    graphLayout.style.removeProperty("display");
}

function makeGraph2() {
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

    var sort = selectionSort(types, counts);
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
                    window.chartColors.purple,
                    window.chartColors.grey,
                    window.chartColors.grey,
                    window.chartColors.grey,
                    window.chartColors.grey,
                    window.chartColors.grey,
                    window.chartColors.grey
                ],
                label: 'Dataset 1',
                borderWidth: 2,
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
                        text: `${total} Einträge`,
                        font: {
                            size: '18'
                        }
                    }]
                }
            }
        }
    };

    var ctx = document.getElementById('chart2').getContext('2d');
    window.myPie = new Chart(ctx, config);
}

function selectionSort(types, counts) {
    // This is a modified version of a function that was written by Ankur Agarwal
    // (https://codingmiles.com/sorting-algorithms-insertion-sort-using-javascript-2/)
    var length = counts.length;
    for (var i = 0; i < length - 1; i++) {
        //Number of passes
        var min = i; //min holds the current minimum number position for each pass; i holds the Initial min number
        for (var j = i + 1; j < length; j++) { //Note that j = i + 1 as we only need to go through unsorted array
            if (counts[j] > counts[min]) { //Compare the numbers
                min = j; //Change the current min number position if a smaller num is found
            }
        }
        if (min != i) {
            //After each pass, if the current min num != initial min num, exchange the position.
            //Swap the numbers 
            var tmp = counts[i];
            counts[i] = counts[min];
            counts[min] = tmp;

            var tmp1 = types[i];
            types[i] = types[min];
            types[min] = tmp1;
        }
    }

    return [types, counts];
}