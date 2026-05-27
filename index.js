import 'dotenv/config';
import express from "express"
import mysql from 'mysql2'
import SpotifyWebApi from 'spotify-web-api-node'
import bcrypt from 'bcryptjs';
import session from 'express-session';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import axios from 'axios';

const app = express();
const pool = dbConnection();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());

//to parse Form data sent using POST method
app.use(express.urlencoded({ extended: true }));

var authenticated = false;
var user;


//spotify api credentials 
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function getAccessToken() {
  const data = await spotifyApi.clientCredentialsGrant();
  const accessToken = data.body['access_token'];
  spotifyApi.setAccessToken(accessToken);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function insertSort(sortedArray, release) {
  if(sortedArray.length == 0) {
    sortedArray.push({
      id: release.id,
      title: release.name,
      artist: release.artists.map((artist) => artist.name).join(', '),
      image: release.images[0].url,
      type: release.album_type,
      releaseDate: release.release_date,
      externalURLS: release.external_urls.spotify,
      preview: release.preview_url,
    });
  } else {
    let index = sortedArray.length-1;
    while(index >= 0 && release.release_date > sortedArray[index].releaseDate) {
      index--;
    }
    sortedArray.splice(index+1, 0, {
      id: release.id,
      title: release.name,
      artist: release.artists.map((artist) => artist.name).join(', '),
      image: release.images[0].url,
      type: release.album_type,
      releaseDate: release.release_date,
      externalURLS: release.external_urls.spotify,
      preview: release.preview_url,
    });
  }
}

// Login page route
app.get('/login', (req, res) => {
  const error = req.query.error;
  if (error) {
    res.render('login', { "error": error });
  } else {
    res.render('login');
  }
});

app.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let passwordHash = "";

  let sql = `SELECT *
   FROM  users 
   WHERE userName = ? `;

  let params = [username];
  let record = await executeSQL(sql, params);

  if (record.length > 0) { // found username

    passwordHash = record[0].password;
    const match = await bcrypt.compare(password, passwordHash);
    if (match) {
      req.session.authenticated = true;
      user = record[0];
      res.redirect('/home');
    }
    else {
      let error = 'passwordError';
      res.redirect('/login?error=' + error);
    }
  } else {
    let error = 'usernameError';
    res.redirect('/login?error=' + error);
  }
});

app.get('/logout', (req, res) => {
  user = null;
  req.session.destroy();
  res.redirect('/login');
});

// SignUp page route
app.get('/signUp', (req, res) => {
  res.render('signup');
});

app.post('/addUser', async (req, res) => {
  let username = req.body.userName;
  let password = req.body.password;
  let email = req.body.email;
  const hash = bcrypt.hashSync(password, 10);

  let sql = `SELECT *
             FROM users
             WHERE userName = ?`;

  let rows = await executeSQL(sql, [username]);
  if(rows.length == 0)
  {
    if(password != req.body.confirmed)
    {
      res.render('signup', {"error": "passwordMismatch"});
    }
    else
    {
      sql = 'INSERT INTO users (userName, password, email) VALUES (?, ?, ?)';
    
      let params = [username, hash, email];
    
      rows = await executeSQL(sql, params);
    
      res.redirect('/login');
    }
  }
  else 
  {
    res.render('signup', {"error": "usernameTakenError"});
  }
});

app.get('/profile', userVerified, (req, res) => {
  res.render('profile');
});

app.get('/changePassword', userVerified, (req, res) => {
  res.render('changePassword');
});

app.post('/changePassword', userVerified, async (req, res) => {
  let currentPassword = req.body.currentPassword;
  let newPassword = req.body.newPassword;

  const match = await bcrypt.compare(currentPassword, user.password);
  if (match) {
    const hash = bcrypt.hashSync(newPassword, 10);

    let sql = `UPDATE users
               SET password = ?
               WHERE userName = ?`;

    let record = await executeSQL(sql, [hash, user.userName]);
    user = record;
    res.redirect('/login');
  } else {
    res.render('changePassword', {"error": "passwordError"});
  }
});

app.get('/changeUsername', userVerified, (req, res) => {
  res.render('changeUsername');
});

