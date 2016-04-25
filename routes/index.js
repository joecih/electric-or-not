var express = require('express');
var router = express.Router();
var request = require('request');
var mongo = require('mongodb');
var http = require('http');
var mongoClient = mongo.MongoClient;
var mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/electricOrNot'; // Mongodb path
var db;
var allPhotos;

// connect to the mongo database
mongoClient.connect(mongoUrl, function(error, database) {
  database.collection('cars').find().toArray(function(error, result) {
    allPhotos = result;
    db = database;
    console.log(allPhotos);
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  // 1. Get all pictures from mongo
  // 2. Get the current user from mongo
  // 3. Find out which pictures the current user has not voted on
  // 4. Load all those documents into an array
  // 5. pic a random one
  // 6. Send the random one to the viewport
  // 6.b. If the user has voted on every image in the database, notify them.


  var currIP = req.ip;
  console.log("Current user ip: " + currIP);
  db.collection('cars').find({}).toArray(function(error, carResult) {

    var getRandomImage = Math.floor(Math.random() * carResult.length);
    res.render('index', {
      carImage: carResult[getRandomImage]
    });
  });

});

// router.get('/electric', function(req, res, next) {
//   res.render('index', {
//     title: 'Express'
//   });
// });

/* Setup the POST electric page */
router.post('/electric', function(req, res, next) {
  // 1. we know they voted electric, or they wouldn't be here
  // 2. we know what they voted on
  // 3. we know who they are
  // 4. Update the users table to include, user ip and photo they voted on
  // 5. update the images/cars collection by 1
  // 6. Send them back to the main page, so they can vote again
  res.send(req.body);
});

router.post('/poser', function(req, res, next) {
  // 1. we know they voted poser, or they wouldn't be here
  // 2. we know what they voted on
  // 3. we know who they are
  // 4. Update the users table to include, user ip and photo they voted on
  // 5. update the images/cars collection by -1
  res.send("The User chose " + req.body.photo + " as a poser picture!");
});

module.exports = router;
