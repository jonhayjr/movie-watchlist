//Constants
const watchlistContainer = document.getElementById("watchlist-container");

//Get watchlistMovies from local storage
let watchlistMovies = JSON.parse(localStorage.getItem("watchlist_movies"))
  ? JSON.parse(localStorage.getItem("watchlist_movies"))
  : [];

//Functions

//Function that renders watchlist HTML
const renderWatchlistHTML = (arr) => {
  let watchlistHtml = "";
  if (arr.length > 0) {
    watchlistHtml = arr
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
                <button class="card-subheading__watchlist-btn" id="watchlist-remove-btn" data-title="${item.Title}"><img src="./img/MinusSign.svg" alt="" class="card-subheading__watchlist-btn-icon">Remove</button>
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
    watchlistHtml = `<div class="movies-placeholder movies-placeholder__watchlist">
        <p class="placeholder-text">Your watchlist is looking a little empty...</p>
        <a class="card-subheading__watchlist-btn watchlist-btn" href="index.html"><img src="./img/PlusSign.svg" class="card-subheading__watchlist-btn-icon" alt="">Let's add some movies</a>
        </div> `;
  }

  watchlistContainer.innerHTML = watchlistHtml;
};

//Render watchlist data on page load
renderWatchlistHTML(watchlistMovies);

//Event Listeners

watchlistContainer.addEventListener("click", (e) => {
  //Checks if remove button was clicked
  if (e.target.id === "watchlist-remove-btn") {
    const movieTitle = e.target.getAttribute("data-title"); //Checks title from data attribute
    const movie = watchlistMovies.find((movie) => movie.Title === movieTitle); //Find item in array based on title
    const index = watchlistMovies.findIndex(
      (item) => movie.Title === item.Title
    ); //Get index of item in watchlistMovies array

    //Check if item exists in array
    if (index >= 0) {
      watchlistMovies.splice(index, 1);
      localStorage.setItem("watchlist_movies", JSON.stringify(watchlistMovies));
      renderWatchlistHTML(watchlistMovies);
    }
  }
});
