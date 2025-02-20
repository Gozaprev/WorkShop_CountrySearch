const app = async () => {
    const input = document.getElementById('countryInput').value; // Get input value here
    if (!input) return; // Exit if input is empty

    try {
        // 1. Fetch countries data
        const countries = await fetchCountriesAsync(input); // Pass input to the fetch function
        // 2. Render cards data
        renderCards(countries);
    } catch (error) {
        console.log(`Error: ${error}`);
        const notFoundDiv = document.getElementById('notFound');
        notFoundDiv.classList.remove('hidden'); // Show not found message on error
    }
};

// Fetch countries function
const fetchCountriesAsync = async (input) => {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${input}`);
        const countries = await res.json();
        return countries;
    } catch (err) {
        throw new Error(err);
    }
};

// Render cards function
const renderCards = (countries) => {
    console.log("render cards called");

    const resultsDiv = document.getElementById('results');
    const notFoundDiv = document.getElementById('notFound');
    resultsDiv.innerHTML = ''; 
    notFoundDiv.classList.add('hidden'); 

    if (countries && Array.isArray(countries) && countries.length > 0) {
        countries.forEach(country => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="100">
                <h3>${country.name.common}</h3>
                <p>Population: ${country.population.toLocaleString()}</p>
                <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
                <p>Area: ${country.area.toLocaleString()} km²</p>
            `;
            resultsDiv.appendChild(card);
        });
    } else {
        notFoundDiv.classList.remove('hidden'); 
    }
};

document.getElementById('searchButton').addEventListener('click', app);
