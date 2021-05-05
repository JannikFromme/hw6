//http://localhost:8888/.netlify/functions/movies
// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  //console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!

  // get the year and the genre from the querystring parameters
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  // check if the devloper passed the two querystring parameters
  // return an error if not
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Error: Pass queystring parameters "year" and "genre"` // a string of data
    }
  }

  // generate JSON object if parameters were provided
  else {

    // create a new object to hold the two value pairs: number of results and and an array of movies
    let returnValue = {
      numResults: 0,
      movies: []
    }

    // loop through all movies
    for (let i=0; i < moviesFromCsv.length; i++) {

      // store each movie in memory
      let movie = moviesFromCsv[i]

      // check if the movie meets the provided querystring parameters and ignore those results with no runtime (runtimeMinutes ="\\N") and no genre
      // (use .includes to include movies with mutliple genres out of which the specified genre is one, movies with no genre will be ingored automatically)
      if (movie.startYear == year && movie.genres.includes(genre) == true && movie.runtimeMinutes != '\\N') {

        // Create a new object containing the required details for each movie
        let movieInfo = {
          primaryTitle: movie.primaryTitle,
          releaseYear: movie.startYear,
          genres: movie.genres
        }

        // add the movie to the array of movies to return
        returnValue.movies.push(movieInfo)
      }
    }

    // add the number of movies to the resulting JSON
    returnValue.numResults = returnValue.movies.length

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}