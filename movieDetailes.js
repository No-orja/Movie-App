const apiKey = 'a2892af041d1997a7773a39e7c44ab39';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

function getMovieIdForPage(){
    const urlPost = new URLSearchParams(window.location.search);
    const id = urlPost.get("movieid");
    return id
}

const movieId = getMovieIdForPage(); 
const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

axios.get(url)
    .then(response => {
        console.log(response.data);
        const movie = response.data
        const posterPath = movie.poster_path? `${imageBaseUrl}${movie.poster_path}` : 'path/to/default-image.jpg';

        document.getElementById("movie-title").innerHTML = movie.title
        document.getElementById("movie-poster").src = posterPath
        document.getElementById("movie-description").innerHTML = movie.overview
        
        
        document.getElementById("date-movie").innerHTML = movie.release_date
        
        const roundedVoteAverage = movie.vote_average % 1 === 0 ? movie.vote_average : movie.vote_average.toFixed(1);
        document.getElementById("vote_average").innerHTML = roundedVoteAverage;


        const genres = movie.genres.map(genre => genre.name).join(', '); 
        document.getElementById("genres").innerHTML = genres;
        
    })
    .catch(error => {
        console.error('Error fetching movie details:', error);
    });

    


    document.addEventListener("DOMContentLoaded", function () {
        const baseUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
    
        async function fetchTrailer() {
            try {
                const response = await axios.get(baseUrl);
                const videos = response.data.results;
                const trailer = videos.find(video => video.type === "Trailer" && video.site === "YouTube");
    
                if (trailer) {
                    const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
                    const playBtn = document.querySelector(".play-btn");
    
                    playBtn.addEventListener("click", () => {
                        window.open(trailerUrl, "_blank");
                    });
                } else {
                    console.log("Trailer not found.");
                }
            } catch (error) {
                console.error("Error fetching trailer:", error);
            }
        }
    
        fetchTrailer();
    });
    
    

