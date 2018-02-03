module.exports = function (app, passport) {
  //Respond with pages
  app.get('/', function (req, res) {
    res.render('index');
  });

  app.get('/signup', function (req, res) {
    res.render('signup');
  });
  app.get('/signin', function (req, res) {
    res.render('signin');
  });
  app.get('/logout', function(req,res){
    req.session.destroy(function(err){
        res.redirect('/');
    });
  });

  
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/#create-account-tab'
  }));
  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/#login-tab'
    }
  ));
}
