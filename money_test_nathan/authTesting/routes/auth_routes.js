module.exports = function(app){
    //Respond with pages
    app.get('/signup', function(req,res) {
        res.render('signup');
    });
    app.get('/signin', function(req,res) {
        res.render('signin');
    });
}