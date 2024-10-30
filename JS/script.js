
            // main URL's
const API_KEY = 'api_key=d7f389d20067b6684f5232338970f687';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;

const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = BASE_URL + `/search/movie?` + API_KEY + `&query=`;


const container = document.querySelector(".container");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");
const rating = document.getElementById("rating");
const main = document.querySelector('.main .cardsContainer #listContainer');
const form = document.querySelector('.input-btn');
const search = document.getElementById('userInput');
const pagination = document.querySelector('.pagination ul');

let currentPage = 1;
let totalPages = 100;

// input field hover effect
document.querySelector("#searchBtn").addEventListener("mouseenter", function () {
  container.classList.add("active"); // Slide out the input field on hover
});

document.addEventListener("click", function (event) {
  if (!container.contains(event.target)) {
    container.classList.remove("active"); // Slide back the input field when clicking outside
  }
});




// Fetch popular movies on page load
getMovies(API_URL);

// Function to fetch movies from API
function getMovies(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results.length !== 0) {
                showMovies(data.results);
                currentPage = data.page;
                totalPages = data.total_pages;
                setupPagination(currentPage, totalPages);
            } else {
                main.innerHTML = `<h2 class="no-results">No Results Found</h2>`;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to display movies on the page
// Function to display movies in cards with overlay
function showMovies(movies) {
  const listContainer = document.getElementById('listContainer');
  listContainer.innerHTML = ''; // Clear any existing content

  movies.forEach(movie => {
      const { title, vote_average, overview, poster_path } = movie;
      const movieElement = document.createElement('li');
      movieElement.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}">
          <div id="title-rating">
              <h3 id="moviestitle">${title}</h3>
              <span id="rating">Rating : ${vote_average.toFixed(1)}</span>
          </div>
          <!-- Overlay dynamically added -->
          <div class="overlay">
            <h3 class="overlay-title">${title}</h3>
            <p class="overview">${overview}</p>
          </div>
      `;

      listContainer.appendChild(movieElement);
  });
}


// Search form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value.trim();

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_URL + searchTerm);
        search.value = '';
    } else {
        getMovies(API_URL);
    }
});

// Function to setup pagination
// function setupPagination(current, total) {


function setupPagination(current, total) {
    pagination.innerHTML = '';

    let startPage, endPage;
    
    // Determine the range of pages to show
    if (total <= 5) {
        startPage = 1;
        endPage = total;
    } else {
        if (current <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (current + 2 >= total) {
            startPage = total - 4;
            endPage = total;
        } else {
            startPage = current - 2;
            endPage = current + 2;
        }
    }

    // Previous button
    if (current > 1) {
        const prev = document.createElement('li');
        prev.innerHTML = `<a href="#" onclick="changePage(${current - 1})">&laquo; Prev</a>`;
        pagination.appendChild(prev);
    }

    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
        const page = document.createElement('li');
        page.innerHTML = `<a href="#" onclick="changePage(${i})" class="${i === current ? 'active' : ''}">${i}</a>`;
        pagination.appendChild(page);
    }

    // Next button
    if (current < total) {
        const next = document.createElement('li');
        next.innerHTML = `<a href="#" onclick="changePage(${current + 1})">Next &raquo;</a>`;
        pagination.appendChild(next);
    }
}

// Function to handle page change
function changePage(page) {
    const newPageUrl = API_URL + `&page=${page}`;
    getMovies(newPageUrl);
}