app.post('/changeUsername', userVerified, async (req, res) => {
  let currentUsername = req.body.currentUsername
  let newUsername = req.body.newUsername;

  if(currentUsername == user.userName)
  {
    // Check if username is empty
  
    let sql = `SELECT username
               FROM users
               WHERE username = ?`;
    let records = await executeSQL(sql, [newUsername]);
  
    // User name not taked
    if(records.length == 0) {
      sql = `UPDATE users
         SET username = ?
         WHERE username = ?`;
  
      let result = await executeSQL(sql, [newUsername, currentUsername]);
      user = records;
      
      res.redirect('/login');
  
    }
    // User name taken
    else {
      res.render('changeUsername', {"error": "usernameTakenError"});
    }
  }
  else
  {
    res.render('changeUsername', {"error": "usernameError"});
  }
});

app.get('/changeEmail', userVerified, (req, res) => {
  res.render('changeEmail');
});

app.post('/changeEmail', userVerified, async (req, res) => {
  let currentEmail = req.body.currentEmail;
  let newEmail = req.body.newEmail;

  // Check if email is not empty
  if(user.email == currentEmail)
  {
    let sql = `UPDATE users
               SET email = ?
               WHERE userName = ?`;
  
    let records = await executeSQL(sql, [newEmail, user.userName]);
    user = records;
    res.redirect('/login');
  }
  else
  {
    res.render('changeEmail', {"error": "emailError"});
  }
  
});

// Delete song from the playlist
app.post("/deleteSongs", userVerified, async (req, res) => {
  let songIds = req.body.songIds;
  
  try {
    // Perform the deletion of the song from the playlist database
    songIds.forEach(async (song) => {
      let deleteSql = `DELETE FROM playList
                       WHERE songId = "${song}"`;
      await executeSQL(deleteSql);
    });
    res.sendStatus(204); // Sending a 204 No Content response indicates successful deletion
  } catch (error) {
    console.error(`Error occurred while deleting song with ID ${songId}:`, error);
    res.sendStatus(500); // Sending a 500 Internal Server Error response if deletion fails
  }
});

// Render the community playlist page
app.get('/communityPlaylist', userVerified, async (req, res) =>  {
  let sql = `SELECT *
             FROM playList  p
             NATURAL JOIN artists a`;
  let songs = await executeSQL(sql);
  res.render('communityPlaylist', {"songs": songs});
});


app.get("/api/:search/:query", async function(req, res){
  let searchMethod = req.params.search;
  let query = "%" + req.params.query + "%";

  if(searchMethod == "Artist") {
    let sql = `SELECT *
               FROM playlist p
               NATURAL JOIN artists a
               WHERE LOWER(name) LIKE LOWER(?)
               ORDER BY name`;
    let songsFromArtist = await executeSQL(sql, [query]);

    res.send(songsFromArtist);
  } else if (searchMethod == "Song Title") {
    let sql = `SELECT *
               FROM playlist p
               NATURAL JOIN artists a
               WHERE LOWER(title) LIKE LOWER(?)
               ORDER BY title`;
    let songsFromArtist = await executeSQL(sql, [query]);

    res.send(songsFromArtist);
  }

});

async function fetchNewReleases() {
  // Retrieve access token
  await getAccessToken();

  // Make a request to get the top songs
  const options = {
    limit: 50, // Number of releases to retrieve
  };

  const response = await spotifyApi.getNewReleases(options); // Replace with your playlist ID
  
  // Create seperate arrays that will store the different types of releases
  const newReleases = {
    singles: [],
    albums: [],
    compilations: []
  }


  // Extract the relevant data from the response
  response.body.albums.items.map((release) => {
    if (release.album_type == "single") {
      insertSort(newReleases.singles, release);
    } else if (release.album_type == "album") {
      insertSort(newReleases.albums, release);
    } else if ( release.album_type == "compilation") {
      insertSort(newReleases.compilations, release);
    }
  });
  
  return newReleases;
}


