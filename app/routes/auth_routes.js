module.exports = function(app, passport){
    //Respond with pages
    app.get('/', function(req,res) {
      res.render('index');
  });

    app.get('/signup', function(req,res) {
        res.render('signup');
    });
    app.get('/signin', function(req,res) {
        res.render('signin');
    });

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
            failureRedirect: '/signup'
        } 
    ));
}
