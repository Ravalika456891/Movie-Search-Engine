var movieNameElement = document.getElementById("movie-name");
var searchBtnElement = document.getElementById("search-btn");
let movieContainer = document.getElementById("movies-container");
let movieStatusElement = document.getElementById("movie-status");
var movieInspireElement = document.getElementById("movie-inspire");

const OMDB_API_KEY = "45f0782a";
const OMDB_API_URL = "https://www.omdbapi.com/";
const CURRENT_YEAR = new Date().getFullYear();

const FALLBACK_POSTER =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">' +
            '<rect width="100%" height="100%" fill="#e2e8f0"/>' +
            '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#475569" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="bold">No Poster Available</text>' +
        "</svg>"
    );

// Multi-language & category catalog so searching "telugu movies", "hindi movies",
// "tamil", "malayalam", "kannada", "web series", "short films", etc. works seamlessly
const LANGUAGE_MOVIE_CATALOG = {
    telugu: [
        "Kalki 2898 AD", "Pushpa: The Rise", "Pushpa 2: The Rule", "RRR", "Baahubali: The Beginning",
        "Baahubali 2: The Conclusion", "Salaar", "Devara", "Hanu-Man", "Guntur Kaaram",
        "Lucky Baskhar", "Hi Nanna", "Tillu Square", "Sita Ramam", "Dasara", "Virupaksha",
        "Rangasthalam", "Ala Vaikunthapurramuloo", "Jersey", "Mahanati", "Arjun Reddy", "Eega"
    ],
    hindi: [
        "Jawan", "Pathaan", "Stree 2", "Animal", "Dangal", "3 Idiots", "12th Fail",
        "Gadar 2", "Fighter", "Bhool Bhulaiyaa 3", "Drishyam 2", "Brahmastra",
        "Bajrangi Bhaijaan", "PK", "Zindagi Na Milegi Dobara", "Andhadhun", "Shershaah"
    ],
    tamil: [
        "Leo", "Jailer", "Vikram", "Ponniyin Selvan", "Amaran", "Maharaja", "Master",
        "Kaithi", "Jai Bhim", "Soorarai Pottru", "Asuran", "96", "Ratsasan", "Enthiran"
    ],
    malayalam: [
        "Manjummel Boys", "Aavesham", "Premalu", "Bramayugam", "The Goat Life",
        "2018", "Drishyam", "Kumbalangi Nights", "Bangalore Days", "Premam", "Lucifer"
    ],
    kannada: [
        "K.G.F: Chapter 1", "K.G.F: Chapter 2", "Kantara", "777 Charlie",
        "Sapta Sagaradaache Ello", "Kaatera", "Vikrant Rona", "Lucia", "Kirik Party"
    ],
    english: [
        "Oppenheimer", "Dune: Part Two", "Deadpool & Wolverine", "Inside Out 2",
        "The Batman", "Inception", "Interstellar", "The Dark Knight", "Avatar", "Avengers: Endgame"
    ],
    korean: [
        "Parasite", "Train to Busan", "Exhuma", "Oldboy", "The Roundup",
        "Memories of Murder", "The Handmaiden", "Taxi Driver", "Squid Game"
    ],
    japanese: [
        "Godzilla Minus One", "Your Name", "Spirited Away", "Suzume",
        "Demon Slayer", "Jujutsu Kaisen 0", "One Piece Film: Red", "The Boy and the Heron"
    ],
    webseries: [
        "Mirzapur", "The Family Man", "Sacred Games", "Panchayat", "Farzi",
        "Scam 1992: The Harshad Mehta Story", "Stranger Things", "Breaking Bad", "Squid Game", "Money Heist"
    ],
    serial: [
        "Anupamaa", "Taarak Mehta Ka Ooltah Chashmah", "CID", "Mahabharat",
        "Ramayan", "Sarabhai V/S Sarabhai", "Friends", "The Office", "Modern Family"
    ],
    shortfilm: [
        "Chutney", "Ahalya", "Kriti", "Devi", "The Neighbors' Window",
        "Piper", "Bao", "Hair Love", "Two Distant Strangers", "Stutterer"
    ]
};

