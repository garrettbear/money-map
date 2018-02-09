let db = require("../models");

module.exports = function (app, passport) {
    app.get('/api/userdata', function(req,res,next){
        if (req.isAuthenticated()) return next();
        res.redirect('/signin');
    },function(req,res){
        db.MoneyData.findAll({
            where:{
                UserId: req.user.id
            }
        })
        .then(function(data) {
            res.json(data);
        });
    });
    app.post('/submit-item', function(req,res,next){
        if (req.isAuthenticated()) return next();
        res.redirect('/#login-tab');
    }, function(req,res){
        console.log(req);
        db.MoneyData.create(
        { 
            price: req.body.amount,
            category: req.body.category,
            comment: req.body.item_comment,
            UserId: req.user.id
        }).then(function() {
            res.redirect('/dashboard');
        });
    });
    app.put('/api/edit-item', function(req,res,next){
        if (req.isAuthenticated()) return next();
        res.redirect('/#login-tab');
    },function(req,res){
        console.log(req.body);
        db.MoneyData.update(
            req.body,
            {
                where: {input_id: req.body.input_id}
            }
        ).then(function() {
            res.redirect('/dashboard');
        });
    });
}