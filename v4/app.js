let countries = []; 
let loader; 
let notFound; 

function showLoader() {
    loader = document.createElement('div');
    loader.textContent = 'Loading...';
    loader.style.display = 'flex';
    loader.style.justifyContent = 'center';
    loader.style.alignItems = 'center';
    loader.style.height = '100vh'; // Full height
    loader.style.fontSize = '24px'; // Larger text
    loader.style.color = '#333'; 
    document.body.appendChild(loader); 
}

function hideLoader() {
    if (loader) {
        document.body.removeChild(loader); 
        loader = null; 
    }
}

function showNotFound(message) {
    if (!notFound) {
        notFound = document.createElement('div');
        notFound.style.display = 'flex';
        notFound.style.justifyContent = 'center';
        notFound.style.alignItems = 'center';
        notFound.style.height = '100vh'; // Full height
        notFound.style.fontSize = '24px'; 
        notFound.style.color = '#ff0000'; 
        document.body.appendChild(notFound); 
    }
    notFound.textContent = message; 
    notFound.classList.remove('hidden'); 
}

function hideNotFound() {
    if (notFound) {
        notFound.classList.add('hidden'); 
    }
}

async function getAllCountries() {
    hideNotFound();
    countryCards.innerHTML = '';
    showLoader(); 

    try {
        const response = await fetch(`https://restcountries.com/v3.1/all`);
        countries = await response.json(); 
        await displayCountries(countries); 
    } catch (error) {
        showNotFound('Error fetching countries.');
    } finally {
        hideLoader(); 
    }
}

async function getEuropeanCountries() {
    hideNotFound();
    countryCards.innerHTML = '';
    showLoader(); 

    try {
        const response = await fetch(`https://restcountries.com/v3.1/region/europe`);
        countries = await response.json(); 
        await displayCountries(countries); 
    } catch (error) {
        showNotFound('Error fetching European countries.');
    } finally {
        hideLoader(); 
    }
}

async function getCountry(country) {
    hideNotFound(); 
    countryCards.innerHTML = '';
    showLoader(); 

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        countries = await response.json(); 
        await displayCountries(countries); 
    } catch (error) {
        showNotFound('Error fetching country data.');
    } finally {
        hideLoader(); 
    }
}

async function getNeighbours(country) {
    hideNotFound(); 
    countryCards.innerHTML = '';
    showLoader(); 

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        const data = await response.json();
        const borders = data[0].borders;

        if (borders && borders.length > 0) {
            const neighbourCountries = await Promise.all(borders.map(async (code) => {
                const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                return res.json();
            }));

            countries = neighbourCountries.flat(); 
            await displayCountries(countries); 
        } else {
            showNotFound('Macedonia has no neighboring countries.');
        }
    } catch (error) {
        showNotFound('Error fetching neighboring countries.');
    } finally {
        hideLoader(); 
    }
}

async function displayCountries(countries) {
    countryCards.innerHTML = '';

    countries.sort((a, b) => {
        const nameA = a.name.common.toLowerCase(); 
        const nameB = b.name.common.toLowerCase();
        return nameA.localeCompare(nameB); 
    });

    countries.forEach(country => {
        const card = document.createElement('div');
        card.classList.add('country-card');

        card.innerHTML = `
            <img src="${country.flags.svg || country.flags.png}" alt="Flag of ${country.name.common || 'N/A'}" style="width: 100px; height: auto;">
            <h2>${country.name.common || 'N/A'}</h2>
            <p>Population: ${country.population || 'N/A'}</p>
            <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p>Area: ${country.area || 'N/A'} km²</p>
            <p>Languages: ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
            <p>Currencies: ${country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A'}</p>
        `;

        countryCards.appendChild(card);
    });
}

document.getElementById('europeButton').addEventListener('click', getEuropeanCountries);
document.getElementById('macedoniaButton').addEventListener('click', () => getCountry('Macedonia'));
document.getElementById('neighboursButton').addEventListener('click', () => getNeighbours('Macedonia'));

async function handleSearch() {
    const searchInput = document.getElementById('searchInput').value.trim();
    
    if (notFound) {
        notFound.textContent = ''; // Clear the message
        document.body.removeChild(notFound); // Remove it from the DOM
        notFound = null; // Clear the reference
    }

    countryCards.innerHTML = ''; // Clear previous country cards

    if (searchInput) {
        await getCountry(searchInput); 
    } else {
        showNotFound('Please enter a country name.');
    }
}

document.getElementById('searchButton').addEventListener('click', handleSearch);

async function handleKeyDown(event) {
    if (event.key === 'Enter') {
        const searchInput = event.target.value.trim();
        
        if (notFound) {
            notFound.textContent = ''; 
            document.body.removeChild(notFound); 
            notFound = null; 
        }

        countryCards.innerHTML = ''; 

        if (searchInput) {
            await getCountry(searchInput); 
        } else {
            showNotFound('Please enter a country name.');
        }
    }
}

document.getElementById('searchInput').addEventListener('keydown', handleKeyDown);

getAllCountries();
