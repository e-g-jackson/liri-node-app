//global variables and npm
require('dotenv').config();
var fs = require('file-system')
var axios = require('axios');
var SpotifyAPI = require('node-spotify-api');
var input = process.argv[2];
var input2 = process.argv[3];
//verify inputs
console.log('input = ', input, ' input2 = ', input2);
var BITFxn = function(){
    var BIT = 'https://rest.bandsintown.com/artists/' + input2 + '/events?app_id=codingbootcamp';
    axios.get(BIT).then(function(response){
        var rsp = response.data;
        for( var i = 0; i < 5; i++){
            console.log('');
            var city = rsp[i].venue.city;
            var region = rsp[i].venue.region;
            var country = rsp[i].venue.country;
            var hr = rsp[i].datetime.substr(11, 2);
            var convhr;
            var min = rsp[i].datetime.substr(14, 2)
            var timeConverter = function(hour){
                if (hour > 12)
                convhr = hour - 12
            }
            var timeStr = convhr + ':' + min;
            var year = rsp[i].datetime.substr(0, 4);
            var month = rsp[i].datetime.substr(5, 2);
            var day = rsp[i].datetime.substr(8, 2);
            timeConverter(hr);
            console.log('Venue Name: ' + rsp[i].venue.name);
            console.log('Venue Location: ' + city + ', ' + region + ', ' + country);
            console.log('Date: ' + timeStr + ' o\'clock on ' + month + '-' + day + '-' + year);
        }
    }).catch(function(error){
        console.log(error);
        console.log(error.response.data)
    })
}
var spotifyFxn = function(){
    var clientId = process.env.SPOTIFY_ID;
    var clientSecret = process.env.SPOTIFY_SECRET;
    var spotify = new SpotifyAPI({
        id: clientId,
        secret: clientSecret,
    });
    if (!input2){
        input2 = 'The Sign Ace of Base'
        }   
    spotify.search({
        type: 'track',
        query: input2,
    }, function(error, data){
        if (!error){
            var info = data.tracks.items;
            for( var i = 0; i < 5; i++){
                if (info[i] != undefined){
                    var results = {
                        'artist': info[i].artists[0].name,
                        'song': info[i].name,
                        'prvURL': info[i].preview_url,
                        'album': info[i].album.name,
                    };
                    console.log('---------------------------');

                    console.log('Song Title: ' + results.song);
                    console.log('Album Title: ' + results.album);
                    console.log('Artist: ' + results.artist);
                    console.log('Preview: ' + results.prvURL);
                    
                    console.log('---------------------------');
                };
            };
        }
        else{
            console.log(error);
        }
    });
};
var OMDBFxn = function(){
    if (!input2){
        input2 = 'Mr.Nobody'
    }   
    var omdb = 'http://www.omdbapi.com/?apikey=trilogy&t=' + input2;

    axios.get(omdb).then(function(response){
        var rsp = response.data;
        console.log('');
        console.log('Title: '+ rsp.Title);
        console.log('Release Date: ' + rsp.Released);
        // console.log(rsp.Ratings['0'].Source + ' Rating: ' + Ratings['0'].Value);
        for(var i = 0; i < rsp.Ratings.length; i++){
            console.log(rsp.Ratings[i])
        };
        console.log('Made in: ' + rsp.Country );
        console.log('Language: ' + rsp.Language);
        console.log('Plot Summary: ' + rsp.Plot);
        console.log('Actors: ' + rsp.Actors);
    }).catch(function(error){
        console.log(error);
        console.log(error.rsp);
    })
};
var decider = function(){
    //BandsInTown
    if(input == 'concert-this'){
        BITFxn();
    }
    //Spotify
    else if(input == 'spotify-this-song'){
        spotifyFxn();
    }
    //OMDB
    else if (input == 'movie-this'){
        OMDBFxn();
    }
    //Wildcard fxn
    else if (input == 'do-what-it-says'){
        fs.readFile('random.txt', 'utf8', function(error, data){
            if(error){
            return console.log(error); 
            }
            var dataArr = data.split(',');
            input = dataArr[0];
            input2 = dataArr[1];
            decider();
        });
    }
};

decider();