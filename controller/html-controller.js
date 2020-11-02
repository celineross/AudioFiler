// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
const axios = require("axios");

module.exports = function (app) {
  // route to index
  app.get("/", function (req, res) {
    if (req.user) {
      return res.redirect("/members");
    }
    res.render("index");
  });

  // route for registering a new user
  app.get("/register", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/members");
    }
    res.render("register");
  });

  //server-side rendering of album objects onto the page
  app.get("/members", isAuthenticated, async function (req, res) {
    let artist = req.query.search;
    const apiKey = process.env.API_KEY;

    try {
      if (!artist) {
        return res.render("collection");
      }

      const response = await axios.get(`https://theaudiodb.com/api/v1/json/${apiKey}/searchalbum.php?s=${artist}`);
      // console.log(response.data.album);

      const albums = response.data.album.map(x => ({
        albumName: x.strAlbum,
        artist: x.strArtist,
        albumArt: x.strAlbumThumb,
        releaseYear: x.intYearReleased,
        genre: x.strGenre
      }));
      //needs to be changed to render on search page instead of collections page
      //slice to narrow down number of returned objects from search, set to return 2 albums now
      res.render("collection", { albums: albums });
    } catch (error) {
      // console.log(error);
      res.sendStatus(500);
    }
  });
  // route to add an album
  app.get("/add/album", isAuthenticated,async function (req, res) {
    console.log(req);
    try {
      let album = {
        albumName: "Break the Cycle",
        artist: "staind",
        albumArt: "https://www.theaudiodb.com/images/media/album/thumb/break-the-cycle-4e80638b960ae.jpg",
        releaseYear: 2001,
        genre: "alt rock"
      };
      console.log(album);
      //needs to be changed to render on search page instead of collections page
      //slice to narrow down number of returned objects from search, set to return 2 albums now
      res.render("search", album);

    } catch (error) {
      // console.log(error);
      res.sendStatus(500);
    }
  });

};