# Movie Search Engine — Phase 2

A responsive frontend Movie Search Engine built with **HTML5**, **CSS3**, **Vanilla ES6+ JavaScript**, the **OMDb REST API**, and browser **localStorage**.

---

## Project Structure

```text
Movie-Search-Engine/
├── index.html       # Semantic HTML5 layout (Header, Search, Results, Favorites, Watchlist, History, Modal)
├── movie.css        # CSS3 variables, Light/Dark themes, red-bordered movie cards, responsive grid
├── movie.js         # ES6+ application logic, OMDb API integration, debounce, sorting, localStorage
├── background.jpg   # Cinema background artwork
└── README.md        # Project documentation and setup instructions
```

---

## Implemented Features

### Core Features (Preserved)
- **Movie Title Search:** Search movies, TV series, and episodes from the OMDb API.
- **Release Year & Content-Type Filters:** Narrow searches by 4-digit release year and type (`movie`, `series`, `episode`).
- **Red-Bordered Movie Cards:** Displays poster (with SVG fallback when unavailable), title, release year, and type.
- **Movie Details Modal:** Displays full plot, IMDb rating, runtime, content rating, genre, director, cast, release date, language, and awards.
- **My Favorites:** Save and remove favorite movies with `localStorage` persistence (`mse_favorites`).
- **Load More Pagination:** Fetch additional result pages without duplicate entries.

### Phase 2 Upgrades
1. **Live Search Suggestions:**
   - Displays matching movie thumbnails, titles, and years after typing 3+ characters.
   - Uses a `350ms` debounce and `AbortController` + request sequence tracking to prevent outdated responses from overwriting newer suggestions.
   - Full keyboard navigation (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`) and click-to-select.
2. **Recent Search History:**
   - Stores up to 10 unique recent successful searches in `localStorage` (`mse_recent_searches`).
   - Accessible via quick chips under the search bar and a dedicated **Recent Searches** tab with one-click re-search and **Clear History**.
3. **My Watchlist:**
   - Save movies to watch later in `localStorage` (`mse_watchlist`), deduplicated by `imdbID`.
   - Toggle **Mark as Watched** / **Mark as Unwatched** and filter between **All**, **To Watch**, and **Watched** views.
   - Synchronized across search results, Favorites, Watchlist, and the Movie Details Modal.
4. **Movie Sorting:**
   - Instant client-side sorting of loaded search results (**Default**, **Title: A–Z**, **Title: Z–A**, **Release Year: Newest First**, **Release Year: Oldest First**) preserved across **Load More** pagination.
5. **Dark and Light Mode:**
   - CSS-variable powered theme toggle in the header (`mse_theme` in `localStorage`), defaulting to the original cinema light theme.
6. **Share Movie:**
   - Generates a clean `?movie=ttXXXXXXX` deep link (without exposing API keys), supports the Web Share API (`navigator.share`) with automatic clipboard fallback, and opens the Movie Details Modal automatically when visiting a shared URL.
7. **Watch Movie Trailer:**
   - **Find Trailer on YouTube** button inside the Movie Details Modal opens a safely URL-encoded YouTube trailer search in a new tab.
8. **Responsive Design:**
   - Adapts cleanly across Desktop (4-column grid), Tablet (2–3 columns), and Mobile (1-column stacked controls with touch-friendly buttons and no horizontal overflow).

---

## How to Run Locally

### Option 1: VS Code Live Server (Recommended)
1. Open the `MOVIE SEARCH ENGINE` folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey) if not already installed.
3. Right-click `index.html` and select **Open with Live Server**.
4. Your browser will open the application at `http://127.0.0.1:5500` (or `http://localhost:5500`).

### Option 2: Direct Browser Open
- Double-click `index.html` to open it directly in any modern desktop or mobile browser.

