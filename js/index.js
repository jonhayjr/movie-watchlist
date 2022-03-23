import config from "./config.js";

//Constants
const movieContainer = document.getElementById("movie-container");
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");

//Get watchMovies and movieData from local storage
let watchlistMovies = JSON.parse(localStorage.getItem("watchlist_movies"))
  ? JSON.parse(localStorage.getItem("watchlist_movies"))
  : [];
let movieData = JSON.parse(localStorage.getItem("movies"))
  ? JSON.parse(localStorage.getItem("movies"))
  : [];

//Function to get movie data from api
const getMovies = (search) => {
  fetch(
    `https://www.omdbapi.com/?apikey=${config.apiKey}&type=movie&s=${search}`
  )
    .then((response) => response.json())
    .then(async (data) => {
      //Check if API returns data.  If not, render no data html
      if (!data.Search) {
        renderNoDataHtml();
        return;
      }

      let promises = [];

      //Make API call for each individual movie that was returned and push to promises array
      data.Search.forEach((movie) => {
        const promise = getMovieById(movie.imdbID);
        promises.push(promise);
      });

      //Resolve promises
      const movies = await Promise.all(promises);

      //Update movieData array with value
      movieData = movies;

      //Check for movies without image or 'N/A' values and updated with placeholder
      movies.map((movie) => {
        if (movie.Poster === "N/A" || "") {
          movie.Poster = "https://picsum.photos/99/148";
        }
      });

      //Push movies array to local storage
      localStorage.setItem("movies", JSON.stringify(movies));

      //Render movies html
      renderMovieHTML(movies);
    });
};

//Function to get individual movie data
const getMovieById = (id) => {
  return fetch(
    `https://www.omdbapi.com/?apikey=${config.apiKey}&type=movie&i=${id}`
  )
    .then((response) => response.json())
    .then((data) => data);
};

//Function to render no data html
const renderNoDataHtml = () => {
  const html = `
    <div class="movies-placeholder">
        <p class="placeholder-text">Unable to find what you’re looking for. Please try another search.</p>
    </div> 
    `;

  movieContainer.innerHTML = html;
};

//Function to render movie html
const renderMovieHTML = (arr) => {
  let movieHtml = "";
  if (arr.length > 0) {
    movieHtml = arr
      .map((item) => {
        return `<div class="movie-card">
        <img src="${item.Poster}" alt="" class="card-img">
        <div class="movie-details">
            <div class="card-heading">
                <h2 class="card-heading__title">${item.Title}</h2>
                <p class="card-heading__stars"> <img src="./img/Star.svg" alt="" class="card-heading__stars-img">${item.imdbRating}</p>
            </div>
            <div class="card-subheading">
                <p class="card-subheading__runtime">${item.Runtime}</p>
                <p class="card-subheading__genre">${item.Genre}</p>
                <button class="card-subheading__watchlist-btn" id="watchlist-add-btn" data-title="${item.Title}"><img src="./img/PlusSign.svg" alt="" class="card-subheading__watchlist-btn-icon">Watchlist</button>
            </div>
            <div class="card-body">
                <p class="card-body__paragraph">${item.Plot}</p>
            </div>
        </div>
       </div>
        `;
      })
      .join("");
  } else {
    movieHtml = ` 
    <div class="movies-placeholder">
        <img src="./img/MovieFilm.svg" alt="Film" class="placeholder-icon">
        <p class="placeholder-text">Start Exploring</p>
    </div> `;
  }

  movieContainer.innerHTML = movieHtml;
};

//Function to handle search click
const handleSearchClick = (e) => {
  //Prevent default form behavior
  e.preventDefault();

  const formData = new FormData(e.target);

  const searchValue = formData.get("search-input");

  if (searchValue) {
    getMovies(searchValue);
  } else {
    alert("You must define a search value.");
  }
};

//Render movie data on page load
renderMovieHTML(movieData);

//Event Listeners
searchForm.addEventListener("submit", handleSearchClick);

movieContainer.addEventListener("click", (e) => {
  if (e.target.id === "watchlist-add-btn") {
    const movieTitle = e.target.getAttribute("data-title"); //Get movie title from data attribute
    const movie = movieData.find((movie) => movie.Title === movieTitle); //Check movie data based on title
    const index = watchlistMovies.findIndex(
      (item) => movie.Title === item.Title
    ); //Get index of movie in watchlistMovies array
    
    //Check to confirm that movie doesn't already exist in watchlist before adding
    if (index < 0) {
      watchlistMovies.push(movie);
      localStorage.setItem("watchlist_movies", JSON.stringify(watchlistMovies));
      alert(`${movieTitle} was added to your watchlist!`);
    } else {
      alert(`${movieTitle} was already added to your watchlist!`);
    }
  }
});
