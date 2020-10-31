let artist = {
  artist: "DMX",
  album: "Hotter than Hell",
  tracks: 12
};

let theData = JSON.stringify(artist);

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  // route to index
  app.get("/", function(req, res) {
    res.render("index");
  });
  // route for registering a new user
  app.get("/register", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("register");
  });
  // login route
  app.get("/login", function(req, res) {
    // If the user is already logged in send them back to members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("login");
  });

  // If a user who is not logged in tries to access this route they will be redirected to the login page
  app.get("/members", isAuthenticated, function(req, res) {
    res.render("collection", theData);
  });

};
