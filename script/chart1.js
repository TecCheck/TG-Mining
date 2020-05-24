var chart1 = {
    classes: [],
    selectedClasses: [],
    chart: null
};

function setupChart1() {
    if (chart1.chart != null)
        chart1.chart.destroy();

    var chartLayout = document.getElementById("chart1-card");
    var classAddMenu = document.getElementById("chart1-class-add-menu");
    var classAddChip = document.getElementById("chart1-class-add-chip");

    chartLayout.style.removeProperty("display");
    const menu = new MDCMenu(classAddMenu);
    classAddChip.addEventListener("click", function () { menu.open = true });

    // Getting and sorting classes
    var json = window.database;
    for (var d = 0; d < json.length; d++) {
        var day = json[d];
        for (var e = 0; e < day.entries.length; e++) {
            var entry = day.entries[e];
            for (var c = 0; c < entry.class.length; c++) {
                var clazz = entry.class[c];
                if (!chart1.classes.includes(clazz))
                    chart1.classes[chart1.classes.length] = clazz;
            }
        }
    }
    chart1.classes = sortClasses(chart1.classes);
    chart1.selectedClasses = new Array(chart1.classes.length).fill(true);

    listChips();

    var ctx = document.getElementById('chart1').getContext('2d');
    chart1.chart = new Chart(ctx, {
        type: 'bar',
        data: getChart1Data(),
        options: {
            responsive: true,
            maintainAspectRatio: !isMobile(),
            scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{ stacked: true }]
            }
        }
    });
}

function updateGraph1() {
    chart1.chart.data = getChart1Data();
    chart1.chart.update();
}

function getChart1Data() {
    var color = Chart.helpers.color;
    var json = window.database;

    // Getting data for classes
    var classes = [];
    for (var i = 0, index = 0; i < chart1.selectedClasses.length; i++) {
        if (chart1.selectedClasses[i]) {
            classes[index] = chart1.classes[i];
            index++;
        }
    }

    console.log(classes);

    var replacementCounts = new Array(classes.length).fill(0);
    var removeCounts = new Array(classes.length).fill(0);
    var etcCounts = new Array(classes.length).fill(0);

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

    // Creating data
    var data = {
        labels: classes,
        datasets: [
            {
                label: "Vertretung",
                data: replacementCounts,
                backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
                borderColor: window.chartColors.green,
                borderWidth: 2
            },
            {
                label: "Entfall",
                data: removeCounts,
                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: window.chartColors.red,
                borderWidth: 2
            },
            {
                label: "Sonstiges",
                data: etcCounts,
                backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(),
                borderColor: window.chartColors.yellow,
                borderWidth: 2
            }
        ]
    }
    return data;
}

function listChips() {
    var classAddChip = document.getElementById("chart1-class-add-chip");
    var classAddMenu = document.getElementById("chart1-class-add-menu");
    var menuList = classAddMenu.getElementsByClassName("mdc-list")[0];
    var chipSet = document.getElementById("chart1-chip-set");

    var baseChip = document.getElementById("chart1-base-chip");
    var baseMenuItem = document.getElementById("chart1-base-menu-item");

    for (var i = 0; i < chart1.selectedClasses.length; i++) {
        // Adding chip
        var clazz = chart1.classes[i];
        var chip = baseChip.cloneNode(true);
        chip.style.removeProperty("display");
        chip.removeAttribute("id");
        chip.getElementsByClassName("mdc-chip__text")[0].innerText = clazz;
        chip.setAttribute("classIndex", i);
        chip.addEventListener("click", function (event) {
            removeClass(event.target);
        });

        chipSet.insertBefore(chip, classAddChip, baseChip);

        // Adding menu item
        var clazz = chart1.classes[i];
        var menuItem = baseMenuItem.cloneNode(true);
        menuItem.style.removeProperty("display");
        menuItem.removeAttribute("id");
        menuItem.getElementsByClassName("mdc-list-item__text")[0].innerText = clazz;
        menuItem.setAttribute("classIndex", i);
        menuItem.addEventListener("click", function (event) {
            addClass(event.target);
        });

        var menuList = classAddMenu.getElementsByClassName("mdc-list")[0];
        menuList.insertBefore(menuItem, baseMenuItem);

        if (chart1.selectedClasses[i]) {
            chipSet.children[i].style.removeProperty("display");
            menuList.children[i].style.setProperty("display", "none");
        } else {
            chipSet.children[i].style.setProperty("display", "none");
            menuList.children[i].style.removeProperty("display");
        }
    }
}

function addClass(element) {
    element = getParentNode(element, "mdc-list-item", 2);
    var index = element.getAttribute("classIndex");
    chart1.selectedClasses[index] = true;
    updateGraph1();

    var chipSet = document.getElementById("chart1-chip-set");
    var classAddMenu = document.getElementById("chart1-class-add-menu");
    var menuList = classAddMenu.getElementsByClassName("mdc-list")[0];
    chipSet.children[index].style.removeProperty("display");
    menuList.children[index].style.setProperty("display", "none");
}

function removeClass(element) {
    element = getParentNode(element, "mdc-chip");
    var index = element.getAttribute("classIndex");
    chart1.selectedClasses[index] = false;
    updateGraph1();

    var chipSet = document.getElementById("chart1-chip-set");
    var classAddMenu = document.getElementById("chart1-class-add-menu");
    var menuList = classAddMenu.getElementsByClassName("mdc-list")[0];
    chipSet.children[index].style.setProperty("display", "none");
    menuList.children[index].style.removeProperty("display");
}