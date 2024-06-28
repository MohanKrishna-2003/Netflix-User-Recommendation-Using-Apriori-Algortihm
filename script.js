const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const processingAnimation = document.getElementById('processing-animation');
const resultContainer = document.getElementById('result-container');
const res = document.getElementById('res');
const movieDisplay = document.getElementById('movie-display');



const API_KEY = 'e78ffe115511cff9ee1b987ae3cda199';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500/';

uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (file) {
    processingAnimation.classList.remove('hidden');
    resultContainer.innerHTML = '';

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.results)
        setTimeout(() => {
          displayResults(data.results);
          fetchMovies(data.results);
        }, 2000); // Delay of 2 seconds to simulate real-time processing
      } else {
        console.error('Error processing dataset:', response.status);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
});

function getCookie(name) {
  const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : '';
}

function displayResults(data) {
    res.innerHTML = "Here are your suggestions for the weekend..";
    console.log(res.innerHTML)
    let table = document.createElement("table");
    let headerRow = table.insertRow();
    
    // Create table header
  let th = document.createElement("th");
  th.textContent = "Rank";
  headerRow.appendChild(th);

  for (let key in data[0]) {
      th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  }

  // Add data rows
  for (let i = 0; i < data.length; i++) {
    let row = table.insertRow();

    // Add rank column
    let cell = row.insertCell();
    cell.textContent = i + 1;

    for (let key in data[i]) {
        cell = row.insertCell();
        cell.textContent = data[i][key];
    }
  }
  
  // Append the table to the HTML
  resultContainer.innerHTML = '';
  resultContainer.appendChild(table);
  processingAnimation.classList.add('hidden');
}


async function fetchMovies(movies){
    movieDisplay.innerHTML = '';
    for(let i=0; i<movies.length; i++){
        const movie1 = movies[i]['Movie 1'];
        const movie2 = movies[i]['Movie 2'];
        const rank = i+1;
        
        console.log(movie1)
        console.log(movie2)

        // let rank = 1;
        await fetchMovieDetails(movie1, rank);
        await fetchMovieDetails(movie2, rank);
        // rank++;
    }
}

// async function fetchMovieDetails(movieTitle){
//     try{
//         const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieTitle)}`);
//         const data = response.json();

        
//             const movie = data.results[0];
//             console.log(data.results[0]);
//             createMovieBox(movie);
        
//     }catch(error){
//         console.log('Error fetching movie details: ', error);
//     }
// }
async function fetchMovieDetails(movieTitle, rank) {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieTitle)}`);
      const data = await response.json();
  
      if (data.results && data.results.length > 0) {
        const movie = data.results[0];
        createMovieBox(movie, rank);
      } else {
        console.log(`No movie found for "${movieTitle}".`);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }
  


// function createMovieBox(movie){
//     const movieBox = document.createElement('div');
//     movieBox.classList.add('movie-box');

//     const posterBox = document.createElement('div');
//     posterBox.classList.add('poster-box');

//     const posterImg = document.createElement('img');
//     console.log(movie.poster_path);
//     posterImg.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
//     console.log(posterImg.src);

//     posterImg.alt = movie.title;

//     const detailsBox = document.createElement('div');
//     detailsBox.classList.add('details-box');

    
//   const title = document.createElement('h3');
//   title.textContent = movie.original_title;
//   detailsBox.appendChild(title);

//   const overview = document.createElement('p');
//   overview.textContent = movie.overview;
//   detailsBox.appendChild(overview);

  
//   const releaseDate = document.createElement('p');
//   releaseDate.textContent = `Release Date: ${movie.release_date}`;
//   detailsBox.appendChild(releaseDate);

//   movieBox.appendChild(posterBox);
//   movieBox.appendChild(detailsBox);

//   movieDisplay.appendChild(movieBox);
// }
// function createMovieBox(movie) {
//     const movieBox = document.createElement('div');
//     movieBox.classList.add('movie-box');
  
//     const posterBox = document.createElement('div');
//     posterBox.classList.add('poster-box');
  
//     const posterImg = document.createElement('img');
  
//     let posterPath = movie.poster_path;
//     if (posterPath && !posterPath.startsWith('/')) {
//       posterPath = '/' + posterPath;
//     }
  
//     posterImg.src = `${IMAGE_BASE_URL}${posterPath}`;
//     console.log(posterImg.src);
  
//     posterImg.alt = movie.title;
  
//     const detailsBox = document.createElement('div');
//     detailsBox.classList.add('details-box');
  
//     const title = document.createElement('h3');
//     title.textContent = movie.original_title;
//     detailsBox.appendChild(title);
  
//     const overview = document.createElement('p');
//     overview.textContent = movie.overview;
//     detailsBox.appendChild(overview);
  
//     const releaseDate = document.createElement('p');
//     releaseDate.textContent = `Release Date: ${movie.release_date}`;
//     detailsBox.appendChild(releaseDate);
  
//     posterBox.appendChild(posterImg);
//     movieBox.appendChild(posterBox);
//     movieBox.appendChild(detailsBox);
  
//     movieDisplay.appendChild(movieBox);
//   }
  

function createMovieBox(movie, rank) {
  const movieRow = document.createElement('div');
  movieRow.classList.add('movie-row');

  const rankHeading = document.createElement('h2');
  rankHeading.textContent = `#Rank ${rank}`;
  movieRow.appendChild(rankHeading);

  const movieBox = document.createElement('div');
  movieBox.classList.add('movie-box');

  const posterImg = document.createElement('img');
  posterImg.src = `${IMAGE_BASE_URL}${movie.poster_path}`;
  posterImg.alt = movie.title;
  movieBox.appendChild(posterImg);

  const title = document.createElement('h3');
  title.textContent = movie.original_title;
  movieBox.appendChild(title);

  const overview = document.createElement('p');
  overview.textContent = movie.overview;
  movieBox.appendChild(overview);

  movieRow.appendChild(movieBox);
  movieDisplay.appendChild(movieRow);
}