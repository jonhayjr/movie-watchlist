import config from "./config.js";

const movieContainer = document.getElementById('movie-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');


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
            
            const movieData = await Promise.all(promises);

            movieData.map(movie => {
                if (movie.Poster === 'N/A') {
                    movie.Poster = 'https://picsum.photos/99/148';
                } 
            })

            renderHTML(movieData);
        
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

const renderHTML = arr => {
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
                <button class="card-subheading__watchlist-btn"><img src="./img/PlusSign.svg" alt="">Watchlist</button>
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

const handleSearchClick = () => {
    const searchValue = searchInput.value;

    if (searchValue) {
        getMovies(searchValue)
    } else {
        alert('You must define a search value.')
    }
}

searchBtn.addEventListener('click', handleSearchClick);


