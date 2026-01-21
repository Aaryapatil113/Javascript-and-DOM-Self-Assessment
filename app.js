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

        // Fetch the JSON file
        // IMPORTANT: Change 'listings.json' to match your actual file name
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
        showError('Failed to load listings. Please check the console for details.');
        showLoading(false);
    }
}

// ============================================
// DISPLAY LISTINGS ON PAGE
// ============================================
function displayListings(listings) {
    const container = document.getElementById('listingsContainer');
    const noResults = document.getElementById('noResults');
    
    // Clear container
    container.innerHTML = '';
    
    // Check if no results
    if (listings.length === 0) {
        noResults.classList.remove('d-none');
        return;
    } else {
        noResults.classList.add('d-none');
    }
    
    // Create cards for each listing
    listings.forEach((listing, index) => {
        const card = createListingCard(listing, index);
        container.appendChild(card);
    });
}

// ============================================
// CREATE INDIVIDUAL LISTING CARD
// ============================================
function createListingCard(listing, index) {
    // Create column wrapper
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    
    // Extract data with fallbacks
    // IMPORTANT: Adjust these property names based on your JSON structure
    const name = listing.name || listing.title || 'Untitled Listing';
    const description = listing.description || listing.summary || 'No description available';
    const price = listing.price || listing.price?.amount || 0;
    const thumbnail = listing.picture_url || listing.thumbnail_url || listing.medium_url || 'https://via.placeholder.com/400x300?text=No+Image';
    
    // Host information
    const hostName = listing.host?.host_name || listing.host_name || 'Anonymous Host';
    const hostPhoto = listing.host?.host_picture_url || listing.host_picture_url || listing.host_thumbnail_url || 'https://via.placeholder.com/50?text=Host';
    
    // Amenities
    const amenities = listing.amenities || [];
    
    // Create card HTML
    col.innerHTML = `
        <div class="listing-card">
            <div style="position: relative;">
                <img src="${thumbnail}" 
                     class="listing-image" 
                     alt="${name}"
                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                ${index < 10 ? '<span class="featured-badge">⭐ Featured</span>' : ''}
            </div>
            
            <div class="listing-body">
                <h5 class="listing-title">${name}</h5>
                <p class="listing-description">${description}</p>
                
                <div class="host-section">
                    <img src="${hostPhoto}" 
                         class="host-photo" 
                         alt="${hostName}"
                         onerror="this.src='https://via.placeholder.com/50?text=Host'">
                    <div>
                        <div class="host-name">${hostName}</div>
                        <small class="text-muted">Host</
