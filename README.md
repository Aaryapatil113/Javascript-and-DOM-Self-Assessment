# 🏠 Airbnb Listings Demo

A responsive web application that displays Airbnb listings using vanilla JavaScript, Bootstrap 5, and the Fetch API.

## 📋 Features

### Core Requirements
- ✅ Loads first 50 listings from JSON file using `fetch()` with `async/await`
- ✅ Displays all required information:
  - Listing name
  - Description
  - Amenities (with badges)
  - Host name and photo
  - Price per night
  - Listing thumbnail image

### 🎨 Creative Additions
1. **Real-time Search**: Search listings by name or description
2. **Dynamic Sorting**: Sort by price (low-high, high-low) or name
3. **Statistics Dashboard**: Shows total listings, average price, and unique hosts
4. **Featured Badges**: Top 10 listings marked as "Featured"
5. **Hover Animations**: Cards animate on hover for better UX
6. **Responsive Design**: Works on mobile, tablet, and desktop
7. **Error Handling**: Graceful error messages if data fails to load

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom styles with animations
- **JavaScript (ES6+)**: Async/await, arrow functions, template literals
- **Bootstrap 5.3.8**: Responsive grid and components
- **Fetch API**: Asynchronous data loading


## 💡 How It Works

1. **Data Loading**: On page load, `fetch()` retrieves `listings.json`
2. **Async Processing**: Uses `async/await` to handle the asynchronous operation
3. **DOM Manipulation**: Dynamically creates HTML cards for each listing
4. **Event Handling**: Search and sort features update the display in real-time
5. **Statistics**: Calculates average price and unique hosts on-the-fly

## 📝 JSON Structure

The code expects JSON data in this format:
```json
[
  {
    "name": "Listing Name",
    "description": "Listing description",
    "price": 100,
    "picture_url": "image-url",
    "host_name": "Host Name",
    "host_picture_url": "host-image-url",
    "amenities": ["WiFi", "Kitchen", "TV"]
  }
]
```

## 🎯 Key Features Explained

### Search Functionality
- Filters listings in real-time
- Searches both name and description fields
- Updates statistics dynamically

### Sort Options
- **Price Low-High**: Cheapest listings first
- **Price High-Low**: Most expensive first
- **Name A-Z**: Alphabetical order

### Responsive Design
- Mobile-first approach
- Cards stack on small screens
- Grid layout on larger screens

## 👨‍💻 Author

**Aarya Patil**  

## 🙏 Acknowledgments

- Based on the Airbnb Listings demo from class
- Bootstrap for responsive components
