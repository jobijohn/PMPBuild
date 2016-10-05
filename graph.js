/**
 * Created by jobi on 10/4/16.
 */

function createBarGraph(request, response, callback) {
    console.log('here...');
    if(!request){
        console.log('No request parameters');
        return callback(new Error('No request parameters'));
    }

    var test = request.param('graphTitle');
    if(test){
        console.log(test);
    } else {
        console.log(test);
    }
    callback('');
}

exports.createBarGraph = createBarGraph;