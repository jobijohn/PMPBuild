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
                if(graphData.yDataType == 'No. of Acres') {
                    if (graphData.xDataType == 'District') {
                        async.eachSeries(selectedIssues, function (issues, callback) {
                            xDataValues.push([issues.fields.customfield_10400.value, issues.fields.customfield_10403, getRandomColor()]);
                            callback();
                        }, function (err) {
                            graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                            callback(null, graphData);
                        });
                    } else if (graphData.xDataType == 'Taluk') {
                        async.eachSeries(selectedIssues, function (issues, callback) {
                            xDataValues.push([issues.fields.customfield_10401.value, issues.fields.customfield_10403, getRandomColor()]);
                            callback();
                        }, function (err) {
                            graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                            callback(null, graphData);
                        });
                    } else if (graphData.xDataType == 'Status') {
                        async.eachSeries(selectedIssues, function (issues, callback) {
                            xDataValues.push([issues.fields.status.name, issues.fields.customfield_10403, getRandomColor()]);
                            callback();
                        }, function (err) {
                            graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                            callback(null, graphData);
                        });
                    }
                } else if (graphData.yDataType == 'No. of Issues') {
                    if (graphData.xDataType == 'District') {
                        async.eachSeries(selectedIssues, function (issues, callback) {
                            xDataValues.push([issues.fields.customfield_10400.value, 1, getRandomColor()]);
                            callback();
                        }, function (err) {
                            graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                            callback(null, graphData);
                        });
                    } else if (graphData.xDataType == 'Taluk') {
                        async.eachSeries(selectedIssues, function (issues, callback) {
                            xDataValues.push([issues.fields.customfield_10401.value, 1, getRandomColor()]);
                            callback();
                        }, function (err) {
                            graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                            callback(null, graphData);
                        });
                    } else if (graphData.xDataType == 'Status') {
                        async.eachSeries(selectedIssues, function (issues, callback) {
                            xDataValues.push([issues.fields.status.name, 1, getRandomColor()]);
                            callback();
                        }, function (err) {
                            graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                            callback(null, graphData);
                        });
                    }
                }
            } else if(graphData.type == "pie") {
                var xDataValues = [['District', 'Acres']];
                if (graphData.yDataType == 'No. of Acres') {
                    if (graphData.xDataType == 'District') {
                        async.eachSeries(selectedIssues, function (issues, callback) {
                            xDataValues.push([issues.fields.customfield_10400.value, issues.fields.customfield_10403]);
                            callback();
                        }, function (err) {
                            graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                            callback(null, graphData);
                        });
                    } else if (graphData.xDataType == 'Taluk') {
                        async.eachSeries(selectedIssues, function (issues, callback) {
                            xDataValues.push([issues.fields.customfield_10401.value, issues.fields.customfield_10403]);
                            callback();
                        }, function (err) {
                            graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                            callback(null, graphData);
                        });
                    } else if (graphData.xDataType == 'Status') {
                        async.eachSeries(selectedIssues, function (issues, callback) {
                            xDataValues.push([issues.fields.status.name, issues.fields.customfield_10403]);
                            callback();
                        }, function (err) {
                            graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                            callback(null, graphData);
                        });
                    }
                } else if (graphData.yDataType == 'No. of Issues') {
                    if (graphData.xDataType == 'District') {
                        async.eachSeries(selectedIssues, function (issues, callback) {
                            xDataValues.push([issues.fields.customfield_10400.value, 1]);
                            callback();
                        }, function (err) {
                            graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                            callback(null, graphData);
                        });
                    } else if (graphData.xDataType == 'Taluk') {
                        async.eachSeries(selectedIssues, function (issues, callback) {
                            xDataValues.push([issues.fields.customfield_10401.value, 1]);
                            callback();
                        }, function (err) {
                            graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                            callback(null, graphData);
                        });
                    } else if (graphData.xDataType == 'Status') {
                        async.eachSeries(selectedIssues, function (issues, callback) {
                            xDataValues.push([issues.fields.status.name, 1]);
                            callback();
                        }, function (err) {
                            graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                            callback(null, graphData);
                        });
                    }
                }
            }
        });
    } else {
        if(graphData.type == "bar") {
            var xDataValues = [ ['', graphData.xLabel, { role: 'style' } ]];
            if(graphData.yDataType == 'No. of Acres') {
                if (graphData.xDataType == 'District') {
                    async.each(selectedIssues, function (issues, callback) {
                        xDataValues.push([issues.fields.customfield_10400.value, parseInt(issues.fields.customfield_10403), getRandomColor()]);
                        callback();
                    }, function (err) {
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                } else if (graphData.xDataType == 'Taluk') {
                    async.each(selectedIssues, function (issues, callback) {
                        xDataValues.push([issues.fields.customfield_10401.value, parseInt(issues.fields.customfield_10403), getRandomColor()]);
                        callback();
                    }, function (err) {
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                } else if (graphData.xDataType == 'Status') {
                    async.eachSeries(selectedIssues, function (issues, callback) {
                        xDataValues.push([issues.fields.status.name, issues.fields.customfield_10403, getRandomColor()]);
                        callback();
                    }, function (err) {
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                }
            } else if (graphData.yDataType == 'No. of Issues') {
                if (graphData.xDataType == 'District') {
                    async.each(selectedIssues, function (issues, callback) {
                        xDataValues.push([issues.fields.customfield_10400.value, 1, getRandomColor()]);
                        callback();
                    }, function (err) {
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                } else if (graphData.xDataType == 'Taluk') {
                    async.each(selectedIssues, function (issues, callback) {
                        xDataValues.push([issues.fields.customfield_10401.value, 1, getRandomColor()]);
                        callback();
                    }, function (err) {
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                } else if (graphData.xDataType == 'Status') {
                    async.eachSeries(selectedIssues, function (issues, callback) {
                        xDataValues.push([issues.fields.status.name, 1, getRandomColor()]);
                        callback();
                    }, function (err) {
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                }
            }
        } else if(graphData.type == "pie") {
            var xDataValues = [['District', 'Acres']];
            if(graphData.yDataType == 'No. of Acres') {
                if (graphData.xDataType == 'District') {
                    async.each(selectedIssues, function (issues, callback) {
                        xDataValues.push([issues.fields.customfield_10400.value, issues.fields.customfield_10403]);
                        callback();
                    }, function (err) {
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                } else if (graphData.xDataType == 'Taluk') {
                    async.each(selectedIssues, function (issues, callback) {
                        xDataValues.push([issues.fields.customfield_10401.value, issues.fields.customfield_10403]);
                        callback();
                    }, function (err) {
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                } else if (graphData.xDataType == 'Status') {
                    async.eachSeries(selectedIssues, function (issues, callback) {
                        xDataValues.push([issues.fields.status.name, issues.fields.customfield_10403]);
                        callback();
                    }, function (err) {
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                }
            } else if (graphData.yDataType == 'No. of Issues') {
                if (graphData.xDataType == 'District') {
                    async.each(selectedIssues, function (issues, callback) {
                        xDataValues.push([issues.fields.customfield_10400.value, 1]);
                        callback();
                    }, function (err) {
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                } else if (graphData.xDataType == 'Taluk') {
                    async.each(selectedIssues, function (issues, callback) {
                        xDataValues.push([issues.fields.customfield_10401.value, 1]);
                        callback();
                    }, function (err) {
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                } else if (graphData.xDataType == 'Status') {
                    async.eachSeries(selectedIssues, function (issues, callback) {
                        xDataValues.push([issues.fields.status.name, 1]);
                        callback();
                    }, function (err) {
                        graphData["xDataValues"] = RemoveDuplicates(xDataValues);
                        callback(null, graphData);
                    });
                }
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
        yDataType : req.param('data-value-pie')
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

        var data = {};
        async.eachSeries(savedfilters, function(savedfilter, callback) {
            //xDataValues.push([issues.fields.customfield_10400.value, issues.fields.customfield_10403, getRandomColor()]);

            if(savedfilter.indexOf("id="+id) !== -1){
               //console.log('found');
                var index = savedfilter.indexOf("issuetype=");//console.log("#" + index);
                data.filters = savedfilter.substring(index);//console.log("#" + filters);
                var removedFilters = savedfilter.substring(0,index); //console.log('@@'+removedFilters);

                var removedFiltersArray = [];
                removedFiltersArray = removedFilters.split("&&");


                async.eachSeries(removedFiltersArray, function(removedFilter, callback) {
                    var valueFilter = [];
                    var splitArray = removedFilter.split("=");//console.log('%%'+splitArray);
                    if(splitArray[0].toString() === 'type'){
                        data.type = splitArray[1].toString();
                    }
                    if(data.type === 'bar' || data.type === 'line') {
                        if (splitArray[0].toString() === 'title') {
                            data.title = splitArray[1].toString();
                        }
                        if (splitArray[0].toString() === 'xLabel') {
                            data.xLabel = splitArray[1].toString();
                        }
                        if (splitArray[0].toString() === 'yLabel') {
                            data.yLabel = splitArray[1].toString();
                        }
                        if (splitArray[0].toString() === 'xDataType') {
                            data.xDataType = splitArray[1].toString();
                        }
                        if (splitArray[0].toString() === 'yDataType') {
                            data.yDataType = splitArray[1].toString();
                        }
                        if (splitArray[0].toString() === 'head') {
                            data.head = splitArray[1].toString();
                        }
                    } else if(data.type === 'pie') {
                        if (splitArray[0].toString() === 'title') {
                            data.title = splitArray[1].toString();
                        }
                        if (splitArray[0].toString() === 'xDataType') {
                            data.xDataType = splitArray[1].toString();
                        }
                    }

                    if(splitArray[0].toString() === 'head'){
                        data.head = splitArray[1].toString();
                    }
                    callback();
                });

            }
            callback();
        });



        //TODO:
        //Populate X Data values
        //

        return res.json({
            filters: data.filters,
            type: data.type,
            title : data.title,
            xLabel: data.xLabel,
            yLabel : data.yLabel,
            xDataType : data.xDataType,
            yDataType : data.yDataType,
            head : data.head
        });
    });

}

function getGraphData(req,res) {
    var graphData = req.param('graphdata');
    populateGraphData(graphData,'', function (err, data) {
        return res.json({data:data })
    })
}

function updateGraph(req, res) {
    var filter = req.param('filter');
    var id = req.param('id');
    var newFilter = "";
    fs.readFile('savedfilters.txt', 'utf8', function (err, txtData) {
        if (err) {
            callback(err, null);
        }
        var splitTxtData = txtData.split("|");
        async.eachSeries(splitTxtData, function (splitTxt, callback) {
                if(splitTxt.indexOf("id="+id) !== -1) {
                    var index = splitTxt.indexOf("head=");
                    var filters = splitTxt.substring(index);
                    var replcedFilter = splitTxt.replace(filters, filter);
                    console.log('res',replcedFilter);
                    if(newFilter == "")
                        newFilter = replcedFilter;
                    else
                        newFilter = newFilter + "|" + replcedFilter;
                    callback();
                } else {
                    if(newFilter == "")
                        newFilter = splitTxt;
                    else
                        newFilter = newFilter + "|" + splitTxt;
                    callback();
                }
            },
            function (err, result) {
                fs.writeFile('savedfilters.txt',newFilter, function (err) {
                    if (err) return console.log(err);
                    res.send({success:'success'});
                })
            });
    });

}
exports.generateBarGraph = generateBarGraph;
exports.generateLineGraph = generateLineGraph;
exports.generatePieChart = generatePieChart;
exports.populateGraphData = populateGraphData;
exports.editGraph = editGraph;
exports.getGraphData = getGraphData;
exports.updateGraph = updateGraph;