const LANGUAGE_ALIASES = {
    telugu: "telugu",
    tollywood: "telugu",
    "telugu movie": "telugu",
    "telugu movies": "telugu",
    hindi: "hindi",
    bollywood: "hindi",
    "hindi movie": "hindi",
    "hindi movies": "hindi",
    tamil: "tamil",
    kollywood: "tamil",
    "tamil movie": "tamil",
    "tamil movies": "tamil",
    malayalam: "malayalam",
    mollywood: "malayalam",
    "malayalam movie": "malayalam",
    "malayalam movies": "malayalam",
    kannada: "kannada",
    sandalwood: "kannada",
    "kannada movie": "kannada",
    "kannada movies": "kannada",
    english: "english",
    hollywood: "english",
    "english movie": "english",
    "english movies": "english",
    korean: "korean",
    "korean movie": "korean",
    "korean movies": "korean",
    japanese: "japanese",
    "japanese movie": "japanese",
    "japanese movies": "japanese",
    "web series": "webseries",
    webseries: "webseries",
    series: "webseries",
    serial: "serial",
    serials: "serial",
    "tv serial": "serial",
    "tv serials": "serial",
    "short film": "shortfilm",
    "short films": "shortfilm",
    shortfilm: "shortfilm"
};

// Initial quote on Home Page
movieInspireElement.innerHTML = `<h2 class="movie-quote">Watch A Movie For Your Mind Refreshment..</h2>`;

/**
 * Determines whether an item is a Movie, Web Series, TV Serial, or Short Film
 */
function getCategoryLabel(item) {
    const rawType = String(item.Type || "movie").toLowerCase();
    const genre = String(item.Genre || "").toLowerCase();
    const title = String(item.Title || "").toLowerCase();
    const runtimeMinutes = parseInt(String(item.Runtime || ""), 10) || 0;
    const totalSeasons = parseInt(String(item.totalSeasons || ""), 10) || 0;

    if (
        /\bshort\b/i.test(genre) ||
        /\bshort\s*film\b/i.test(title) ||
        (rawType === "movie" && runtimeMinutes > 0 && runtimeMinutes <= 40)
    ) {
        return "🎞️ Short Film";
    }

    if (rawType === "episode") {
        return "📡 TV Serial";
    }

    if (rawType === "series") {
        const isSerial =
            /\b(soap|reality-tv|talk-show|game-show|news)\b/i.test(genre) ||
            totalSeasons >= 7 ||
            /\bserial\b/i.test(title);
        return isSerial ? "📡 TV Serial" : "📺 Web Series";
    }

    return "🎬 Movie";
}

