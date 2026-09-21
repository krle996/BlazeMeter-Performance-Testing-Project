/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7359895833333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.23333333333333334, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.3883333333333333, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.9233333333333333, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.8033333333333333, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.805, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.9716666666666667, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.49333333333333335, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.975, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.8216666666666667, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.7966666666666666, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.585, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.49333333333333335, 500, 1500, "Fill Payment Form"], "isController": true}, {"data": [0.495, 500, 1500, "Choose Cities"], "isController": true}, {"data": [0.495, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "Open Website"], "isController": true}, {"data": [0.7983333333333333, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.4816666666666667, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.6266666666666667, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.6533333333333333, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [0.7866666666666666, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.61, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [0.3883333333333333, 500, 1500, "Choose Flight"], "isController": true}, {"data": [0.9683333333333334, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.9733333333333334, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.965, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.9816666666666667, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.8833333333333333, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8400, 0, 0.0, 532.8823809523824, 56, 13437, 409.0, 1028.9000000000005, 1350.0, 2050.9199999999983, 16.425787704515724, 356.07111290578047, 26.61513829437749], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 300, 0, 0.0, 1700.8066666666673, 878, 13437, 1546.0, 2258.100000000001, 2639.2, 5478.020000000008, 0.9950182751689873, 279.88974005562153, 5.010072487081346], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 300, 0, 0.0, 1287.2133333333322, 550, 4384, 1164.0, 1854.3000000000009, 2134.7999999999993, 2861.3800000000015, 0.7251543974571253, 5.437779864275269, 4.246118913235277], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 300, 0, 0.0, 412.17666666666673, 253, 2366, 360.0, 561.8000000000001, 685.8499999999995, 1561.900000000001, 0.8953139269065711, 6.418701391914719, 0.8332364964276975], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 300, 0, 0.0, 501.5066666666665, 188, 1978, 460.5, 839.2000000000003, 978.75, 1647.0600000000018, 0.726070530491332, 0.12415995152269092, 0.7118894654426731], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 300, 0, 0.0, 507.44000000000005, 188, 3759, 437.5, 820.5000000000002, 1077.9499999999998, 1563.920000000001, 0.7260353869647607, 0.12564760843943534, 0.7118550083131052], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 300, 0, 0.0, 299.4299999999999, 185, 869, 268.5, 409.80000000000007, 534.2499999999998, 792.6600000000003, 0.8954208179370698, 0.15419193121377275, 0.8779321300867364], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 300, 0, 0.0, 294.9266666666666, 184, 1233, 265.0, 407.90000000000003, 500.29999999999984, 868.2400000000007, 0.8953753861306353, 0.1549302539881512, 0.8778875856202712], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 300, 0, 0.0, 168.04666666666668, 74, 544, 148.0, 257.50000000000017, 313.34999999999985, 495.94000000000005, 0.8958646885974343, 0.22659077572923383, 0.8608699741990969], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 300, 0, 0.0, 794.5399999999998, 479, 6162, 676.5, 1148.0000000000007, 1410.0499999999993, 2486.560000000006, 0.7044386680473665, 4.639022145203595, 4.214249297322429], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 300, 0, 0.0, 301.3866666666669, 186, 1844, 269.0, 406.0, 492.95, 750.99, 0.8954208179370698, 0.15414529471283853, 0.8761832613017031], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 300, 0, 0.0, 295.38666666666694, 188, 995, 268.0, 406.0, 503.5499999999999, 839.5900000000013, 0.8955945703086517, 0.1532772790642828, 0.8781024888573109], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 300, 0, 0.0, 477.4299999999999, 180, 2078, 423.0, 745.7, 946.9999999999998, 1640.990000000001, 0.7259949761147653, 0.12487491711557357, 0.7118153867375238], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 300, 0, 0.0, 492.1199999999999, 182, 1789, 447.0, 801.7000000000005, 960.4499999999998, 1565.3800000000006, 0.7262937713046174, 0.12493576839460026, 0.7106898035617447], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 300, 0, 0.0, 215.72333333333322, 68, 1162, 188.5, 330.90000000000003, 416.79999999999995, 691.8800000000001, 0.7265241872010656, 0.183759535629957, 0.6981443361385239], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 300, 0, 0.0, 644.7266666666673, 259, 2009, 593.5, 873.1000000000004, 1055.55, 1639.4600000000005, 0.7258298654795315, 4.759827811985871, 0.7074005915513404], "isController": false}, {"data": ["Fill Payment Form", 300, 0, 0.0, 794.5399999999998, 479, 6162, 676.5, 1148.0000000000007, 1410.0499999999993, 2486.560000000006, 0.7259721371893746, 4.7808290117825285, 4.343071594162216], "isController": true}, {"data": ["Choose Cities", 300, 0, 0.0, 767.1399999999998, 500, 4211, 680.0, 1087.3000000000006, 1281.6999999999998, 2361.270000000004, 0.9959531105275564, 8.077854069630401, 5.788004844481922], "isController": true}, {"data": ["https://blazedemo.com/reserve.php", 300, 0, 0.0, 767.1399999999998, 500, 4211, 680.0, 1087.3000000000006, 1281.6999999999998, 2361.270000000004, 0.8945770737787532, 7.255625771572727, 5.198855630915391], "isController": false}, {"data": ["Open Website", 300, 0, 0.0, 1700.8066666666673, 878, 13437, 1546.0, 2258.100000000001, 2639.2, 5478.020000000008, 0.9948565914223465, 279.8442598640031, 5.009258384153925], "isController": true}, {"data": ["https://blazedemo.com/-5", 300, 0, 0.0, 520.2166666666665, 190, 4191, 468.5, 792.8000000000001, 1006.0, 1889.020000000001, 1.0000666711114075, 3.972322113140876, 0.8418529985332355], "isController": false}, {"data": ["https://blazedemo.com/-4", 300, 0, 0.0, 904.0366666666663, 393, 2051, 832.5, 1328.8000000000002, 1561.55, 1936.7800000000002, 0.9978645698205839, 123.53181379348194, 0.8380503223102561], "isController": false}, {"data": ["https://blazedemo.com/-3", 300, 0, 0.0, 698.0833333333336, 269, 8687, 621.5, 1039.8000000000002, 1194.6999999999998, 1643.5000000000014, 0.9992206079258179, 38.53279598163433, 0.8401649838126262], "isController": false}, {"data": ["https://blazedemo.com/-2", 300, 0, 0.0, 636.286666666667, 255, 1733, 578.0, 950.6000000000001, 1102.6, 1475.2300000000016, 0.9986917138548501, 28.26517314401468, 0.837769709180973], "isController": false}, {"data": ["https://blazedemo.com/-1", 300, 0, 0.0, 523.2800000000003, 248, 1357, 491.5, 824.9000000000001, 958.7999999999997, 1165.97, 1.0002934194030249, 82.03578257955668, 0.8576734592147031], "isController": false}, {"data": ["https://blazedemo.com/-0", 300, 0, 0.0, 697.8533333333335, 352, 11791, 576.5, 948.8000000000001, 1159.0, 1731.8400000000001, 0.998542128492401, 4.639281336748348, 0.8152160345894993], "isController": false}, {"data": ["Choose Flight", 300, 0, 0.0, 1287.213333333332, 550, 4384, 1164.0, 1854.3000000000009, 2134.7999999999993, 2861.3800000000015, 0.8939319896542272, 6.703407426637981, 5.23439083004565], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php-5", 300, 0, 0.0, 308.1166666666668, 185, 3477, 256.0, 409.0, 560.4499999999996, 1415.800000000003, 0.7050147700594328, 0.1205501817763082, 0.6912449503317094], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 300, 0, 0.0, 289.4466666666667, 185, 1419, 250.5, 406.90000000000003, 518.55, 820.5600000000004, 0.7050760777087848, 0.12192858578190587, 0.6913050605660351], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 300, 0, 0.0, 304.5699999999998, 186, 3720, 251.0, 411.90000000000003, 596.4499999999996, 884.4700000000005, 0.7050760777087848, 0.12123085424667322, 0.6913050605660351], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 300, 0, 0.0, 289.2933333333332, 187, 1106, 255.5, 403.90000000000003, 490.95, 818.6300000000003, 0.7050147700594328, 0.12122949288287589, 0.689867968358937], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 300, 0, 0.0, 162.43666666666647, 56, 734, 137.5, 270.7000000000001, 336.79999999999995, 560.6400000000003, 0.7052832770282185, 0.1783870788577232, 0.6777331490193036], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 300, 0, 0.0, 427.08666666666664, 254, 2442, 358.5, 627.8000000000001, 831.5999999999997, 1136.96, 0.7048342229907526, 3.9785597505591683, 0.7764189487632509], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
