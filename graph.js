/**
 * Created by jobi on 10/4/16.
 */

function generateBarGraph(req, res) {

    //TODO: validations
    var title = req.param('graph-title');
    var xLabel = req.param('horizontal-axis-label');
    var yLabel = req.param('vertical-axis-label');
    var xDataType = req.param('horizontal-data-type');

    var xDataValues = [];
    xDataValues = [
        ['', '', { role: 'style' } ], //District should be xLabel
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
    var title = req.param('graph-title');
    var xLabel = req.param('horizontal-axis-label');
    var yLabel = req.param('vertical-axis-label');
    var xDataType = req.param('horizontal-data-type');
    var xDataValues = req.param('horizontal-data-values');
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

function generatePieChart(req, res) {
    //TODO: validations
    var title = req.param('graph-title');
    var xLabel = req.param('horizontal-axis-label');
    var yLabel = req.param('vertical-axis-label');
    var xDataType = req.param('horizontal-data-type');
    var xDataValues = req.param('horizontal-data-values');
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