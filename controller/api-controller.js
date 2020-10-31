// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const axios = require("axios").default;

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/register", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/index");
  });
  // Route to api call for audiodb
  app.get("/api/music_data/:artist", function(req, res) {
    let artist = req.params.artist;
    const apiKey = process.env.API_KEY;
    let data = null;

    axios.get(`https://theaudiodb.com/api/v1/json/${apiKey}/searchalbum.php?s=${artist}`)
      .then((response) => {
        data = response;
        console.log(response.data.album);
      })
      .catch((error) => {
        console.log(error);
      });
    res.json(data);
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", isAuthenticated, function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.render("/login");
    } else {
      // Otherwise send back the user's email and id
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
};