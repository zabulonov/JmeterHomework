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

    var data = {"OkPercent": 98.98203592814372, "KoPercent": 1.0179640718562875};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9831432821021319, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET guestbook"], "isController": false}, {"data": [1.0, 500, 1500, "GET UpdateComments"], "isController": false}, {"data": [1.0, 500, 1500, "Clear Guestbook History"], "isController": true}, {"data": [0.9492537313432836, 500, 1500, "POST Send Comment"], "isController": false}, {"data": [1.0, 500, 1500, "TRUNCATE Guestbook Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET Clients"], "isController": false}, {"data": [1.0, 500, 1500, "GET /service/guestbook"], "isController": false}, {"data": [0.9492537313432836, 500, 1500, "SendComment Load"], "isController": true}, {"data": [1.0, 500, 1500, "GET Home page"], "isController": false}, {"data": [1.0, 500, 1500, "GET Guestbook"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1670, 17, 1.0179640718562875, 8.491017964071867, 0, 239, 7.0, 12.900000000000091, 16.449999999999818, 31.0, 5.564162793409633, 39.13748253390141, 2.3417587085811387], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET guestbook", 12, 0, 0.0, 11.333333333333334, 6, 34, 9.5, 27.400000000000023, 34.0, 34.0, 0.044073897234362946, 0.17698424358173873, 0.017173325191905096], "isController": false}, {"data": ["GET UpdateComments", 318, 0, 0.0, 6.41194968553459, 1, 36, 5.0, 9.0, 14.0, 27.0, 1.0723860589812333, 2.361250305613165, 0.3183646112600536], "isController": false}, {"data": ["Clear Guestbook History", 13, 0, 0.0, 45.07692307692308, 0, 156, 32.0, 117.19999999999996, 156.0, 156.0, 0.043506925967945434, 1.1660817024511132, 0.04137602785112599], "isController": true}, {"data": ["POST Send Comment", 335, 17, 5.074626865671642, 9.44179104477611, 2, 239, 6.0, 14.400000000000034, 21.0, 33.19999999999993, 1.1325028312570782, 0.33893541036324604, 0.7775260517908757], "isController": false}, {"data": ["TRUNCATE Guestbook Request", 9, 0, 0.0, 24.66666666666667, 4, 130, 7.0, 130.0, 130.0, 130.0, 0.03567761705231528, 3.135728061238648E-4, 0.0], "isController": false}, {"data": ["GET Clients", 318, 0, 0.0, 8.094339622641503, 2, 35, 7.0, 12.0, 14.0, 25.24000000000001, 1.073424968269828, 6.431115410483784, 0.41616182851867356], "isController": false}, {"data": ["GET /service/guestbook", 12, 0, 0.0, 8.666666666666666, 6, 14, 8.0, 12.800000000000004, 14.0, 14.0, 0.044075839828398064, 0.1268399941415863, 0.013085014949055677], "isController": false}, {"data": ["SendComment Load", 335, 17, 5.074626865671642, 40.57910447761194, 19, 246, 36.0, 54.400000000000034, 63.19999999999999, 85.75999999999988, 1.135912816148272, 38.64849977917516, 2.3412704888154976], "isController": true}, {"data": ["GET Home page", 347, 0, 0.0, 9.452449567723335, 2, 42, 8.0, 15.0, 18.0, 34.559999999999945, 1.1744955084854762, 25.998329776211218, 0.4037328310418824], "isController": false}, {"data": ["GET Guestbook", 318, 0, 0.0, 8.371069182389943, 2, 49, 7.0, 12.0, 16.0, 28.860000000000014, 1.0724149908777278, 4.306416447743376, 0.4304321887214318], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 17, 100.0, 1.0179640718562875], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1670, 17, "500", 17, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Send Comment", 335, 17, "500", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
