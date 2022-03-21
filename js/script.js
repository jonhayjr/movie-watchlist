import config from "./config.js";

const movieContainer = document.getElementById('movie-container');
let movieData = [];

const getMovies = async(search = 'Batman') => {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${config.apiKey}&type=movie&s=${search}`)
    const data = await response.json();
    movieData = await data.Search;
    console.log(movieData)
}

const renderHTML = arr => {

}

getMovies()
