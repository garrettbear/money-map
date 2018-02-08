const bCrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, user) {
    let User = user;
    //Keep track of user when logged in.
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to stop tracking the user
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
        if(user){
            done(null, user.get());
        }
        else{
            done(user.errors,null);
        }
        });

    });
    passport.use('local-signup', new LocalStrategy(//This part defines the Local Strategy
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            User.findOne({
                where: {username: username}
            }).then(function(user) {
                //Add user to database.
                
                //Checks to make sure doesn't already exist. 
                if (user){            
                    return done(null, false, {
                        message: 'That username is already taken'
                    });
                
                //If the user doesn't exist, add the user to the database.
                }else{
                    //Create the data the will be passed into sequelize.            
                    let data =             
                        {
                            username: username,
                            password: bCrypt.hashSync(password, bCrypt.genSaltSync(8), null),//Hashes the password using bCrypt.   
                            first_name: req.body.fname,
                            last_name: req.body.lname                 
                        };
                    
                    //Pass the data into sequelize. 
                    User.create(data).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));
    passport.use('local-signin', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',   
            passReqToCallback: true // allows us to pass back the entire request to the callback  
        },
        function(req, username, password, done) {
            let User = user; 
            let isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass); 
            }
            User.findOne({
                where: {
                    username: username
                }
            }).then(function(user) {  
                if (!user) {
                    return done(null, false, {
                        message: 'Username does not exist'
                    });
                }
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                let userinfo = user.get();
                console.log(userinfo);
                return done(null, userinfo);
            }).catch(function(err) {
                console.log("Error:", err);
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }
    
    ));
}