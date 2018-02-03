let db = require("../models");

module.exports = function (app, passport) {
    app.get('/dashboard', function(req,res,next){
        if (req.isAuthenticated()) return next();
        res.redirect('/signin');
      }, function(req, res){
        // console.log(req.user.username);
        res.render('dashboard');
      });
    app.post('/submit-item', function(req,res,next){
        if (req.isAuthenticated()) return next();
        res.redirect('/signin');
    }, function(req,res){
        // console.log(req.body);
        db.MoneyData.create(
        { 
            price: req.body.amount,
            category: req.body.category,
            comment: req.body.item_comment,
            UserId: req.user.id
        }).then(function(dbMoneyData) {
            res.json(dbMoneyData);
        });
    });
}