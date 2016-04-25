var express = require('express');
var router = express.Router();
var request = require('request');
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/electricOrNot'; // Mongodb path
var db;

// connect to the mongo database
mongoClient.connect(mongoUrl, function(error, database) {
  db = database;
});



/* GET home page. */
router.get('/', function(req, res, next) {
  // var cars = db.collection('cars').insert({
  //   "name": "buick"
  // });

  db.collection('cars').find({}).toArray(function(error, carResult) {

    // for (var i = 0; i < carResult.length; i++) {
    //   console.log(carResult[i].imageSrc);
    // }
    var getRandomImage = Math.floor(Math.random() * carResult.length);
    res.render('index', {
      carImage: carResult[getRandomImage]
    });
  });

  //res.console.log(db.collection('cars').find());

  // res.render('index', {
  //   title: 'Express'
  // });
});

module.exports = router;
