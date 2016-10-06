/**
 * Created by jobi on 10/4/16.
 */

function generateBarGraph(req, res) {

    var title = req.param('title');
    var xLabel = req.param('xLabel');
    var yLabel = req.param('yLabel');
    var xData = req.param('xData');
    var yData = req.param('yData');

    /*if(!request){
        return callback(new Error('No request parameters'));
    }*/



    var Quiche = require('quiche');
    var bar = new Quiche('bar');
    bar.setTitle(title);

    bar.setWidth(400);
    bar.setHeight(265);

    bar.setBarStacked(); // Stacked chart
    bar.setBarWidth(0);
    bar.setBarSpacing(6); // 6 pixles between bars/groups
    bar.setLegendBottom(); // Put legend at bottom
    bar.setTransparentBackground(); // Make background transparent

    bar.addData([19, 19, 21], 'Districts', 'FF0000');
   /* bar.addData([4, 3, 2, 3, 0, 0, 3, 4, 2, 2], 'bar', '0000FF');
    bar.addData([10, 8, 2, 1, 18, 9, 20, 21, 19, 11], 'bin', '008000');
    bar.addData([2, 1, 1, 1, 1, 7, 3, 6, 2, 7], 'bash', '00FF00');
    bar.addData([1, 0, 0, 1, 2, 1, 0, 0, 0, 0], 'blah', '307000');*/

    bar.setAutoScaling(); // Auto scale y axis
    bar.addAxisLabels('x', ['aa', 'bb', 'cc']);
    bar.addAxisLabels('y', ['5', '10', '15']);


    var imageUrl = bar.getUrl(true); // First param controls http vs. https
    console.log('image graph:', imageUrl);
    return res.json({imageUrl: imageUrl});
}

exports.generateBarGraph = generateBarGraph;