var _ = require('underscore');
var moment = require('moment');
var mongoose = require('mongoose');
var Reading = mongoose.model('Reading');

moment.locale('pt');

exports.list = function(req,res) {
  Reading.find({}).limit(50).sort({'collectedAt': -1}).lean().exec(function(err, readings){
    var measures = ['U','TH','P','L','PH','ORP'];

    readings = _.map(readings, function(r){
      r.collectedAt = moment(r.collectedAt).fromNow();
      return r;
    });

    res.render('readings/index', {
      measures: measures,
      readings: readings
    });
  })
}