function detectLanguageQuery(rawInput) {
    const normalized = rawInput
        .toLowerCase()
        .replace(/\b(19\d{2}|20\d{2})\b/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (LANGUAGE_ALIASES[normalized]) {
        return LANGUAGE_ALIASES[normalized];
    }

    for (const [alias, langKey] of Object.entries(LANGUAGE_ALIASES)) {
        const pattern = new RegExp(
            `^(new|latest|best|top|hit|popular|all)?\\s*${alias}\\s*(movie|movies|film|films)?$`,
            "i"
        );
        if (pattern.test(normalized)) {
            return langKey;
        }
    }
    return null;
}

function renderMoviesToContainer(moviesList) {
    movieContainer.innerHTML = "";

    moviesList.forEach((item, index) => {
        const posterSrc =
            item.Poster && item.Poster !== "N/A" ? item.Poster : FALLBACK_POSTER;
        const cardId = `movie-card-${index}-${item.imdbID || index}`;
        const initialCategory = getCategoryLabel(item);
        const initialLanguage =
            item.Language && item.Language !== "N/A" ? item.Language : "Loading...";

        const card = document.createElement("div");
        card.className = "movie-card";
        card.id = cardId;
        card.innerHTML = `
            <img
                class="image"
                src="${posterSrc}"
                alt="${item.Title}"
                onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';"
            />
            <p><b>Title : </b><b>${item.Title}</b></p>
            <p><b>Released year : </b><b>${item.Year}</b></p>
            <p><b>Category : </b><b class="card-category">${initialCategory}</b></p>
            <p><b>Language : </b><b class="card-language">${initialLanguage}</b></p>
        `;

        movieContainer.appendChild(card);

        // Fetch full details by imdbID so Category (Short Film / Web Series / Serial / Movie)
        // and Language are accurately populated on every card
        if (item.imdbID && (!item.Language || !item.Genre)) {
            fetch(`${OMDB_API_URL}?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(item.imdbID)}`)
                .then((res) => res.json())
                .then((details) => {
                    if (details && details.Response === "True") {
                        const catEl = card.querySelector(".card-category");
                        const langEl = card.querySelector(".card-language");
                        if (catEl) {
                            catEl.textContent = getCategoryLabel(details);
                        }
                        if (langEl) {
                            langEl.textContent =
                                details.Language && details.Language !== "N/A"
                                    ? details.Language
                                    : "N/A";
                        }
                    }
                })
                .catch(() => {
                    const langEl = card.querySelector(".card-language");
                    if (langEl && langEl.textContent === "Loading...") {
                        langEl.textContent = "N/A";
                    }
                });
        }
    });
}

async function runMovieSearch() {
    var movieName = movieNameElement.value.trim();
    if (!movieName) {
        movieStatusElement.textContent = "Please enter a movie name.";
        return;
    }

    movieInspireElement.innerHTML = "";
    movieContainer.innerHTML = "";
    movieStatusElement.textContent = "Loading...";

    try {
        // 1. Check if user searched by language or category (e.g. "telugu movies", "hindi movies", "web series")
        const langKey = detectLanguageQuery(movieName);
        if (langKey && LANGUAGE_MOVIE_CATALOG[langKey]) {
            const titles = LANGUAGE_MOVIE_CATALOG[langKey];
            const detailPromises = titles.map((title) =>
                fetch(`${OMDB_API_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`)
                    .then((r) => r.json())
                    .catch(() => null)
            );
            const results = await Promise.all(detailPromises);
            const validMovies = results.filter((m) => m && m.Response === "True");

            movieStatusElement.textContent = "";
            if (validMovies.length > 0) {
                renderMoviesToContainer(validMovies);
            } else {
                movieStatusElement.innerText = "404 Movies Not Found!!!";
            }
            return;
        }

        // 2. Clean extra trailing words like "telugu movie" or "full movie" if needed
        const cleanedQuery =
            movieName
                .replace(/\b(full\s+movie|movies|movie|films|film)\b/gi, "")
                .replace(/\s+/g, " ")
                .trim() || movieName;

        // Fetch general matches + current year (up to 2026+) matches in parallel
        const [mainRes, currentYearRes] = await Promise.all([
            fetch(`${OMDB_API_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(cleanedQuery)}`).then((r) =>
                r.json()
            ),
            fetch(
                `${OMDB_API_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(cleanedQuery)}&y=${CURRENT_YEAR}`
            )
                .then((r) => r.json())
                .catch(() => null)
        ]);

        let combined = [];
        const seenIds = new Set();

        if (mainRes && mainRes.Response === "True" && Array.isArray(mainRes.Search)) {
            mainRes.Search.forEach((m) => {
                if (m && m.imdbID && !seenIds.has(m.imdbID)) {
                    seenIds.add(m.imdbID);
                    combined.push(m);
                }
            });
        }

        if (currentYearRes && currentYearRes.Response === "True" && Array.isArray(currentYearRes.Search)) {
            currentYearRes.Search.forEach((m) => {
                if (m && m.imdbID && !seenIds.has(m.imdbID)) {
                    seenIds.add(m.imdbID);
                    combined.push(m);
                }
            });
        }

        // Fallback to exact title lookup (?t=) for short titles like "PK", "96", "RRR"
        if (combined.length === 0) {
            const exactRes = await fetch(
                `${OMDB_API_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(cleanedQuery)}`
            ).then((r) => r.json());
            if (exactRes && exactRes.Response === "True") {
                combined.push(exactRes);
            }
        }

        movieStatusElement.textContent = "";
        if (combined.length > 0) {
            renderMoviesToContainer(combined);
        } else {
            movieStatusElement.innerText = "404 Movies Not Found!!!";
        }
    } catch (error) {
        movieStatusElement.innerText = "404 Movies Not Found!!!";
    }
}

searchBtnElement.addEventListener("click", runMovieSearch);

movieNameElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        runMovieSearch();
    }
});
