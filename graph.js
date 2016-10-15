/**
 * Created by jobi on 10/4/16.
 */
var common = require('./common'),
    async = require('async'),
    index = require("./index"),
    fs = require('fs');

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function RemoveDuplicates(xDataValues) {
    var sum = {},result;

    for (var i=0,c;c=xDataValues[i];++i) {
        if ( undefined === sum[c[0]] ) {
            sum[c[0]] = c;
        }
        else {
            sum[c[0]][1] += c[1];
        }
    }
    result = Object.keys(sum).map(function(val) { return sum[val]});
    return result;
}
function populateGraphData(graphData, selectedIssues, callback) {
    if(selectedIssues == "") {
        common.readJsonFile('filteredissues.json', function(err, selectedIssues){
            if(graphData.type == "bar") {
                var xDataValues = [ ['', graphData.xLabel, { role: 'style' } ]];
                if(graphData.xDataType == 'District') {
                    async.eachSeries(selectedIssues, function(issues, callback) {
                        xDataValues.push([issues.fields.customfield_10400.value, issues.fields.customfield_10403, getRandomColor()]);
                        callback();
                    }, function(err){
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                } else if(graphData.xDataType == 'Taluk') {
                    async.eachSeries(selectedIssues, function(issues, callback) {
                        xDataValues.push([issues.fields.customfield_10401.value, issues.fields.customfield_10403, getRandomColor()]);
                        callback();
                    }, function(err){
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                }
            } else if(graphData.type == "pie") {
                var xDataValues = [['District', 'Acres']];
                if (graphData.xDataType == 'District') {
                    async.eachSeries(selectedIssues, function(issues, callback) {
                        xDataValues.push([issues.fields.customfield_10400.value, issues.fields.customfield_10403]);
                        callback();
                    }, function(err){
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                } else if (graphData.xDataType == 'Taluk') {
                    async.eachSeries(selectedIssues, function(issues, callback) {
                        xDataValues.push([issues.fields.customfield_10401.value, issues.fields.customfield_10403]);
                        callback();
                    }, function(err){
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                }
            }
        });
    } else {
        if(graphData.type == "bar") {
            var xDataValues = [ ['', graphData.xLabel, { role: 'style' } ]];
            //xDataValues.push([["'" + 'test' + "'", "'" + graphData.xLabel + "'", { role: 'style' } ]]);
            if(graphData.xDataType == 'District') {
                async.each(selectedIssues, function(issues, callback) {
                    xDataValues.push([issues.fields.customfield_10400.value, parseInt(issues.fields.customfield_10403), getRandomColor()]);
                    callback();
                }, function(err){
                    graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                    callback(null, graphData);
                });
            } else if(graphData.xDataType == 'Taluk') {
                async.each(selectedIssues, function(issues, callback) {
                    xDataValues.push([issues.fields.customfield_10401.value, parseInt(issues.fields.customfield_10403), getRandomColor()]);
                    callback();
                }, function(err){
                    graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                    callback(null, graphData);
                });
            }
        } else if(graphData.type == "pie") {
            var xDataValues = [['District', 'Acres']];
            if (graphData.xDataType == 'District') {
                async.each(selectedIssues, function(issues, callback) {
                    xDataValues.push([issues.fields.customfield_10400.value, issues.fields.customfield_10403]);
                    callback();
                }, function(err){
                    graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                    callback(null, graphData);
                });
            } else if (graphData.xDataType == 'Taluk') {
                async.each(selectedIssues, function(issues, callback) {
                    xDataValues.push([issues.fields.customfield_10401.value, issues.fields.customfield_10403]);
                    callback();
                }, function(err){
                    graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                    callback(null, graphData);
                });
            }
        }
    }
}

function generateBarGraph(req, res) {
    //TODO: validations

    var graphData = {
        type:'bar',
        id : req.param('id'),
        title : req.param('graph-title'),
        xLabel : req.param('horizontal-axis-label'),
        yLabel : req.param('vertical-axis-label'),
        xDataType : req.param('horizontal-data-type'),
        yDataType : req.param('vertical-data-type')
    };

    // console.log("ID........" + graphData.id);
    populateGraphData(graphData,'',function (err, graphData) {
        return res.json(graphData);
    });
}

function generatePieChart(req, res) {
    //TODO: validations
    var graphData = {
        type:'pie',
        title : req.param('graph-title-pie'),
        xLabel : '',
        yLabel : '',
        xDataType : req.param('data-name-pie'),
        yDataType : ''
    };
    populateGraphData(graphData,'', function (err, graphData) {
        return res.json(graphData);
    });
}

function generateLineGraph(req, res) {
    //TODO: validations
    var title = req.param('graph-title-line');
    var xLabel = req.param('horizontal-axis-label-line');
    var yLabel = req.param('vertical-axis-label-line');
    var xDataType = req.param('horizontal-data-type-line');
    var xDataValues = [];
    xDataValues = [
        [1,  37.8],
        [2,  30.9],
        [3,  25.4],
        [4,  11.7],
        [5,  11.9],
        [6,   8.8],
        [7,   7.6],
        [8,  12.3],
        [9,  16.9],
        [10, 12.8],
        [11,  5.3],
        [12,  6.6],
        [13,  4.8],
        [14,  4.2]
    ];
    var yDataType = req.param('vertical-data-type-line');
    var yDataValues = req.param('vertical-data-values-line');

    return res.json({
        title: title,
        xLabel: xLabel,
        yLabel: yLabel,
        xDataType : xDataType,
        xDataValues : xDataValues,
        yDataType : yDataType,
        yDataValues : yDataValues
    });
}

function editGraph(req, res){
    var id= req.param('id');

    fs.readFile('savedfilters.txt', 'utf8', function (err, txtData) {
        if (err) {
            callback(err, null);
        }
        var savedfilters = txtData.split("|");
        for(var i in savedfilters) {
            for(var j in savedfilters) {
                if(savedfilters[j].indexOf("id="+id)){
                    var index = savedfilters[j].toString().indexOf("issuetype=");//console.log("#" + index);
                    var filters = savedfilters[j].toString().substring(index);//console.log("#" + filters);

                    var removedFilters = savedfilters[j].toString().substring(0,index); console.log('@@'+removedFilters);
                    break;
                }
            }
        }

        var removedFiltersArray = [];
        removedFiltersArray = removedFilters.split("&&");

        for(var i in removedFiltersArray) {
            var valueFilter = [];
            var splitArray = removedFiltersArray[i].toString().split("=");console.log('%%'+splitArray);
            if(splitArray[0].toString() === 'type'){
                var type = splitArray[1].toString();
            }
            if(type === 'bar' || type === 'line') {
                if (splitArray[0].toString() === 'title') {
                    var title = splitArray[1].toString();
                }
                if (splitArray[0].toString() === 'xLabel') {
                    var xLabel = splitArray[1].toString();
                }
                if (splitArray[0].toString() === 'yLabel') {
                    var yLabel = splitArray[1].toString();
                }
                if (splitArray[0].toString() === 'xDataType') {
                    var xDataType = splitArray[1].toString();
                }
                if (splitArray[0].toString() === 'yDataType') {
                    var yDataType = splitArray[1].toString();
                }
                if (splitArray[0].toString() === 'head') {
                    var head = splitArray[1].toString();
                }
            } else if(type === 'pie') {
                if (splitArray[0].toString() === 'title') {
                    var title = splitArray[1].toString();
                }
                if (splitArray[0].toString() === 'dataType') {
                    var dataType = splitArray[1].toString();
                }
            }

            if(splitArray[0].toString() === 'head'){
                var head = splitArray[1].toString();
            }

        }

        //TODO:
        //Populate X Data values
        //


        return res.json({
            filters: filters,
            type: type,
            title : title,
            xLabel:xLabel,
            yLabel : yLabel,
            xDataType : xDataType,
            yDataType : yDataType,
            head : head,
            dataType : dataType
        });
    });

}

exports.generateBarGraph = generateBarGraph;
exports.generateLineGraph = generateLineGraph;
exports.generatePieChart = generatePieChart;
exports.populateGraphData = populateGraphData;
exports.editGraph = editGraph;
