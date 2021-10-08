var Crawler = require("crawler");
const ds = require('./ds.js');
var vcount = 0;
var vtotal = ds.lista.length;
var errorLog =[];
var c = new Crawler({
    maxConnections: 20,
    //encoding: null,
    method: 'GET',
    headers: {
        'Host': 'api.bcb.gov.br',
        'User-Agent': 'PostmanRuntime/7.28.4'
    },
    jQuery: false,

    // This will be called for each crawled page
    callback: function (error, res, done) {
        vcount++;
        console.log(vcount + "/" + vtotal );
        if (error) {
            console.log("(erro)" + vcount + " - " + res.statusCode + " - " + res.request.href);
            errorLog.push(res.request.href);
        } else {
            if (!isJson(res.body)) {
                console.log("(erro)" + vcount + " - " + res.statusCode + " - " + res.request.href);
                errorLog.push(res.request.href);
            } else {
                if (res.statusCode > 299) {
                    console.log("(erro code)" + vcount + " - " + res.statusCode + " - " + res.request.href);
                    errorLog.push(res.request.href);
                }
            }
            //a lean implementation of core jQuery designed specifically for the server
            //console.log($("title").text());
        }
        done();
    }
});
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
// Queue just one URL, with default callback
//c.queue('https://api.bcb.gov.br/dados/serie/bcdata.sgs.20737/dados?formato=json');

// Queue a list of URLs
c.queue(ds.lista);
var tentativas = 15;
c.on('drain',function(){

    console.log("----------(" + tentativas + ")----------");
    console.log(errorLog);
    if (tentativas > 0 ) {
        tentativas --;
        var x = errorLog;
        errorLog = [];
        vtotal = x.length;
        vcount = 0;
        this.queue(x);
    }
});

// Queue URLs with custom callbacks & parameters
// c.queue([{
//     uri: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.20737/dados?formato=json',
//     jQuery: false,

//     // The global callback won't be called
//     callback: function (error, res, done) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Grabbed', res.body.length, 'bytes');
//         }
//         done();
//     }
// }]);

