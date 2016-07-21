var router = require('express').Router();
var path = require('path');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var pg = require('pg');

var config = {
  database: 'patronus_assigner',
  port: 5432
};

router.get('/patronuses', function(request, response){
  var client = new pg.Client(config);
  client.connect(function(err){
    if(err){
      console.log('Connection error', err);
    }
    client.query('SELECT * FROM patronus;', function(err, result){
      var peopleList = {};
      peopleList = result.rows;
      if(err){
        // console.log('Query error', err);
        response.sendStatus(500);
      } else {
        // console.log('Great success', peopleList);
        response.send(peopleList);
      }

      client.end(function(err){
        if(err){
          console.log('Disconnect error', err);
        }
      });
    });
  });
});

router.post('/patronuses', jsonParser, function(request, response){
  var client = new pg.Client(config);
  var patronus = request.body.patronus;
  client.connect(function(err){
    if(err){
      console.log('Connection error', err);
    }
    client.query('INSERT INTO patronus (patronus_name) VALUES ($1)', [patronus], function(err, rows){
      if(err){
        response.sendStatus(500);
      } else {
        response.sendStatus(200);
      }
      client.end(function(err){
        if(err){
          console.log('Disconnect error', err);
        }
      })
    })
  })
});
module.exports = router;
