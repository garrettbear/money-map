//Dependencies
// =============================================================
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");

//Model
let db = require("./models");

//Setup app
// =============================================================
let app = express();
let PORT = process.env.PORT || 8080;

//Setup body parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Setup handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public")); //Gives handlebars access to the public folder.

//Setup Passport
// =============================================================
app.use(session({ secret: 'the login creation is nigh',resave: true, saveUninitialized:true})); // session secret 
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//Passport Strategy
require('./config/passport/passport.js')(passport, db.User);

// Routes
// =============================================================
require("./routes/auth_routes.js")(app,passport);
require("./routes/api_routes.js")(app,passport);


// Start App
// =============================================================
db.sequelize.sync().then(function(){
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});
