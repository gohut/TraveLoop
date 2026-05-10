# Quick Start: Map-Based Search Setup

## 5-Minute Setup

### Step 1: Get Google Maps API Key (2 min)
1. Visit: https://console.cloud.google.com/
2. Create new project
3. Enable these APIs:
   - Maps JavaScript API
   - Places API  
   - Geocoding API
4. Go to Credentials → Create API Key
5. Copy the key

### Step 2: Add API Key to Project (1 min)
1. Open `Frontend/.env`
2. Add: `VITE_GOOGLE_MAPS_API_KEY=your_key_here`
3. Save file

### Step 3: Start Development (1 min)
```bash
cd Frontend
npm install  # if needed
npm run dev
```

### Step 4: Test It Out (1 min)
1. Go to Dashboard
2. Click "Plan New Trip"
3. Fill trip details
4. You'll be taken to the Map Search page
5. Search for a city like "Paris" or "Tokyo"
6. Click a result and add it to your trip

## What Changed?

| Old Flow | New Flow |
|----------|----------|
| Dashboard → Create Trip → City List | Dashboard → Create Trip → **Map Search** |
| Static city catalog | Real-time location search |
| Limited destination options | Any real-world location |
| Manual entry | One-click place selection |

## Key Features

- 🗺️ Full-screen interactive map
- 🔍 Real-time autocomplete search
- 📍 Automatic marker placement
- 🖼️ Place photos
- 📧 Full address and coordinates
- ⚡ Fast and responsive

## Files Created/Modified

### New Files:
- `Frontend/src/hooks/useGooglePlaces.js` - Places API integration
- `Frontend/src/pages/MapSearch/MapSearchPage.jsx` - Main page
- `Frontend/src/pages/MapSearch/MapSearchPage.css` - Page styles
- `Frontend/src/pages/MapSearch/components/MapSearchComponent.jsx` - Map component
- `Frontend/src/pages/MapSearch/components/MapSearch.css` - Map styles
- `Frontend/.env.example` - Environment template

### Modified Files:
- `Frontend/src/App.jsx` - Added new route
- `Frontend/src/context/TravelAppContext.jsx` - Added `addDynamicStop` function
- `Frontend/src/pages/TripForm/TripFormPage.jsx` - Navigate to map after trip creation
- `Frontend/src/pages/ItineraryBuilder/ItineraryBuilderPage.jsx` - Updated "Add Stop" button

## Troubleshooting

**Issue**: Map doesn't load
- Solution: Check `.env` file has correct API key

**Issue**: Search doesn't work
- Solution: Verify Places API is enabled in Google Cloud Console

**Issue**: Markers not showing
- Solution: Check browser console for errors, refresh page

## Next Steps

After setup, you can:
- ✅ Remove old `CitySearchPage` routes if desired
- ✅ Remove hardcoded city catalog usage
- ✅ Update other pages to use map search
- ✅ Add activity search around selected locations

## Support

For issues:
1. Check Google Cloud Console quotas
2. Review browser console errors
3. Verify API key restrictions
4. Check network tab for failed API calls
