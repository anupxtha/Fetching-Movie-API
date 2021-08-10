//autoComplete reusable object config
const autoCompleteConfig = {
	renderOption(movie){
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; 
		return `
				<img src="${imgSrc}" />
				${movie.Title} (${movie.Year})
			`;
	},

	inputValue(movie){
		return movie.Title;
	},

	async fetchData(searchTerm) {
		const response = await axios.get('https://www.omdbapi.com/',{
			params : {
				apikey: '4a6c1c5d',
				s: searchTerm
			}
		});

		if(response.data.Error){
			return [];
		}

		return response.data.Search;
	}
}


///Creating AutoComplete widget to run as reusable
createAutoComplete({
	...autoCompleteConfig,

	root: document.querySelector('#left-autocomplete'),

	onOptionSelect(movie){
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	}
});


createAutoComplete({
	...autoCompleteConfig,

	root: document.querySelector('#right-autocomplete'),

	onOptionSelect(movie){
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	}
});



//Fetching Single Movie Details 
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) =>{
	const response = await axios.get('https://www.omdbapi.com/',{
		params : {
			apikey: '4a6c1c5d',
			i: movie.imdbID
		}
	});

	// console.log(response.data);
	summaryElement.innerHTML = movieTemplate(response.data);

	if(side === 'left'){
		leftMovie = response.data;
	}
	else{
		rightMovie = response.data;
	}

	if(leftMovie && rightMovie){
		runComparison();
	}

};


const runComparison = () =>{
	const leftSideStats = document.querySelectorAll('#left-summary .notification');
	const rightSideStats = document.querySelectorAll('#right-summary .notification');

	leftSideStats.forEach((leftStat, Index) =>{
		const rightStat = rightSideStats[Index];

		console.log(leftStat, rightStat);
		const leftSideValue = parseFloat(leftStat.dataset.value);
		const rightSideValue = parseFloat(rightStat.dataset.value);

		if(rightSideValue > leftSideValue){
			leftStat.classList.remove('is-primary');
			leftStat.classList.add('is-warning');
		}
		else if(rightSideValue === leftSideValue){

		}
		else{
			rightStat.classList.remove('is-primary');
			rightStat.classList.add('is-warning');
		}
	});
};


//Showing Single Movie Details in Front End
const movieTemplate = (movieDetail) =>{
	//'$629,000,000'
	let dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
	
	if(isNaN(dollars)){
		dollars = 0;
	}

	const metascore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
	
	const awards = movieDetail.Awards.split(' ').reduce((prev,word) =>{
		const value = parseInt(word);

		if(isNaN(value)){
			return prev;
		}else{
			return prev + value;
		}
	}, 0);

	return `
		<article class="media">
			<figure class="media-left">
				<p class="image">
					<img src="${movieDetail.Poster}" />
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h1>${movieDetail.Title}</h1>
					<h4>${movieDetail.Genre}</h4>
					<p>${movieDetail.Plot}</p>
				</div>
			</div>
		</article>

		<article data-value=${awards} class="notification is-primary">
			<p class="title">${movieDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>

		<article data-value=${dollars} class="notification is-primary">
			<p class="title">${movieDetail.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>

		<article data-value=${metascore} class="notification is-primary">
			<p class="title">${movieDetail.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>

		<article data-value=${imdbRating} class="notification is-primary">
			<p class="title">${movieDetail.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>

		<article data-value=${imdbVotes} class="notification is-primary">
			<p class="title">${movieDetail.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
	`;
}