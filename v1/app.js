document.getElementById('searchButton').addEventListener('click', searchCountries);



async function searchCountries() {
    const input = document.getElementById('countryInput').value;
    const resultsDiv = document.getElementById('results');
    const notFoundDiv = document.getElementById('notFound');

    resultsDiv.innerHTML = ''; // Clear previous results
    notFoundDiv.classList.add('hidden'); // Hide not found message

    if (!input) return; // Exit if input is empty

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${input}`);
        const countries = await response.json();

        if (Array.isArray(countries) && countries.length > 0) {
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
            notFoundDiv.classList.remove('hidden'); // Show not found message
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        notFoundDiv.classList.remove('hidden'); // Show not found message on error
    }
}

////////////////////////////////////////////////////////////

