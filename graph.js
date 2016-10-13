/**
 * Created by jobi on 10/4/16.
 */
var common = require('./common');


function populateGraphData(graphData, callback) {
    if(graphData.type == "bar") {
        var xDataValues = [ ['', graphData.xLabel, { role: 'style' } ]];
        common.readJsonFile('filteredissues.json', function(err, selectedIssues){
            if(graphData.xDataType == 'District') {
                for(var i=0;i<selectedIssues.length;i++) {
                    xDataValues.push([selectedIssues[i].fields.customfield_10400.value, selectedIssues[i].fields.customfield_10403,'gray']);
                }
            } else if(graphData.xDataType == 'Taluk') {
                for(var i=0;i<selectedIssues.length;i++) {
                    xDataValues.push([selectedIssues[i].fields.customfield_10401.value, selectedIssues[i].fields.customfield_10403,'gray']);
                }
            }
            graphData["xDataValues"] = xDataValues;
            callback(null, graphData);
        });
    } else if(graphData.type == "pie") {
        var xDataValues = [['District', 'Acres']];
        common.readJsonFile('filteredissues.json', function(err, selectedIssues) {
            if (graphData.xDataType == 'District') {
                for (var i = 0; i < selectedIssues.length; i++) {
                    xDataValues.push([selectedIssues[i].fields.customfield_10400.value, selectedIssues[i].fields.customfield_10403]);
                }
            } else if (graphData.xDataType == 'Taluk') {
                for (var i = 0; i < selectedIssues.length; i++) {
                    xDataValues.push([selectedIssues[i].fields.customfield_10401.value, selectedIssues[i].fields.customfield_10403]);
                }
            }
            graphData["xDataValues"] = xDataValues;
            callback(null, graphData);
        });
    }

}

function generateBarGraph(req, res) {
    //TODO: validations

    var graphData = {
        type:'bar',
        title : req.param('graph-title'),
        xLabel : req.param('horizontal-axis-label'),
        yLabel : req.param('vertical-axis-label'),
        xDataType : req.param('horizontal-data-type'),
        yDataType : req.param('vertical-data-type')
    };
    populateGraphData(graphData, function (err, graphData) {
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
    populateGraphData(graphData, function (err, graphData) {
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
exports.generateBarGraph = generateBarGraph;
exports.generateLineGraph = generateLineGraph;
exports.generatePieChart = generatePieChart;
exports.populateGraphData = populateGraphData;