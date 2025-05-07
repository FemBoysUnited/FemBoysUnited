document.addEventListener("DOMContentLoaded", function() {
    const loadCards = async (category, searchQuery = '') => {
        const cardContainer = document.getElementById(`${category}-cards`);
        const nsfwToggle = document.getElementById('nsfw-toggle');
        const sortSelect = document.getElementById('sort-select');

        if (!cardContainer) return;

        // Fade out the card container before clearing
        cardContainer.classList.add('hidden');

        // Delay clearing the container until after the fade-out
        setTimeout(async () => {
            cardContainer.innerHTML = ''; // Clear the current cards

            try {
                const response = await fetch('cards/cards.json');
                const cardList = await response.json();
                const categoryFiles = cardList[category] || [];

                const cardDataArray = [];

                // Load all the cards
                for (const file of categoryFiles) {
                    try {
                        const res = await fetch(`cards/${category}/${file}`);
                        const data = await res.text();
                        const cardData = JSON.parse(data);

                        // NSFW Filter
                        if (cardData.nsfw && !nsfwToggle.checked) continue;

                        // Search Filter (only applies if searchQuery is passed)
                        if (searchQuery && cardData.name.toLowerCase().indexOf(searchQuery.toLowerCase()) === -1) continue;

                        cardDataArray.push(cardData);
                    } catch (err) {
                        console.error("Error loading card:", file, err);
                    }
                }

                // 🔀 Sort based on selected option
                const sortMode = sortSelect.value;
                cardDataArray.sort((a, b) => {
                    switch (sortMode) {
                        case 'az': return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
                        case 'za': return b.name.localeCompare(a.name, undefined, { sensitivity: 'base' });
                        case 'sfw': return (a.nsfw === b.nsfw) ? 0 : (a.nsfw ? 1 : -1);
                        case 'nsfw': return (a.nsfw === b.nsfw) ? 0 : (a.nsfw ? -1 : 1);
                        default: return 0;
                    }
                });

                // Render the filtered and sorted cards
                cardDataArray.forEach(cardData => {
                    const nsfwClass = cardData.nsfw ? 'nsfw' : '';
                    const cardHTML = `
                        <a href="${cardData.link}" target="_blank" class="card-link">
                            <div class="card ${nsfwClass}">
                                <img src="${cardData.logo}" alt="${cardData.name} logo">
                                <h3>${cardData.name}</h3>
                                <p class="description">${cardData.description}</p>
                            </div>
                        </a>
                    `;
                    cardContainer.innerHTML += cardHTML;
                });

                // Fade in the card container after cards are loaded
                cardContainer.classList.remove('hidden');
            } catch (error) {
                console.error("Error fetching cards list:", error);
            }
        }, 500); // Time to allow fade-out to complete (in milliseconds)
    };

    // Handle page-specific features
    const currentPage = window.location.pathname.split('/').pop().split('.').shift();

    // Initialize cards on all pages
    loadCards(currentPage);

    // Event listeners for NSFW toggle and sorting (works across all pages)
    document.getElementById('nsfw-toggle').addEventListener('change', () => loadCards(currentPage));
    document.getElementById('sort-select').addEventListener('change', () => loadCards(currentPage));

    // Only enable search functionality on products.html page
    if (currentPage === 'products') {
        const searchInput = document.getElementById('search-input');
        const searchBarLabel = document.getElementById('search-bar-label');
        
        // Make search bar visible on products.html
        searchBarLabel.style.display = 'block';
        
        searchInput.addEventListener('input', () => {
            const searchQuery = searchInput.value; // Get the search query
            loadCards(currentPage, searchQuery); // Pass the search query to the loadCards function
        });
    }
});
