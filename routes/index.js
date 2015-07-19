var cps = require('cps-api');
var watson = require('watson-developer-cloud');

var personality_insights = watson.personality_insights({
    username: '8d119473-86a5-4cc4-8da8-e483a88f0397',
    password: 'gV6O9XgYRqXQ',
    version: 'v2'
});


exports.index = function (req, res) {

    var cpsConn = new cps.Connection(  'tcp://cloud-us-0.clusterpoint.com:9007',  'user',     'root',    'aaa','document','document/id', {account: 100884});

    //Data
    var FB = '{"id":"dsd7944472d87wew1252","name":"Kirill Mangutov","posts":["California is pretty cool","Jello"]}';
    var json = JSON.parse(FB);
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
            var first_val = (response.tree.children[2].children[0].percentage);
            var sec_val = (response.tree.children[1].children[0].percentage);
            var thi_val = (response.tree.children[2].children[0].percentage);
            var insert_request = new cps.InsertRequest('<document><id>'+id+'</id>'+cps.Term(name,"User")+cps.Term(data,"Data")+cps.Term(essay,"essay")+cps.Term(first_val,"Openness_parent")+cps.Term(sec_val,"Curiosity_parent")+cps.Term(thi_val,"Conservation_parent")+'</document>');
            cpsConn.sendRequest(insert_request, function(err, insert_response) {
                if (err) return console.error(err);
                console.log('New user registered: ');});

            res.render('index');
        });
};

