import config from "./config.js";

const movieContainer = document.getElementById('movie-container');
const watchlistContainer = document.getElementById('watchlist-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

let movieData = []
let watchlistMovies = []


const getMovies = (search) => {
    fetch(`http://www.omdbapi.com/?apikey=${config.apiKey}&type=movie&s=${search}`)
        .then(response => response.json())
        .then(async(data) => {
            if (!data.Search) {
                renderNoData();
            return;
     
            }

            let promises = []
            data.Search.forEach(movie => {
                const promise = getMovieById(movie.imdbID)
                promises.push(promise)
            })
            
            const movies = await Promise.all(promises);
            movieData = movies;

            movies.map(movie => {
                if (movie.Poster === 'N/A') {
                    movie.Poster = 'https://picsum.photos/99/148';
                } 
            })

            renderMovieHTML(movies);
        
        })

}

const getMovieById = (id) => {
       return fetch(`http://www.omdbapi.com/?apikey=${config.apiKey}&type=movie&i=${id}`)
            .then(response => response.json())
            .then(data => data)
       
}

const renderNoData = () => {
    const html = `
    <div class="movies-placeholder">
        <p class="placeholder-text">Unable to find what you’re looking for. Please try another search.</p>
    </div> 
    `

    movieContainer.innerHTML = html;
}

const renderMovieHTML = arr => {
    const movieHtml = arr.map(item => {
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
                <p class="card-body__paragraph">${arr.Plot}</p>
            </div>
        </div>
       </div>
        `
    }).join("")

    movieContainer.innerHTML = movieHtml;
}


const renderWatchlistHTML = arr => {
    let watchlistHtml = '';
    if (arr.length > 0) {
    watchlistHtml = arr.map(item => {
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
                <p class="card-body__paragraph">${arr.Plot}</p>
            </div>
        </div>
       </div>
        `
    }).join("")

    } else {
        watchlistHtml = `<div class="movies-placeholder movies-placeholder__watchlist">
        <p class="placeholder-text">Your watchlist is looking a little empty...</p>
        <a class="card-subheading__watchlist-btn watchlist-btn" href="index.html"><img src="./img/PlusSign.svg" class="card-subheading__watchlist-btn-icon" alt="">Let's add some movies</a>
        </div> `
    }

    watchlistContainer.innerHTML = watchlistHtml;
}

const handleSearchClick = () => {
    const searchValue = searchInput.value;

    if (searchValue) {
        getMovies(searchValue)
    } else {
        alert('You must define a search value.')
    }
}


if (window.location.href.includes('index.html')) {
    searchBtn.addEventListener('click', handleSearchClick);

    movieContainer.addEventListener('click', (e) => {
        if (e.target.id === 'watchlist-add-btn') {
            console.log('button clicked')
            const movieTitle = e.target.getAttribute('data-title');
            const movie = movieData.find(movie => movie.Title === movieTitle)
            
            if (watchlistMovies.indexOf(movie) < 0) {
                watchlistMovies.push(movie);
                console.log(watchlistMovies)
                localStorage.setItem("watchlist_movies", JSON.stringify(watchlistMovies));
                renderWatchlistHTML(watchlistMovies)
            }
        }
    })
} else if (window.location.href.includes('watchlist.html')) {
    //Render watchlist data on page load
    renderWatchlistHTML(watchlistMovies);

}
