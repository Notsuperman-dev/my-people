// public/js/search.js

document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById('search-bar');
    const searchResults = document.getElementById('search-results');

    searchBar.addEventListener('input', async (event) => {
        const query = event.target.value;
        if (query) {
            const response = await fetch(`/search?query=${query}`);
            const results = await response.json();
            searchResults.innerHTML = '';
            results.forEach(result => {
                const resultItem = document.createElement('li');
                resultItem.textContent = result;
                searchResults.appendChild(resultItem);
            });
        } else {
            searchResults.innerHTML = '';
        }
    });
});
