document.addEventListener("DOMContentLoaded", function() {
    // Debounce function to limit the number of calls to loadCards
    let debounceTimeout;
    const debounce = (func, delay) => {
        return function (...args) {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

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

                // Load all the cards for the specific category
                for (const file of categoryFiles) {
                    if (file.trim() === "") continue; // Skip empty file names

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
                                <img src="${cardData.logo}" alt="${cardData.name} logo" loading="lazy">
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
        }, 200); // Time to allow fade-out to complete (in milliseconds)
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
        
        // Debounce the search input
        searchInput.addEventListener('input', debounce(() => {
            const searchQuery = searchInput.value; // Get the search query
            loadCards(currentPage, searchQuery); // Pass the search query to the loadCards function
        }, 500)); // Delay of 300ms before firing the search
    }
});

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
  
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  });

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoOVMdTdTDzWXtLgrv_az_ZvjnoIuNigw",
  authDomain: "poll-vote-data-1a481.firebaseapp.com",
  databaseURL: "https://poll-vote-data-1a481-default-rtdb.firebaseio.com",
  projectId: "poll-vote-data-1a481",
  storageBucket: "poll-vote-data-1a481.appspot.com",
  messagingSenderId: "163729674724",
  appId: "1:163729674724:web:bbc79fc984aa3e991277f1",
  measurementId: "G-TCGVQPXKDG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener('DOMContentLoaded', async () => {
  const pollForm = document.getElementById('poll-form');
  const pollQuestion = document.getElementById('poll-question');
  const pollResults = document.getElementById('poll-results');
  const pollContent = document.getElementById('poll-content');
  const pollToggle = document.getElementById('poll-toggle');

  const voteCooldownDays = 7;
  const voteCooldownMs = voteCooldownDays * 24 * 60 * 60 * 1000;

  pollToggle.onclick = () => {
    pollContent.style.display = pollContent.style.display === 'block' ? 'none' : 'block';
  };

  const pollData = await fetch('/polls/current.json').then(res => res.json());
  const pollId = pollData.pollId || 'default';
  const options = pollData.options;

  const votesRef = db.ref(`polls/${pollId}/votes`);
  const userVotesRef = db.ref(`userVotes/${pollId}`);

  pollQuestion.textContent = pollData.question;

  firebase.auth().signInAnonymously().then((userCredential) => {
    const userId = userCredential.user.uid;

    userVotesRef.child(userId).once('value', snapshot => {
      const userVote = snapshot.val();
      const now = Date.now();

      const hasVoted = userVote?.hasVoted;
      const lastVoted = userVote?.lastVoted || 0;
      const votedPollId = userVote?.pollId;

      const cooldownActive = (now - lastVoted) < voteCooldownMs;

      if (hasVoted && votedPollId === pollId && cooldownActive) {
        pollForm.innerHTML = '';
        pollResults.classList.remove('hidden');

        votesRef.once('value', voteSnapshot => {
          let votes = voteSnapshot.val() || [];
          votes = Array.isArray(votes) ? votes : [];

          const fullVotes = {};
          Object.entries(options).forEach(([id]) => {
            fullVotes[id] = votes[parseInt(id)] || 0;
          });

          const totalVotes = Object.values(fullVotes).reduce((sum, v) => sum + v, 0);
          renderPollResults(options, fullVotes, totalVotes, pollResults);
        });

        return;
      }

      renderPollOptions(options, votesRef, pollForm);

      // Real-time update listener
      votesRef.on('value', snapshot => {
        let votes = snapshot.val() || [];
        votes = Array.isArray(votes) ? votes : [];

        const fullVotes = {};
        Object.entries(options).forEach(([id]) => {
          fullVotes[id] = votes[parseInt(id)] || 0;
        });

        const totalVotes = Object.values(fullVotes).reduce((sum, v) => sum + v, 0);
        renderPollResults(options, fullVotes, totalVotes, pollResults);
      });

      const voteBtn = document.createElement('button');
      voteBtn.textContent = 'Vote';
      voteBtn.type = 'button';
      voteBtn.onclick = () => handleVote(userId, options, votesRef, userVotesRef, pollId, pollForm);
      pollForm.appendChild(voteBtn);
    });
  });

  function renderPollOptions(options, votesRef, pollForm) {
    for (const [id, text] of Object.entries(options)) {
      const optEl = document.createElement('div');
      optEl.className = 'poll-option';
      optEl.innerHTML = `
        <label>
          <input type="radio" name="poll-option" value="${id}"> ${text}
        </label>`;
      pollForm.appendChild(optEl);
    }
  }

  function renderPollResults(options, votes, totalVotes, pollResults) {
    pollResults.innerHTML = '';

    if (totalVotes === 0) {
      const noVotesMessage = document.createElement('div');
      noVotesMessage.textContent = 'No votes yet.';
      pollResults.appendChild(noVotesMessage);
    } else {
      for (const [id, text] of Object.entries(options)) {
        const voteCount = votes[id] || 0;
        const percent = totalVotes ? ((voteCount / totalVotes) * 100).toFixed(1) : 0;

        const resultEl = document.createElement('div');
        resultEl.innerHTML = `
          <div>${text}: ${percent}% (${voteCount} votes)</div>
          <div class="poll-results-bar">
            <div class="poll-results-fill" style="width: ${percent}%"></div>
          </div>`;
        pollResults.appendChild(resultEl);
      }
    }
  }

  function handleVote(userId, options, votesRef, userVotesRef, pollId, pollForm) {
    const selected = document.querySelector('input[name="poll-option"]:checked');
    if (!selected) return alert("Please select an option.");

    const selectedId = selected.value;

    // Ensure array structure in Firebase
    votesRef.once('value', snapshot => {
      let votes = snapshot.val() || [];
      if (!Array.isArray(votes)) votes = [];

      const index = parseInt(selectedId);
      while (votes.length <= index) votes.push(0);
      votes[index] += 1;

      votesRef.set(votes);
    });

    // Set user vote record with poll ID and timestamp
    userVotesRef.child(userId).set({
      hasVoted: true,
      pollId: pollId,
      lastVoted: Date.now()
    });

    pollForm.innerHTML = '';
    pollResults.classList.remove('hidden');
  }
});

document.addEventListener("DOMContentLoaded", function() {
    // Check if the page contains an element with the class "advice-container"
    const target = document.querySelector('.advice-container');

    if (target) {
        // Smoothly scroll to the element
        setTimeout(function() {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 700);  // Delay for 700 milliseconds (adjust as needed)
    }
});
