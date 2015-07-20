var cps = require('cps-api');
var watson = require('watson-developer-cloud');

var personality_insights = watson.personality_insights({
    username: '237f1e66-ca5a-474e-b3c7-45d3701f0439',
    password: 'rqpcXciWeYR7',
    version: 'v2'
});


exports.index = function (req, res) {


};

exports.fb = function (req, res) {

    var cpsConn = new cps.Connection(  'tcp://cloud-us-0.clusterpoint.com:9007',  'user',     'root',    'aaa','document','document/id', {account: 100884});

    //Data
    var FB = req.body;
    var json = FB;
    var essay ='Vice President Johnson, Mr. Speaker, Mr. Chief Justice, President Eisenhower, Vice President Nixon, President Truman, Reverend Clergy, fellow citizens:We observe today not a victory of party but a celebration of freedom--symbolizing an end as well as a beginning--signifying renewal as well as change. For I have sworn before you and Almighty God the same solemn oath our forbears prescribed nearly a century and three-quarters ago. The world is very different now. For man holds in his mortal hands the power to abolish all forms of human poverty and all forms of human life. And yet the same revolutionary beliefs for which our forebears fought are still at issue around the globe--the belief that the rights of man come not from the generosity of the state but from the hand of God.';
    var id = json.id;
    var name =json.name;
    var data = json.posts;
    var analysis = data+' '+essay;

    personality_insights.profile({
            text: analysis,
            language: 'en' },
        function (err, response) {
            if (err)
                console.log('error:', err);
            else
            var full=JSON.stringify(response);
            var first_val = (response.tree.children[2].children[0].percentage);
            var sec_val = (response.tree.children[1].children[0].percentage);
            var thi_val = (response.tree.children[2].children[0].percentage);
            var insert_request = new cps.InsertRequest('<document><id>'+id+'</id>'+cps.Term(name,"User")+cps.Term(data,"Data")+cps.Term(essay,"essay")+cps.Term(first_val,"Openness_parent")+cps.Term(sec_val,"Curiosity_parent")+cps.Term(thi_val,"Conservation_parent")+cps.Term(full,"Complete")+'</document>');
            cpsConn.sendRequest(insert_request, function(err, insert_response) {
                if (err) return console.error(err);
                console.log('New user registered: ');});
            res.statusCode =201;
            res.json({ma:"OKAY"});
        });
};
exports.essay = function (req, res) {
    var cpsConn = new cps.Connection(  'tcp://cloud-us-0.clusterpoint.com:9007',  'user',     'root',    'aaa','document','document/id', {account: 100884});
    var id = req.body.id;
    var new_essay = req.body.name;

    personality_insights.profile({
            text: new_essay,
            language: 'en' },
        function (err, response) {
            if (err)
                console.log('error:', err);
            else
            {
                var full=JSON.stringify(response);
                var first_val = (response.tree.children[2].children[0].percentage);
                var sec_val = (response.tree.children[1].children[0].percentage);
                var thi_val = (response.tree.children[2].children[0].percentage);

                var replace_request = new cps.PartialReplaceRequest([{ id: id, 'essay' : new_essay},{ id: id, 'Openness_parent' : first_val},{ id: id, 'Curiosity_parent' : sec_val},{ id: id, 'Conservation_parent' : thi_val},{ id: id, 'Complete' : full}]);
                cpsConn.sendRequest(replace_request, function (err, replace_resp) {
                    if (err) return console.log(err);
                    res.statusCode = 201;
                    res.json({ma: "OKAY"});
                }, 'json');

            }
        });
};

exports.people = function (req, res) {
    var cpsConn = new cps.Connection(  'tcp://cloud-us-0.clusterpoint.com:9007',  'user',     'root',    'aaa','document','document/id', {account: 100884});
    var search_req = new cps.SearchRequest("*", 0, 10, {"Date": "no"});
    cpsConn.sendRequest(search_req, function (err, search_resp) {
        if (err) return console.log(err);
        //console.log(search_resp.results.document);
        res.statusCode = 201;
        var one = search_resp.results.document[0].id;
        var two = search_resp.results.document[1].id;
        //var three = search_resp.results.document[2].id;
        //var four = search_resp.results.document[3].id;
        //var five = search_resp.results.document[4].id;
        res.json("id:"+one+"id:"+two);

    });



};

exports.compare = function (req, res) {

};

exports.person = function (req, res) {
    var id = req.body.id;
    console.log(id);

    var retrieve_req = new cps.RetrieveRequest(id);
    cpsConn.sendRequest(retrieve_req, function (err, retrieve_resp) {
        if (err) return console.log(err);
        res.statusCode = 201;
        res.json(retrieve_resp.results.document[0].id);
    }, 'json');


};

