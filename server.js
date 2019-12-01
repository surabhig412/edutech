var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mysql = require('./mysql');
var bodyParser = require('body-parser');

app.set("view engine","ejs");
app.use(cookieParser());
app.use(session({secret: "secret"}));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(express.static(path.join(__dirname, 'scripts')));


app.get('/', function (req, res) {
  res.render('index');
})

app.listen(3000, function () {
  console.log('Test app listening on port 3000!');
})

app.post('/company_login', function(req, res) {
  mysql.query("select * from users where type='employee'", function(err, result) {
    if(err) res.send(err);
    if(result[0].username !== req.body.username || result[0].password !== req.body.password) {
      res.redirect('/');
      return;
    }
    req.session.company_login = true;
    res.redirect('/tests');
  });
});

app.post('/company_logout', function(req, res) {
  req.session.company_login = false;
  res.render('');
});

app.post('/user_login', function(req, res) {
  mysql.query("select * from users where type='user'", function(err, result) {
    if(err) res.send(err);
    if(result[0].username !== req.body.username || result[0].password !== req.body.password) {
      res.redirect('/');
      return;
    }
    req.session.user_login = true;
    res.redirect('/tests');
  });
});

app.post('/user_logout', function(req, res) {
  req.session.user_login = false;
  res.render('');
});

app.get('/tests', function(req, res) {
  if(checkEmployeeLoggedIn(req, res)) {
    var tests;
    var s = req.query.status;
    if (s === undefined) {
      s = 'draft,published';
    }
    var status = s.split(',');
    mysql.query("select * from tests where status in (?)", [status], function(err, result) {
      if(err) res.send(err);
      tests = JSON.stringify(result);
      if (tests !== undefined) {
        tests = JSON.parse(tests);
      }
      res.render('tests.ejs', {tests: tests, query: {status: s}});
    });
  } else if (checkUserLoggedIn(req, res)) {
    mysql.query("select * from tests where status='published'", function(err, result) {
      if(err) res.send(err);
      tests = JSON.stringify(result);
      if (tests !== undefined) {
        tests = JSON.parse(tests);
      }
      res.render('user_tests.ejs', {tests: tests});
    });
  } else {
    res.redirect('/');
  }
});

// app.get('/tests/:id', function(req, res) {
//   if(checkUserLoggedIn(req, res)) {
//     let test, questions;
//     mysql.query("select * from tests where id= ?", req.params.id)
//     .then(result => {
//       test = JSON.stringify(result);
//       if (test !== undefined) {
//         test = JSON.parse(test);
//       }
//       return mysql.query("select * from questions where test_id= ?", req.params.id);
//     })
//     .then(result => {
//       questions = JSON.stringify(result);
//       if (questions !== undefined) {
//         questions = JSON.parse(questions);
//       }
//       return mysql.query("select sum(time) as total from questions where test_id= ?", req.params.id);
//     })
//     .then(result => {
//       console.log(test);
//       console.log(questions);
//       res.render('test.ejs', {test: test, questions: questions, time: result[0].total});
//     })
//     .catch( err => {
//         res.send(err);
//     });
//   } else {
//     res.redirect('/');
//   }
// });

app.post('/tests', function(req, res) {
  if(checkEmployeeLoggedIn(req, res)) {
    var test = {name: req.body.name, description: req.body.description, creator: req.body.creator, status: 'draft'}
    mysql.query("insert into tests set ?", test, function(err, result) {
      if(err) res.send(err);
    });
    res.redirect('/tests');
  }
});

app.post('/submit_test', function(req, res) {
  if(checkEmployeeLoggedIn(req, res)) {
    // var test = {name: req.body.name, description: req.body.description, creator: req.body.creator, status: 'draft'}
    // mysql.query("insert into tests set ?", test, function(err, result) {
    //   if(err) res.send(err);
    // });
    // res.redirect('/tests');
  }
});

app.post('/questions', function(req, res) {
  if(checkEmployeeLoggedIn(req, res)) {
    var question = {question_text: req.body.question_text, description: req.body.description, time: req.body.time, answer: req.body.answer, test_id: req.body.test_id}
    mysql.query("insert into questions set ?", question, function(err, result) {
      if(err) res.send(err);
    });
    res.redirect('/tests');
  }
});

app.post('/publish', function(req, res) {
  if(checkEmployeeLoggedIn(req, res)) {
    mysql.query("update tests set status = 'published' where id=? and status='draft'", req.body.test_id, function(err, result) {
      if(err) res.send(err);
    });
    res.render('');
  }
});

var checkEmployeeLoggedIn = function(req, res) {
  if(req.session.company_login === undefined || req.session.company_login === false) {
    return false;
  }
  return true;
}

var checkUserLoggedIn = function(req, res) {
  if(req.session.user_login === undefined || req.session.user_login === false) {
    return false;
  }
  return true;
}

app.post('/user_login', function(req, res) {
  console.log(req.body);
});
