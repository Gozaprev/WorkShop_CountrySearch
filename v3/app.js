const app = async () => {
    const input = document.getElementById('countryInput').value; // Get input value here
    if (input) {
        try {
            // 1. Fetch countries data based on input
            const countries = await fetchCountriesAsync(input); // Pass input to the fetch function
            // 2. Render cards data
            renderCards(countries);
        } catch (error) {
            console.log(`Error: ${error}`);
            const notFoundDiv = document.getElementById('notFound');
            notFoundDiv.classList.remove('hidden'); // Show not found message on error
        }
    } else {
        // If input is empty, fetch and display all countries
        fetchAllCountries();
    }
};


const fetchAllCountries = async () => {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/all`);
        const countries = await res.json();
        renderCards(countries);
    } catch (error) {
        console.log(`Error fetching all countries: ${error}`);
        const notFoundDiv = document.getElementById('notFound');
        notFoundDiv.classList.remove('hidden'); // Show not found message on error
    }
};


const fetchCountriesAsync = async (input) => {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${input}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const countries = await res.json();
        return countries;
    } catch (err) {
        throw new Error(err);
    }
};


const renderCards = (countries) => {
    console.log("render cards called");

    const resultsDiv = document.getElementById('results');
    const notFoundDiv = document.getElementById('notFound');
    resultsDiv.innerHTML = ''; 
    notFoundDiv.classList.add('hidden'); 

    if (countries && Array.isArray(countries) && countries.length > 0) {
        // We sort countries alphabetically by common name
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

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

// Fetch all countries when the page loads
window.onload = fetchAllCountries;

document.getElementById('searchButton').addEventListener('click', app);
