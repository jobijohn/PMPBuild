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

function editFilter(req, res) {
    var filterId = req.param('filterId');

    async.waterfall([
        function(callback) {
            fs.readFile('savedfilters.txt', 'utf8', function (err, txtData) {
                if (err) {
                    callback(err, null);
                }
                var savedfilters = txtData.split("|");
                var data = {};
                async.eachSeries(savedfilters, function(savedfilter, callback) {
                    if(savedfilter.indexOf("id="+filterId) !== -1) {
                        var index = savedfilter.indexOf("issuetype=");
                        data.filters = savedfilter.substring(index);
                        data.graphFilter = savedfilter.substring(0, index);

                        var graphInfoArray = data.graphFilter.split("&&");
                        var graphInfo = {};
                        async.eachSeries(graphInfoArray, function(eachInfo, callback) {
                            var splitEachInfo = eachInfo.split("=");
                            if(splitEachInfo[0].toString() === 'type'){
                                graphInfo.type = splitEachInfo[1].toString();
                            }
                            if(graphInfo.type === 'bar' || graphInfo.type === 'line') {
                                if (splitEachInfo[0].toString() === 'title') {
                                    graphInfo.title = splitEachInfo[1].toString();
                                }
                                if (splitEachInfo[0].toString() === 'xLabel') {
                                    graphInfo.xLabel = splitEachInfo[1].toString();
                                }
                                if (splitEachInfo[0].toString() === 'yLabel') {
                                    graphInfo.yLabel = splitEachInfo[1].toString();
                                }
                                if (splitEachInfo[0].toString() === 'xDataType') {
                                    graphInfo.xDataType = splitEachInfo[1].toString();
                                }
                                if (splitEachInfo[0].toString() === 'yDataType') {
                                    graphInfo.yDataType = splitEachInfo[1].toString();
                                }
                                if (splitEachInfo[0].toString() === 'head') {
                                    graphInfo.head = splitEachInfo[1].toString();
                                }
                            } else if(graphInfo.type === 'pie') {
                                if (splitEachInfo[0].toString() === 'title') {
                                    graphInfo.title = splitEachInfo[1].toString();
                                }
                                if (splitEachInfo[0].toString() === 'xDataType') {
                                    graphInfo.xDataType = splitEachInfo[1].toString();
                                }
                                if (splitEachInfo[0].toString() === 'yDataType') {
                                    graphInfo.yDataType = splitEachInfo[1].toString();
                                }
                            }

                            if(splitEachInfo[0].toString() === 'head'){
                                graphInfo.head = splitEachInfo[1].toString();
                            }
                            data.graphInfo = graphInfo;
                            callback();
                        });
                        callback();
                    } else {
                        callback();
                    }
                });

                callback(null, data);
            });
        },
        function(data, callback) {
            var filterArray = data.filters.split("&&");
            var filters = {};
            async.eachSeries(filterArray, function(eachFilter, callback) {
                var splitEachFilter = eachFilter.split("=");
                filters[splitEachFilter[0]] = splitEachFilter[1];
            });
            callback(null, data, filters);
        },
        function(data, filters, callback) {
            if(filters["districts"])
                data.district = filters["districts"].split(',');
            else
                data.district = '';
            if(filters["taluks"])
                data.taluk = filters["taluks"].split(',');
            else
                data.taluk = '';
            if(filters["issuetype"])
                data.issuetype = filters["issuetype"];
            else
                data.issuetype = '';
            if(filters["acres"])
                data.acres = filters["acres"].split(',');
            else
                data.acres = '';
            callback(null, data);
        },
        function (data, callback) {
            var filter= "";
            var districtFilter, talukFilter, issuetypeFilter, acreFilter;
            if(data.issuetype) {
                issuetypeFilter = "e.fields.issuetype.name == '"+ data.issuetype +"'";
                filter = issuetypeFilter;
            }

            if(data.district) {
                districtFilter = "(e.fields.customfield_10400 != null)&&(";
                for (i = 0; i < data.district.length; i++) {
                    if (i != data.district.length - 1) {
                        districtFilter += 'e.fields.customfield_10400.value == "' + data.district[i] + '"||';
                    } else {
                        districtFilter += 'e.fields.customfield_10400.value == "' + data.district[i] + '")';
                    }
                }
                filter = filter + '&&' + districtFilter;
            }

            if(data.taluk) {
                talukFilter = "(e.fields.customfield_10401 != null &&  (";
                for (i = 0; i < data.taluk.length; i++) {
                    if (i != data.taluk.length - 1) {
                        talukFilter += 'e.fields.customfield_10401.value == "' + data.taluk[i] + '"||';
                    } else {
                        talukFilter += 'e.fields.customfield_10401.value == "' + data.taluk[i] + '"))';
                    }
                }
                filter = filter + '&&' + talukFilter;
            }



            if(data.acres) {
                acreFilter = "(e.fields.customfield_10403 != null)&&(";
                for (i = 0; i < data.acres.length; i++) {
                    if (i != data.acres.length - 1) {
                        acreFilter += 'e.fields.customfield_10403' + data.acres[i] + '&&';
                    } else {
                        acreFilter += 'e.fields.customfield_10403' + data.acres[i] + ')';
                    }
                }
                filter = filter + '&&' + acreFilter;
            }
            var issueJsonFile = 'jiraissues.json';
            common.readJsonFile(issueJsonFile, function (err, issueData) {
                var issues = issueData.issues;
                var filteredIssues = issues.filter(function (e) {
                    return eval(filter);
                });
                if(filteredIssues.length>0) {
                    data.filteredIssues = filteredIssues;
                    data.isFilteredIssues = true;
                    callback(null, data);
                } else {
                    data.isFilteredIssues = false;
                }
            });
        },
        function (data, callback) {
            populateGraphData(data.graphInfo, data.filteredIssues, function (err, graphData) {
                data.graphInfo = graphData;
                callback(null, data);
            });
        }
    ], function (err, data) {
        return res.json({
            data:data,
            graphInfo:data.graphInfo,
            filteredIssues:data.filteredIssues});
    });
}
exports.generateBarGraph = generateBarGraph;
exports.generateLineGraph = generateLineGraph;
exports.generatePieChart = generatePieChart;
exports.populateGraphData = populateGraphData;
exports.getGraphData = getGraphData;
exports.updateGraph = updateGraph;
exports.editFilter = editFilter;