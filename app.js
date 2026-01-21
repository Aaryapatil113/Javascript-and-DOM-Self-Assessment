// ============================================
// GLOBAL VARIABLES
// ============================================
let allListings = [];
let filteredListings = [];

// ============================================
// INITIALIZE APP
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
    loadListings();
    setupEventListeners();
});

// ============================================
// FETCH LISTINGS FROM JSON
// ============================================
async function loadListings() {
    try {
        showLoading(true);
        hideError();

        // Fetch the JSON file - UPDATED TO CORRECT FILENAME
        const response = await fetch('airbnb_sf_listings_500.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Get first 50 listings
        allListings = data.slice(0, 50);
        filteredListings = [...allListings];
        
        console.log(`Loaded ${allListings.length} listings`);
        
        // Display listings and stats
        displayListings(filteredListings);
        updateStats(filteredListings);
        
        showLoading(false);
        
    } catch (error) {
        console.error('Error loading listings:', error);
        showError('Failed to load listings. Error: ' + error.message);
        showLoading(false);
    }
}

// ============================================
// DISPLAY LISTINGS ON PAGE
// ============================================
function displayListings(listings) {
    const container = document.getElementById('listingsContainer');
    const noResults = document.getElementById('noResults');
    
    container.innerHTML = '';
    
    if (listings.length === 0) {
        noResults.classList.remove('d-none');
        return;
    } else {
        noResults.classList.add('d-none');
    }
    
    listings.forEach((listing, index) => {
        const card = createListingCard(listing, index);
        container.appendChild(card);
    });
}

// ============================================
// CREATE INDIVIDUAL LISTING CARD
// ============================================
function createListingCard(listing, index) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    
    // Extract data based on JSON structure
    const name = listing.name || 'Untitled Listing';
    const description = listing.description || 'No description available';
    const price = cleanPrice(listing.price);
    const thumbnail = listing.picture_url || 'https://via.placeholder.com/400x300?text=No+Image';
    
    // Host information
    const hostName = listing.host_name || 'Anonymous Host';
    const hostPhoto = listing.host_picture_url || 'https://via.placeholder.com/50?text=Host';
    
    // Amenities - parse the JSON string
    const amenities = parseAmenities(listing.amenities);
    
    // Neighborhood info
    const neighborhood = listing.neighbourhood_cleansed || listing.neighbourhood || 'San Francisco';
    
    // Review score
    const rating = listing.review_scores_rating || 0;
    
    col.innerHTML = `
        <div class="listing-card">
            <div style="position: relative;">
                <img src="${thumbnail}" 
                     class="listing-image" 
                     alt="${escapeHtml(name)}"
                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                ${index < 10 ? '<span class="featured-badge">⭐ Featured</span>' : ''}
            </div>
            
            <div class="listing-body">
                <h5 class="listing-title">${escapeHtml(name)}</h5>
                <p class="listing-description">${cleanDescription(description)}</p>
                
                <div class="mb-2">
                    <span class="badge bg-info">📍 ${escapeHtml(neighborhood)}</span>
                    ${rating > 0 ? `<span class="badge bg-warning">⭐ ${rating.toFixed(2)}</span>` : ''}
                </div>
                
                <div class="host-section">
                    <img src="${hostPhoto}" 
                         class="host-photo" 
                         alt="${escapeHtml(hostName)}"
                         onerror="this.src='https://via.placeholder.com/50?text=Host'">
                    <div>
                        <div class="host-name">${escapeHtml(hostName)}</div>
                        <small class="text-muted">Host</small>
                    </div>
                </div>
                
                <div class="price-section">
                    <span class="price-tag">$${price}/night</span>
                </div>
                
                <div class="amenities-section">
                    <div class="amenities-title">Amenities:</div>
                    <div class="amenities-list">
                        ${displayAmenities(amenities)}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Clean price string
function cleanPrice(priceString) {
    if (!priceString) return 0;
    const cleaned = priceString.replace(/[$,]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.round(num);
}

// Parse amenities from JSON string
function parseAmenities(amenitiesString) {
    if (!amenitiesString) return [];
    
    try {
        const cleaned = amenitiesString
            .replace(/^\[|\]$/g, '')
            .replace(/\\u[\dA-F]{4}/gi, '')
            .split('", "')
            .map(item => item.replace(/^"|"$/g, '').trim());
        
        return cleaned;
    } catch (e) {
        console.error('Error parsing amenities:', e);
        return [];
    }
}

// Display amenities as badges
function displayAmenities(amenities) {
    if (!amenities || amenities.length === 0) {
        return '<span class="text-muted small">No amenities listed</span>';
    }
    
    const displayedAmenities = amenities.slice(0, 5);
    const remaining = amenities.length - 5;
    
    let html = displayedAmenities.map(amenity => 
        `<span class="amenity-badge">${escapeHtml(amenity)}</span>`
    ).join('');
    
    if (remaining > 0) {
        html += `<span class="amenity-badge">+${remaining} more</span>`;
    }
    
    return html;
}

// Clean HTML from description
function cleanDescription(description) {
    if (!description) return 'No description available';
    
    const cleaned = description.replace(/<[^>]*>/g, ' ')
                              .replace(/\s+/g, ' ')
                              .trim();
    
    return cleaned.length > 150 
        ? escapeHtml(cleaned.substring(0, 150)) + '...'
        : escapeHtml(cleaned);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// STATS CALCULATION
// ============================================
function updateStats(listings) {
    document.getElementById('totalListings').textContent = listings.length;
    
    const prices = listings.map(l => cleanPrice(l.price));
    const avgPrice = prices.length > 0 
        ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
        : 0;
    document.getElementById('avgPrice').textContent = `$${avgPrice}`;
    
    const uniqueHosts = new Set(
        listings.map(l => l.host_id).filter(id => id)
    );
    document.getElementById('totalHosts').textContent = uniqueHosts.size;
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', handleSort);
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredListings = [...allListings];
    } else {
        filteredListings = allListings.filter(listing => {
            const name = (listing.name || '').toLowerCase();
            const description = (listing.description || '').toLowerCase();
            const neighborhood = (listing.neighbourhood_cleansed || '').toLowerCase();
            
            return name.includes(searchTerm) || 
                   description.includes(searchTerm) ||
                   neighborhood.includes(searchTerm);
        });
    }
    
    displayListings(filteredListings);
    updateStats(filteredListings);
}

// ============================================
// SORT FUNCTIONALITY
// ============================================
function handleSort(e) {
    const sortValue = e.target.value;
    
    let sorted = [...filteredListings];
    
    switch(sortValue) {
        case 'price-low':
            sorted.sort((a, b) => cleanPrice(a.price) - cleanPrice(b.price));
            break;
        case 'price-high':
            sorted.sort((a, b) => cleanPrice(b.price) - cleanPrice(a.price));
            break;
        case 'name':
            sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        default:
            sorted = [...filteredListings];
    }
    
    displayListings(sorted);
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================
function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('d-none');
}

function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.classList.add('d-none');
}
