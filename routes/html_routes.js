module.exports = function (app, passport) {
    app.get('/dashboard', function(req,res,next){
        if (req.isAuthenticated()) return next();
        res.redirect('/#login-tab');
      }, function(req, res){
        // console.log(req.user.username);
        res.render('dashboard');
    });
}