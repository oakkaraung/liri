require("dotenv").config();

var keys = require("./keys.js");

var fs = require("fs")
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var dotenv = require("dotenv");

var input = "";
for (var i = 3; i < process.argv.length; i++) {
    input += process.argv[i];
    input += " ";
}
input = input.trim();
console.log(input);



if (process.argv[2] == "concert-this") {
    concert(input);
}

else if (process.argv[2] == "spotify-this-song") {
    if (input == "") {
        spotifySong("The Sign")
    }
    else {
        spotifySong(input);
    }
}

else if (process.argv[2] == "movie-this") {
    if (input == "") {
        movieThis("Mr. Nobody")
    }
    else {
        movieThis(input);
    }
}

else if (process.argv[2] == "do-what-it-says") {
    doWhat();
}

function concert(userInput) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function (response) {
            // console.log(response.data)
            for (var i = 0; i < response.data.length; i++) {
                console.log("\nVenue Name: " + response.data[i].venue.name);
                console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                console.log(moment(response.data[i].datatime).format("MM/DD/YYYY"));
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

function spotifySong(userInput) {
    var spotify = new Spotify(keys.spotify);

    spotify
        .search({ type: 'track', query: userInput })
        .then(function (response) {
            console.log("\nArtists:\n")
            for (var i = 0; i < response.tracks.items[0].artists.length; i++) {
                console.log(response.tracks.items[0].artists[i].name)
            }
            console.log("\nName: " + response.tracks.items[0].name);
            console.log("\nLink: " + response.tracks.items[0].external_urls.spotify);
            console.log("\nAlbum: " + response.tracks.items[0].album.name);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movieThis(userInput) {
    var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function (response) {
            console.log("\nTitle: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes: " + response.data.Ratings[2].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

function doWhat() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
      
        // We will then re-display the content as an array for later use.
        if (dataArr[0] == "concert-this") {
            concert(dataArr[1]);
        }
        
        else if (dataArr[0] == "spotify-this-song") {
            if (dataArr[1] == "") {
                spotifySong("The Sign")
            }
            else {
                spotifySong(dataArr[1]);
            }
        }
        
        else if (dataArr[0] == "movie-this") {
            if (dataArr[1] == "") {
                movieThis("Mr. Nobody")
            }
            else {
                movieThis(dataArr[1]);
            }
        }

      
      });
}