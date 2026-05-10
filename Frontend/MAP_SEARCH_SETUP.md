# Map-Based Search Integration for TraveLoop

This implementation replaces the static city/destination selection with a dynamic, real-time Map-Based Search interface powered by Google Maps and Places APIs.

## Features

✅ **Full-Screen Interactive Map** - Google Maps with zoom, pan, and street view controls
✅ **Real-Time Location Search** - Google Places API autocomplete suggestions
✅ **Dynamic Location Fetching** - Automatically fetch details (lat/lng, address, place ID, images)
✅ **Map Markers** - Automatic marker placement on selected locations
✅ **Floating Search Bar** - Fixed position at top-left of map
✅ **Location Info Panel** - Shows place image, name, address, and coordinates
✅ **Seamless Integration** - Works with existing trip workflow

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create an API key (Credentials → Create Credentials → API Key)
5. Restrict the key to:
   - Application restrictions: HTTP referrers
   - API restrictions: Only the 3 APIs listed above

### 2. Configure Environment Variables

Create a `.env` file in the `Frontend` directory:

```bash
# Copy from .env.example
cp .env.example .env
```

Then add your Google Maps API key:

```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. Install Dependencies

```bash
npm install
```

The necessary Google Maps packages are already in package.json:
- `@googlemaps/js-api-loader`
- `@googlemaps/react-wrapper`

### 4. Run the Application

```bash
npm run dev
```

## Usage Flow

### Creating a New Trip with Map Search

1. Click "Plan New Trip" on the Dashboard
2. Fill in trip details (name, dates, budget, etc.)
3. Submit the form
4. You'll be taken to the **Map-Based Search Page**
5. Search for any real-world city or destination
6. Select a location from suggestions
7. Click "Add to Trip" to add it to your itinerary
8. Set dates for the stop in the Itinerary Builder

### Adding More Stops to an Existing Trip

1. Open a trip in the Itinerary Builder
2. Click "Add Stop"
3. You'll be taken to the Map-Based Search Page
4. Search and select a new destination
5. Click "Add to Trip"
6. The new stop will be added to your itinerary

## Location Data Structure

When you select a location, it captures:

```javascript
{
  name: "Place Name",
  latitude: 40.7128,
  longitude: -74.0060,
  address: "Full address from Google",
  placeId: "ChIJ...", // Google Places ID
  imageUrl: "URL to place photo",
  website: "Place website if available"
}
```

This data is stored in your trip and can be used for:
- Navigation and mapping
- Activity search around the location
- Budget calculations
- Itinerary planning

## Navigation Routes

| Route | Purpose |
|-------|---------|
| `/trips/new` | Create new trip |
| `/trips/:tripId/map-search` | Search and add destinations |
| `/trips/:tripId/itinerary/builder` | Build itinerary with dates |
| `/trips/:tripId/activities` | Search activities at stops |
| `/trips/:tripId/itinerary` | View final itinerary |

## API Usage & Costs

**Google Maps API pricing:**
- Maps JavaScript API: $7/1000 loads (first 1000/month free)
- Places API: $7/1000 calls (first 1000/month free)
- Geocoding API: $5/1000 calls (first 1000/month free)

**Optimization tips:**
- Use session tokens to reduce API calls
- Search is optimized with debouncing
- Session tokens reset after place selection (reduces billing)

## Troubleshooting

### Map not showing
- Check if API key is correctly added to `.env`
- Verify all 3 APIs are enabled in Google Cloud Console
- Check browser console for error messages

### Search results not appearing
- Ensure Places API is enabled
- Check for API quota limits in Google Cloud Console
- Verify the search term is at least 2 characters

### Marker not showing
- Clear browser cache
- Check browser console for errors
- Verify location has valid coordinates

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Note: Google Maps API requires HTTPS in production (except localhost for development)

## Future Enhancements

- [ ] Multiple destination search at once
- [ ] Saved favorite locations
- [ ] Distance matrix between stops
- [ ] Weather integration for dates
- [ ] Real-time flight/transport pricing
- [ ] Collaborative trip planning

## File Structure

```
Frontend/src/
├── hooks/
│   └── useGooglePlaces.js        # Google Places API hook
├── pages/
│   └── MapSearch/
│       ├── MapSearchPage.jsx     # Main page component
│       ├── MapSearchPage.css     # Page styles
│       └── components/
│           ├── MapSearchComponent.jsx  # Map with search
│           └── MapSearch.css           # Map styles
├── context/
│   └── TravelAppContext.jsx      # Added addDynamicStop function
└── App.jsx                        # Updated routing
```
