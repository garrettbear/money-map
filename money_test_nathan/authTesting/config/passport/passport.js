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
                            password: bCrypt.hashSync(password, bCrypt.genSaltSync(8), null) //Hashes the password using bCrypt.                     
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
}