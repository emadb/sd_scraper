var request = require('request');
var fs = require('fs');
var http = require('http');
var async = require('async');

var file = 1;
var baseUrl = 'http://simpledesktops.com/browse/';
var pagesToScrap = 47

async.times(pagesToScrap, function(page, next){
  request(baseUrl + page, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var m, rex = /<img[^>]+src="?([^"\s]+)"/g;
      while ( m = rex.exec( body ) ) {
          var url = m[1].replace('.295x184_q100.png', '')
          if (url.indexOf('uploads/desktops/') !== -1){
            getImage(url);
          }
      }
    }
  });  
});

function getImage(url){
  var request = http.get(url, function(res){
    var imagedata = ''
    res.setEncoding('binary')

    res.on('data', function(chunk){
        imagedata += chunk
    });

    res.on('end', function(){
        fs.writeFile('imgs/'+ file.toString() + '.png', imagedata, 'binary', function(err){
            console.log(url);
        });
        file++;
    });
  });
}
