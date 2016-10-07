/**
 * Created by jobi on 10/4/16.
 */


function generateBarGraph(req, res) {
    //TODO: validations
    var title = req.param('graph-title-line');
    var xLabel = req.param('horizontal-axis-label');
    var yLabel = req.param('vertical-axis-label');
    var xDataType = req.param('horizontal-data-type');
    var xDataValues = [];
    xDataValues = [
        ['', xLabel, { role: 'style' } ], //District should be xLabel
        ['Godavari', 50, 'gray'],
        ['Srikakulam', 40, '#76A7FA'],
        ['Vizianagaram', 80, '#703593'],
        ['Anantapur', 10, '#b87333'],
        ['Chittoor', 25, '#871B47']
    ];
    var yDataType = req.param('vertical-data-type');
    var yDataValues = req.param('vertical-data-values');

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

function generatePieChart(req, res) {
    //TODO: validations
    var title = req.param('graph-title-pie');
    var xLabel = req.param('horizontal-axis-label');
    var yLabel = req.param('vertical-axis-label');
    var xDataType = req.param('horizontal-data-type');
    var xDataValues = [];
    xDataValues = [
        ['District', 'Acres'],
        ['Godavari', 11],
        ['Srikakulam', 2],
        ['Vizianagaram', 2],
        ['Anantapur', 2],
        ['Chittoor', 7]
    ];
    var yDataType = req.param('vertical-data-type');
    var yDataValues = req.param('vertical-data-values');

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