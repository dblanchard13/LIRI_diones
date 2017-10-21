var myKeys = require("./keys.js")

//get all console input
var consoleInput = process.argv;

//get liriCommand from user input
var liriCommand = consoleInput[2];

//check if query input exist and combine it if its multiple separated strings
if(consoleInput.length>3)
	var queryInput = consoleInput.slice(3).join(' ')
else
{
	queryInput = null
}


//run the function that selects the appropriate liriCommand
selectCommand(liriCommand,queryInput,true)



//FUNCTIONS=====================================================

//function to select the command to use
function selectCommand(liriCommand,queryInput) {

	
	//if command my-tweets
	if(liriCommand==='my-tweets')
	{
		//console.log('werwerw')
		tweet()
	}
	//if command is spotify-this-song
	else if(liriCommand==='spotify-this-song')
	{	
		//console.log(input)
		spotify(queryInput)
	}

	//if command movie-this
	else if(liriCommand==='movie-this')
	{
		omdb(queryInput)
	}
	//if command do-what-it-says
	else if(liriCommand==="do-what-it-says") {

		dothis()
	}
}

function tweet() {
	var Twitter = require('twitter');
	 
	var client = new Twitter({
		  consumer_key: myKeys.twitterKeys.consumer_key,
		  consumer_secret: myKeys.twitterKeys.consumer_secret,
		  access_token_key: myKeys.twitterKeys.access_token_key,
		  access_token_secret: myKeys.twitterKeys.access_token_secret
	});
	 
	var params = {screen_name: 'dionespaul'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  if (!error) {
			//console.log("	The TWEETS!")
			for (var i = 0; i < tweets.length; i++) {
				console.log("	" + (i+1) +": " + tweets[i].text)
			}
			    
		  }
		else
			console.log(error)
	});
}
function dothis() {
	// fs is a core Node package for reading and writing files
	var fs = require("fs");

// This block of code will read from the "movies.txt" file.
// It's important to include the "utf8" parameter or the code will provide stream data (garbage)
// The code will store the contents of the reading inside the variable "data"
fs.readFile("random.txt", "utf8", function(error, data) {

  // If the code experiences any errors it will log the error to the console.
  if (error) {
  	return console.log(error);
  }

  // We will then print the contents of data
  //console.log(data);

  // Then split it by commas (to make it more readable)
  var dataArr = data.split(",");

  // We will then re-display the content as an array for later use.
  //console.log(dataArr);
  selectCommand(dataArr[0],dataArr[1])
});
}

function omdb(input) {
	//var input =getSearchInput(consoleInput,'+')
	//console.log(input)

	var request = require ("request")


// Then run a request to the OMDB API with the movie specified
//if input exist do this
if(input)
	var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=40e9cece";
else//else do the default
	var queryUrl = "http://www.omdbapi.com/?t=" + 'Mr. Nobody' + "&y=&plot=short&apikey=40e9cece";

request(queryUrl,function(error,response,body){

	if(!error && response.statusCode ===200) {

		console.log("	Title: " + JSON.parse(body).Title)
		console.log("	Year: " + JSON.parse(body).Year)
		console.log("	imdbRating: " + JSON.parse(body).imdbRating)

		//get the rating for rotten tomatoes
		//some times rotten tomatoes rating does not exist
		var ratings = JSON.parse(body).Ratings;
		if(ratings != undefined) {
			for (var i = 0; i < ratings.length; i++) {
			//Rotten Tomatoes ratings found get the rating
			if(ratings[i].Source==="Rotten Tomatoes")
				console.log("	Rotten Tomatoes: "+ ratings[i].Value)
			//no rotten tomatoes ratings found set ratingsg to false
			ratings = false;
		}
	}	//show user that rotten tomatoes is N/A
		if(ratings===false)//if ratings stuff exists
			console.log("	Rotten Tomatoes: N/A")	

		//show the other stuff
		console.log("	Country: " + JSON.parse(body).Country)
		console.log("	Language:  " + JSON.parse(body).Language)
		console.log("	Plot:  " + JSON.parse(body).Plot)
		console.log("	Actors:  " + JSON.parse(body).Actors)
		//console.log(JSON.parse(body))
	}

});

}

function spotify(input) {

	//call the getSearchInput to get the user input
/*	if(queryInput)
		var input = queryInput
	else
		var input =getSearchInput(consoleInput,' ')*/

	var Spotify = require('node-spotify-api');
	 
	var spotify = new Spotify({
		  id: myKeys.spotifyKeys.client_id,
		  secret: myKeys.spotifyKeys.client_secret
	});
	 

	//if input exist set the search input
	if(input) {
		spotify.search({ type: 'track', query: input ,limit:1 }, outputSpotify);
	}
	//no input just seaerch the sign ace of base
	else {
		spotify.search({ type: 'track', query: 'the sign ace of base',limit:1 }, outputSpotify);
	}

	function outputSpotify(err, data) {
		  if (err) {
			    return console.log('Error occurred: ' + err);
		  }
		 
		//console.log(data.tracks.items[0]); 
		var songInfo=data.tracks.items[0];
		var artist=songInfo.artists[0].name

		var album=songInfo.album.name;
		var songName =songInfo.name;

		var previewLink = songInfo.external_urls.spotify

		//console.log(songInfo)
		console.log("	Artist: " + artist)		
		console.log("	Song: "+ songName)
		console.log("	Preview Link: "+ previewLink)
		console.log("	Album: "+ album)		
	}

}