// Function to fetch song recommendations
async function fetchSongRecommendations(songId) {
  const data = await spotifyApi.clientCredentialsGrant();
  const accessToken = data.body['access_token'];

  const response = await axios.get(`https://api.spotify.com/v1/recommendations?seed_tracks=${songId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return response.data;
}


// Home page route
app.get('/home', userVerified, async (req, res) => {
  const newReleases = await fetchNewReleases();
  res.render('home', { newReleases, formatDate });
});

// Route for handling the search request
app.get('/search', (req, res) => {
  const query = req.query.query;

  // Retrieve an access token
  spotifyApi.clientCredentialsGrant()
    .then((data) => {
      const accessToken = data.body.access_token;

      // Set the access token on the Spotify API client
      spotifyApi.setAccessToken(accessToken);

      // Use the Spotify API to search for songs by title
      return spotifyApi.searchTracks(query);
    })
    .then((data) => {
      const songs = data.body.tracks.items.map((item) => ({
        title: item.name,
        artist: item.artists[0].name,
        image: item.album.images[0].url,
        id: item.id,
      }));
      res.render('search', { songs, query});
    })
    .catch((error) => {
      console.log('Error:', error);
      res.render('search', { songs: [] });
    });
});


app.get('/suggestions/:songId', async (req, res) => {
  try {
    const songId = req.params.songId;

    // Retrieve an access token using client credentials flow
    const { body } = await spotifyApi.clientCredentialsGrant();
    const accessToken = body.access_token;

    // Set the access token on the Spotify API client
    spotifyApi.setAccessToken(accessToken);

    // Fetch song recommendations based on the provided songId
    const recommendations = await fetchSongRecommendations(songId);

    // Process the recommendations and render the suggestions page
    const songs = recommendations.tracks.map((item) => ({
      title: item.name,
      artist: item.artists[0].name,
      image: item.album.images[0].url,
      id: item.id,
    }));

    res.render('suggestions', { songs });
  } catch (error) {
    console.log('Error retrieving suggestions:', error);
    res.status(500).send('Internal Server Error');
  }
});


//artist top 10 tracks
app.get('/artistHits', (req, res) => {
  const artistName = req.query.query;
  spotifyApi.clientCredentialsGrant().then((data) => {
    spotifyApi.setAccessToken(data.body.access_token);
    return spotifyApi.searchArtists(artistName);
  })
    .then(data => {
      const artist = data.body.artists.items[0];
      return spotifyApi.getArtistTopTracks(artist.id, 'US');
    })
    .then(data => {
      const topTracks = data.body.tracks;
      res.render('artistHits', { artistName, topTracks });
    })
    .catch(error => {
      console.error(error);
      res.send('An error occurred');
    });
});

app.post('/addToPlaylist', userVerified, async (req, res) => {

  let trackId = req.body.trackId;
  var songId;
  spotifyApi.clientCredentialsGrant()
    .then((data) => {
      const accessToken = data.body.access_token;

      // Set the access token on the Spotify API client
      spotifyApi.setAccessToken(accessToken);

      // Use the Spotify API to search for songs by title
      return spotifyApi.getTrack(trackId);
    })
    .then(async (data) => {
      const song = data.body;

      songId = song.id;
      let title = song.name;
      let preview = song.preview_url;
      let artistId = data.body.artists[0].id
      let albumImage = data.body.album.images[0].url;

      let sql = `SELECT *
                 FROM playlist
                 WHERE songId = ?`;
      let record = await executeSQL(sql, [songId]);
      
      if(record == 0) {
        sql = `INSERT INTO playlist
               (songId, title, preview, albumImage)
               VALUES
               (?, ?, ?, ?)`;
        record = await executeSQL(sql, [songId, title, preview, albumImage])

        // res.send("<script>alert('Song has been added');</script>");
      }
      return spotifyApi.getArtist(artistId);
    })
    .then(async (data) => {
	    const artistInfo = data.body;
      
      let name = artistInfo.name;
      let genre = artistInfo.genres[0];
      let image = artistInfo.images[0].url;
      let popularity = artistInfo.popularity;

      let sql = `SELECT *
                 FROM artists
                 WHERE name = ?`;

      let record = await executeSQL(sql, [name]);

      if(record.length == 0) {
        sql = `INSERT INTO artists
               (name, genre, image, popularity)
               VALUES
               (?, ?, ?, ?)`

        record = await executeSQL(sql, [name, genre, image, popularity]);
      }

      sql = `SELECT artistId
             FROM artists
             WHERE name = ?`

      
      let id = await executeSQL(sql, [name]);
      sql = `UPDATE playlist
             SET
             artistId = ?
             WHERE songId = ?`;

      record = await executeSQL(sql, [id[0].artistId, songId]);

      // res.send("<script>alert('Song has been added');</script>");
      res.set('referer', req.headers.referer);
      res.redirect(req.headers.referer);
    })
    .catch((error) => {
      console.log('Error:', error);
    });
});

function userVerified(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.render('login')
  }
}

async function executeSQL(sql, params) {
  return new Promise(function(resolve, reject) {
    pool.query(sql, params, function(err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });
}

function dbConnection() {

  const pool = mysql.createPool({

    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE

  });

  return pool;

} //dbConnection

//start server
app.listen(process.env.PORT, () => {
    console.log("Expresss server running on port %d: http://localhost:8080/login", process.env.PORT)
})