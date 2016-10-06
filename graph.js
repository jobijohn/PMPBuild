/**
 * Created by jobi on 10/4/16.
 */

function generateBarGraph(req, res) {

    //TODO: validations
    var title = req.param('graph-title'); console.log(title);
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

function generateLineGraph(req, res) {
    return res.json({test: 'test'});
}

function generatePieChart(req, res) {
    return res.json({test: 'test'});
}

exports.generateBarGraph = generateBarGraph;
exports.generateLineGraph = generateLineGraph;
exports.generatePieChart = generatePieChart;