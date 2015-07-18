var cps = require('cps-api');

exports.index = function (req, res) {

    var cpsConn = new cps.Connection(  'tcp://cloud-us-0.clusterpoint.com:9007',  'user',     'root',    'aaa','document','document/id', {account: 100884});
    var id = 1,
        name = "Username";
    var insert_request = new cps.InsertRequest('<document><id>'+id+'</id>'+cps.Term(name, "Username")+'</document>');
    cpsConn.sendRequest(insert_request, function(err, insert_response) {
        if (err) return console.error(err);
        console.log('New user registered: ' + insert_response.document.id);
    });
    res.render('index');
};
