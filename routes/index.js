var express = require('express');
var router = express.Router();
var request = require('request');
var mongo = require('mongodb');
var http = require('http');
var fs = require('fs');
// var Page = require('../public/js/slitslider/slider_module.js');
var mongoClient = mongo.MongoClient;
var mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/electricOrNot'; // Mongodb path
var db;
var allPhotos;
var _holdPrevCar = [];

// connect to the mongo database
mongoClient.connect(mongoUrl, function(error, database) {
  database.collection('cars').find().toArray(function(error, result) {
    allPhotos = result;
    db = database;
    //console.log(allPhotos);
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
  // db.collection('users').insertOne({
  //   ip: "test",
  //   name: "testname",
  //   val: 1
  // });

  fs.readdir("./public/images/", function(err, files) {
    if (err) {
      res.console.log("[ERROR] : " + err);
    }

    files.forEach(function(file) {
      if (file.includes('.jpg') || file.includes('.png')) {
        db.collection('cars').insertOne({
          imageSrc: file
        }, function(err, result) {
          console.log(err);
        });
      }

    });

    setTimeout(getCars(), 4000);

  });

  function getCars() {
    db.collection('cars').find({}).toArray(function(error, carResult) {
      var _val;
      //var _ranNum = Math.floor(Math.random() * 2);
      var getRandomImage = Math.floor(Math.random() * carResult.length);
      _holdPrevCar.push(getRandomImage);
      if (_holdPrevCar.length > 2) {
        _holdPrevCar.shift(); // Clear out previous car
      }

      _val = (_holdPrevCar.length !== 0) ? _holdPrevCar[0] : 0;
      //res.console.log("current: " + getRandomImage + " | prev: " + _holdPrevCar[0]);
      res.render('index', {
        carImage: carResult[getRandomImage],
        prevCar: carResult[_val]
      });
    });
  }

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
  db.collection('users').insertOne({
    ip: req.ip,
    vote: 'electric',
    image: req.body.photo
  }, function(err, result) {
    console.log(err);
  });


  res.redirect('/');
});

router.post('/poser', function(req, res, next) {
  // 1. we know they voted poser, or they wouldn't be here
  // 2. we know what they voted on
  // 3. we know who they are
  // 4. Update the users table to include, user ip and photo they voted on
  // 5. update the images/cars collection by -1
  res.redirect('/');
});

module.exports = router;


// function getRandomObj(_state) {
//   var dataOptions = {};
//
//   _state = (_state === !_state) ? true : false;
//   console.log(_state);
//
//   if (_state) {
//     dataOptions = {
//       slideNum: 1,
//       dataOrientation: 'horizontal',
//       dataSlice1Rotation: -25,
//       dataSlice2Rotation: -25,
//       dataSlice1Scale: 2,
//       dataSlice2Scale: 2
//     }
//   } else {
//     dataOptions = {
//       slideNum: 1,
//       dataOrientation: 'vertical',
//       dataSlice1Rotation: 10,
//       dataSlice2Rotation: -15,
//       dataSlice1Scale: 1.5,
//       dataSlice2Scale: 1.5
//     }
//   }
//   return dataOptions;
// }
