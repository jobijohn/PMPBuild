/**
 * Created by jobi on 10/4/16.
 */

function generateBarGraph(req, res) {

   /* var title = req.param('title');
    var xLabel = req.param('xLabel');
    var yLabel = req.param('yLabel');
    var xData = req.param('xData');
    var yData = req.param('yData');*/
    return res.json({test: 'test'});
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