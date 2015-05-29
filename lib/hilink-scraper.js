var _ = require('underscore');
var async = require('async');
var hilink = require('hilink');
var mongoose = require('mongoose');

function scrape(doneScrape) {
  var Reading = mongoose.model('Reading');
  hilink.listInbox(function( response ){
    var messages = response.response['Messages'][0]['Message'];

    if (!messages) return doneScrape();

    async.eachSeries(messages, function(message, doneEach){

      var content = message['Content'][0].split(';');
      var collectedAt = content.shift();

      var data = {};
      _.each(content, function(c){
        c = c.split('=');
        var param = c[0].split(':');
        var value = c[1];
        var unit = (param.length > 1) ? param[1] : null;
        param = param[0];

        data[param] = {
          param: param,
          unit: unit,
          value: value
        };
      })

      var reading = new Reading({
        sensor: message.Phone,
        collectedAt: collectedAt,
        data: data
      })

      reading.save(function(err){
        if (err) return doneEach(err)
        hilink.delete(message.Index[0], doneEach);
      });
    }, doneScrape);
      // console.log( JSON.stringify( response, null, 2 ) );
  });
}

exports.init = function() {

  function initRepeat() {
    scrape(function(err){
      if (err) console.error(err);
      console.log('scraped');
    });
    setTimeout(initRepeat,5000);
  }
  initRepeat();
}
