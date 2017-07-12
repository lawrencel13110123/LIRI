var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var command = process.argv[2];
var songTitle; 


function twitterThis () {

	var client = new Twitter(keys.twitterKeys);

	var params = { screen_name: "CNN" };
	client.get("statuses/user_timeline", params, function(error, tweets, response) {
		if(!error && response.statusCode === 200) {
			for (var i = 0 ; i < 20 ; i++) {
				console.log("Most Recent Tweets" + " No." + parseInt(i+1) + ":" + "\r\n" + tweets[i].text + "\r\n"); 
				if (i === 0) {
					fs.appendFile("log.txt", "===Entry Start===\r\n" + tweets[i].text, function(err) {
						if (err) throw err ; 

					}); 
				} else if (i === 19) {
					fs.appendFile("log.txt", tweets[i].text + "\r\n===Entry End===\r\n", function(err) {
						if (err) throw err ; 

					}); 
				} 
				else {
					fs.appendFile("log.txt", tweets[i].text, function(err) {
						if (err) throw err ; 
					}); 
				};
			}; 
		}; 

	}); 

}; 


function spotifyThis (songTitle) {
	var spotify = new Spotify(keys.spotifyKeys);
	var nodeArgs = process.argv; 
	songTitle; 
	if (songTitle === undefined) {
		songtitle = "The Sign"
	};

	for (var i = 3 ; i < nodeArgs.length; i++) {
		if (i > 3 && i < nodeArgs.length) {
			songTitle += "+" + nodeArgs[i]; 
		}
		else {
			songTitle += nodeArgs[i]; 
		}
	}; 

	spotify.search({ type: "track", query: songTitle}, function(err, data) {
  		if (err) {
    		return console.log("Error occurred: " + err);
  		}
 		
 		//each item is essentially a song returned from the search query 
		var songs = data.tracks.items
		//this console.log list out all the keys of the first song to give a cleaner view of what to access in the songs object
		// console.log(Object.keys(songs[0]))
		for (var i = 0 ; i < songs.length ; i++) {
			console.log("Name: " + songs[i].name); 
			console.log("Album: " + songs[i].album.name); 
			console.log("Artists: " + songs[i].artists[0].name); 
			console.log("Preview: " + songs[i].preview_url); 
			console.log("=========="); 
			if (i === 0) {
				fs.appendFile("log.txt", "===Entry Start===\r\n" + " Name: " + songs[i].name + " Album: " + songs[i].album.name + " Artists: " + songs[i].artists[0].name + " Preview: " + songs[i].preview_url, function(err) {
					if (err) throw err ; 
				});
			} else if (i === (songs.length - 1)) {
				fs.appendFile("log.txt", " Name: " + songs[i].name + " Album: " + songs[i].album.name + " Artists: " + songs[i].artists[0].name + " Preview: " + songs[i].preview_url + "\r\n===Entry End===\r\n", function(err) {
					if (err) throw err ; 
				});
			}
			else {
				fs.appendFile("log.txt", " Name: " + songs[i].name + " Album: " + songs[i].album.name + " Artists: " + songs[i].artists[0].name + " Preview: " + songs[i].preview_url, function(err) {
					if (err) throw err ; 
				});
			};

		};		

	});
};


function movieThis () {
	var nodeArgs = process.argv; 
	var movieName = ""; 
	if (movieName === undefined) {
		movieName = "Mr. Nobody"
	};
 
	for (var i = 3 ; i < nodeArgs.length; i++) {
		if (i > 3 && i < nodeArgs.length) {
			movieName += "+" + nodeArgs[i]; 
		}
		else {
			movieName += nodeArgs[i]; 
		}
	};


	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var json = JSON.parse(body)
			console.log("Title: " + json.Title);
			console.log("Year: " + json.Year);
			console.log("IMBD Rating: " + json.imdbRating);
			var rottenTomatoes; 
			if (json.Ratings[1] === undefined) {
				rottenTomatoes = "N/A"
				console.log("Rotten Tomatoes Rating: N/A");
			} 
			else {
				rottenTomatoes = json.Ratings[1].Value
				console.log("Rotten Tomatoes Rating: " + json.Ratings[1].Value);
			}
			console.log("Country: " + json.Country)
			console.log("Language: " + json.Language)
			console.log("Actors: " + json.Actors)
			console.log("Plot: " + json.Plot)
			fs.appendFile("log.txt", "===Entry Start===\r\n" + " Title: " + json.Title + " Year: " + json.Year + " IMBD Rating: " + json.imdbRating + " Rotten Tomatoes Rating: " + rottenTomatoes + " Country: " + json.Country + " Language: " + json.Language + " Actors: " + json.Actors + " Plot: " + json.Plot + "\r\n===Entry End===\r\n", function(err) {
					if (err) throw err ; 
			});
		};
	}); 

};

function randomThis () {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			console.log("error");
		}
		else {
			var dataArr = data.split(",")
			console.log(dataArr[1])
			spotifyThis(songTitle)
		};
	});

};

randomThis()

switch(command) {
	case "my-tweets": 
	twitterThis(); 
	break; 

	case "spotify-this-song": 
	spotifyThis(); 
	break; 

	case "movie-this": 
	movieThis(); 
	break; 

	case "do-what-it-says": 
	randomThis(); 
	break; 

}; 



