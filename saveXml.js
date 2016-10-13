/**
 * Created by jobi on 10/8/16.
 */


function saveToXml(req, res) {
    var pack = req.param('packages');
    var data = req.param('data');
    var options = req.param('options');
    var xml;

    var xmlVersion = '<?xml version="1.0" encoding="utf-8"?>';
    xml = xmlVersion + '<charts>';
    xml += '<chart>';
    xml += '<package>' + pack + '</package>';
    xml += '<data>' + data + '</data>';
    xml += '<options>' + options + '</options>';
    xml += '</chart>';
    xml += '</charts>';

    var fs = require('fs');
    //console.log(xml);
    fs.writeFile('db.xml', xml, function (err) {
        if(err){
            console.log(err);
            return res.json({success:"failed"});
        }
        return res.json({success:"success"});
    });
}

function getCharts(req, res){
    var fs = require('fs');
    //console.log(xml);
    fs.readFile('db.xml','utf8', function (err, data) {
        if(err){
            console.log(err);
            return res.json({data:"failed"});
        }
        console.log(data);
        return res.json({data:data});
    });
}

exports.saveToXml = saveToXml;
exports.getCharts = getCharts;