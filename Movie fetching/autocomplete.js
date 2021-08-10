const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) =>{
	//Drop down HTML code
	// const root = document.querySelector('.autocomplete');

	root.innerHTML = `
		<lable><b>Search</b></lable>
		<input class="input" />
		<div class="dropdown">
			<div class="dropdown-menu">
		        <div class="dropdown-content results">
		        </div>
		    </div>
		</div>
	`;

	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results')


	//Fetching items data 
	const onInput = async event =>{
		const items = await fetchData(event.target.value);

		if(!items.length){
			dropdown.classList.remove("is-active");
			return;
		}

		resultsWrapper.innerHTML = "";

		dropdown.classList.add('is-active');

		for(let item of items){
			const option = document.createElement('a');

			option.classList.add('dropdown-item');

			option.innerHTML = renderOption(item);

			option.addEventListener('click', ()=>{
				dropdown.classList.remove('is-active');
				input.value = inputValue(item);
				onOptionSelect(item);
			})

			resultsWrapper.appendChild(option);
		}
	};

	input.addEventListener("input", debounce(onInput, 500));


	//Close Dropdown search while clicking outside
	document.addEventListener('click', event =>{
		if(!root.contains(event.target)){
			dropdown.classList.remove("is-active");
		}
	});


};