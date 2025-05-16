let currentPage = 1;
let lastPage = 1;
const movieContainer = document.getElementById("movies");
movieContainer.innerHTML = ""

// SCROLL
window.addEventListener("scroll", function() {
    const endOfPage = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

    console.log(`Scroll event fired. End of Page: ${endOfPage}, Current Page: ${currentPage}, Last Page: ${lastPage}`);
    
    if (endOfPage && currentPage < lastPage) {
        currentPage += 1;
        getMovies(null, currentPage); 
    }
});

function getMovies(genreId = null, pageNumber = 1) {
    const apiKey = 'a2892af041d1997a7773a39e7c44ab39';
    const url = genreId 
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${pageNumber}`
        : `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${pageNumber}`;

    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    axios.get(url)
        .then(function (response) {
            console.log(response.data.results);

            const movies = response.data.results;
            const movieContainer = document.getElementById("movies");

            lastPage = response.data.total_pages;

            // التأكد من إضافة الأفلام الجديدة دون إعادة تعيين المحتوى
            movies.forEach(movie => {
                const posterPath = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : 'path/to/default-image.jpg';

                // تقريب التقييم أو عرضه كعدد صحيح
                const roundedVoteAverage = movie.vote_average % 1 === 0 ? movie.vote_average : movie.vote_average.toFixed(1);

                movieContainer.innerHTML += `
                <div class="movie-wrapper" style="cursor: pointer;" onclick="movieClicked(${movie.id})">
                    <div class="movie-card">
                        <img src="${posterPath}" alt="${movie.original_title}">
                        <div class="card-info">
                            <div class="rating">
                                <h5>${roundedVoteAverage}</h5>
                                <i class="bi bi-star-fill"></i>
                            </div>
                            <p>${movie.release_date}</p>
                        </div>
                    </div>
                    <div class="movie-title">${movie.original_title}</div>
                </div>
                `;
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

document.getElementById("action").addEventListener("click", function() {
    currentPage = 1; 
    movieContainer.innerHTML = ""; 
    getMovies(28, currentPage); 

});

document.getElementById("drama").addEventListener("click", function() {
    currentPage = 1; 
    movieContainer.innerHTML = ""; 
    getMovies(18, currentPage);  
});

document.getElementById("comedy").addEventListener("click", function() {
    currentPage = 1; 
    movieContainer.innerHTML = ""; 
    getMovies(35, currentPage);  
});

getMovies();

//Search 
let searchTimeout;

function searchMovies() {
    clearTimeout(searchTimeout); 
    searchTimeout = setTimeout(() => {
        let searchBar = document.getElementById('search-input').value.toUpperCase();
        let movieCards = document.querySelectorAll('.movie-wrapper');

        movieCards.forEach(card => {
            let movieTitle = card.querySelector('.movie-title').innerText.toUpperCase();
            if (movieTitle.indexOf(searchBar) > -1) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    }, 300); 
}

// استدعاء دالة البحث عند الكتابة في حقل البحث
document.getElementById('search-input').addEventListener('input', searchMovies);

const apiKey = 'a2892af041d1997a7773a39e7c44ab39';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const movieIds = [533535, 1022789, 519182, 748783, 976830]; 

// دالة لجلب بيانات الفيلم باستخدام معرف الفيلم
async function fetchMovieData(id) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie data:', error);
        return null;
    }
}

// دالة لإضافة الأفلام إلى الكاروسيل
async function addMoviesToCarousel() {
    const carouselInner = document.getElementById('carousel-inner');
    if (!carouselInner) return;

    // جلب بيانات الأفلام بشكل عشوائي
    const randomMovieIds = movieIds.sort(() => 0.5 - Math.random()).slice(0, 3); // جلب 3 أفلام عشوائية
    const movies = await Promise.all(randomMovieIds.map(id => fetchMovieData(id)));

    carouselInner.innerHTML = '';

    movies.forEach((movie, index) => {
        if (!movie) return;

        const roundedVoteAverage = movie.vote_average % 1 === 0 ? movie.vote_average : movie.vote_average.toFixed(1);

        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) carouselItem.classList.add('active');

        carouselItem.innerHTML = `
            <img src="${imageBaseUrl}${movie.backdrop_path}" class="d-block w-100" alt="${movie.title}">
            <div class="carousel-caption d-none d-md-block">
                <div class="details">
                    <i class="fas fa-calendar-day"></i> <p>${movie.release_date}</p>
                    <i class="fas fa-star"></i> <p>${roundedVoteAverage}</p>
                </div>
                <h5>${movie.title}</h5>
                <p>${movie.overview}</p>
            </div>
        `;

        carouselInner.appendChild(carouselItem);
    });
}

// استدعاء دالة تحديث الأفلام كل 10 ثوانٍ
addMoviesToCarousel();
setInterval(addMoviesToCarousel, 10000);


//Details "movie-wrapper"
function movieClicked(movieId){
     window.location = `./movieDetailes.html?movieid=${movieId}`
}
