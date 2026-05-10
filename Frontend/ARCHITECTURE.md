# TraveLoop Map Search - Technical Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ MapSearchPage.jsx                                          │ │
│  │ - Trip context and state management                        │ │
│  │ - Error handling and user feedback                         │ │
│  │ - Bottom action bar for location confirmation              │ │
│  └────────────────────────────────────────────────────────────┘ │
│               │                                    │             │
│               ▼                                    ▼             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ MapSearchComponent.jsx                                     │ │
│  │ - Full-screen Google Map                                  │ │
│  │ - Search input and suggestions dropdown                   │ │
│  │ - Location info panel                                     │ │
│  │ - Marker and info window management                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│               │                                                  │
│               ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ useGooglePlaces Hook                                       │ │
│  │ - Manages Google Maps API lifecycle                        │ │
│  │ - Handles autocomplete suggestions                         │ │
│  │ - Fetches place details                                   │ │
│  │ - Session token management                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│               │                                                  │
│               ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Google Maps JavaScript API                                │ │
│  │ - Maps JavaScript API                                     │ │
│  │ - Places API                                              │ │
│  │ - Geocoding API                                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
        │                           │
        ▼                           ▼
┌──────────────────────┐  ┌────────────────────┐
│ TravelAppContext    │  │  Local Storage     │
│ - addDynamicStop()  │  │  (Trip Data)       │
│ - trips state       │  └────────────────────┘
└──────────────────────┘
```

---

## Data Flow

### 1. User Search Interaction
```javascript
User types "Paris"
    ↓
MapSearchComponent: handleSearchChange()
    ↓
useGooglePlaces: searchPlaces("Paris")
    ↓
Google Places API: getPlacePredictions()
    ↓
Returns: [{ main_text: "Paris", description: "...", place_id: "ChIJ..." }, ...]
    ↓
MapSearchComponent: renders suggestions dropdown
    ↓
User clicks suggestion
```

### 2. Place Selection & Details
```javascript
User clicks prediction
    ↓
MapSearchComponent: handleSelectPrediction()
    ↓
useGooglePlaces: getPlaceDetails(placeId)
    ↓
Google Places Service: getDetails(request)
    ↓
Returns: {
  name, address, geometry (lat/lng), 
  place_id, photos, website, opening_hours
}
    ↓
MapSearchComponent: updateMapWithLocation()
    ↓
- Center map to coordinates
- Add marker with DROP animation
- Update info panel
- Call onLocationSelected callback
    ↓
MapSearchPage receives location in state
    ↓
Info panel and "Add to Trip" button appear
```

### 3. Trip Integration
```javascript
User clicks "Add to Trip"
    ↓
MapSearchPage: handleAddLocation()
    ↓
TravelAppContext: addDynamicStop(tripId, locationData)
    ↓
Creates stop object:
{
  id: "stop-xxx",
  placeId: "ChIJ...",
  city: "Paris",
  address: "...",
  latitude: 48.8584,
  longitude: 2.2945,
  imageUrl: "https://...",
  startDate: "",
  endDate: "",
  activities: []
}
    ↓
Updates trip.destinations array
    ↓
Saves to localStorage
    ↓
Navigate to itinerary builder
```

---

## Component Hierarchy

```
App
├── Routes
│   ├── /trips/new → TripFormPage
│   │   └── Creates trip
│   │   └── Navigate to /trips/:tripId/map-search
│   │
│   └── /trips/:tripId/map-search → MapSearchPage
│       ├── Props from route: tripId
│       ├── State: selectedLocation, isAdding, error
│       │
│       └── MapSearchComponent (child)
│           ├── useGooglePlaces hook
│           ├── Props: onLocationSelected, onError
│           ├── State: searchInput, predictions, mapInstance
│           │
│           ├── Search Bar
│           │   ├── Input field
│           │   └── Suggestions Dropdown
│           │
│           ├── Google Maps Canvas
│           │   ├── Map controls
│           │   ├── Marker
│           │   └── Info Window
│           │
│           └── Info Panel (conditional)
│               ├── Place photo
│               └── Details (name, address, coords)
│
├── MapSearchPage
│   ├── Top Action Bar
│   │   └── Back button
│   │
├── Bottom Action Bar (conditional)
│   ├── Selected info display
│   └── "Add to Trip" button
│
└── Error Banner (conditional)
    └── Error message + Close button
```

---

## Hook: useGooglePlaces

### Responsibilities
- Load Google Maps API dynamically
- Manage Places API service instances
- Generate and manage session tokens
- Handle autocomplete predictions
- Fetch place details

### Key Functions

```javascript
// Initialize on mount
useEffect(() => {
  // Load Google Maps script
  // Create AutocompleteSessionToken
  // Set isLoaded state
})

// Search for place predictions
searchPlaces(input): Promise<predictions>
  - Call AutocompleteService
  - Use session token
  - Return predictions array

// Get detailed place information
getPlaceDetails(placeId): Promise<details>
  - Call PlacesService.getDetails()
  - Extract: name, address, lat/lng, photos
  - Generate new session token
  - Return formatted details
```

### Session Token Optimization

Session tokens batch autocomplete + details calls together:
```
Normal API Calls:
- 5 autocomplete predictions = 5 API calls
- 1 place details = 1 API call
- Total: 6 calls × $7/1000 = 0.042 cents per user

With Session Tokens:
- 5 autocomplete + 1 details = 1 combined call
- New session = 1 call
- Total: 2 calls × $7/1000 = 0.014 cents per user
- Savings: ~67%
```

---

## Component: MapSearchComponent

### Props
```javascript
{
  onLocationSelected: (location) => void,
  onError: (errorMessage) => void,
  selectedLocation: Location | null
}
```

### State
```javascript
{
  searchInput: string,
  predictions: GooglePrediction[],
  isSearching: boolean,
  showSuggestions: boolean
}
```

### Key Effects

1. **Map Initialization**
   ```javascript
   useEffect(() => {
     if (!isLoaded || !mapRef.current) return
     
     const map = new google.maps.Map(mapRef.current, options)
     mapInstanceRef.current = map
     
     // Add listeners, return cleanup
   }, [isLoaded])
   ```

2. **Search Handling**
   ```javascript
   Debounced in handleSearchChange():
   - If input.length < 2: clear predictions
   - Call searchPlaces(input)
   - Update predictions state
   - Handle errors
   ```

3. **Location Markers**
   - Remove old marker if exists
   - Create new marker at coordinates
   - Add DROP animation
   - Create info window with place name
   - Add click listener to show info

---

## Component: MapSearchPage

### Responsibilities
- Manage selected location state
- Handle trip integration
- Provide error feedback
- Navigate between pages
- Manage loading states

### Key Methods

```javascript
handleLocationSelected(location)
  - Update selectedLocation state
  - Clear errors
  - Show info panel

handleAddLocation()
  - Validate location selected
  - Call addDynamicStop(tripId, location)
  - Navigate to itinerary builder
  - Handle errors

handleSearchError(errorMessage)
  - Update error state
  - Display error banner
```

---

## Context Update: TravelAppContext

### New Function: addDynamicStop

```javascript
addDynamicStop(tripId, stopInput) {
  // stopInput from map search:
  {
    placeId: string,
    name: string,
    latitude: number,
    longitude: number,
    address: string,
    imageUrl: string,
    website: string
  }
  
  // Create stop object with default values
  // Add to trip.destinations
  // Update trip.destinationSummary
  // Save to localStorage
}
```

### Why Separate Function?

Old `addStop()` requires cityId from catalog.
New `addDynamicStop()` doesn't require catalog lookup.

This allows:
- ✅ Dynamic locations not in catalog
- ✅ Precise coordinates from Google
- ✅ Real-world addresses
- ✅ Place photos and details

---

## CSS Architecture

### MapSearch.css (Map Component Styles)
```css
.map-search-container
├── .map-canvas
│   └── Flex container for full height
├── .map-search-bar-wrapper
│   └── Absolute positioned, top-left, z-index 100
├── .search-input-group
│   ├── .search-icon
│   ├── .search-input
│   └── .clear-button
├── .suggestions-dropdown
│   ├── .suggestion-item
│   │   ├── .location-icon
│   │   └── .suggestion-content
├── .map-info-panel
│   ├── .info-image
│   └── .info-details
└── .loading-spinner
```

### MapSearchPage.css (Page Styles)
```css
.map-search-page
├── .map-action-bar (top-right)
│   └── .map-action-button
├── .map-action-bar-bottom (bottom)
│   ├── .action-bar-content
│   ├── .selected-info
│   └── .add-button
└── .error-banner (top-right)
    └── .error-content
```

### Responsive Strategy
- Base: Desktop (500px+ width)
- Tablet: 768px breakpoint (adjusted spacing)
- Mobile: 600px breakpoint (full width, stacked layout)

---

## Error Handling Strategy

### Error Types

1. **API Initialization Errors**
   ```javascript
   - Script load failed
   - API key invalid/missing
   - CORS issues
   
   Handling: Display .map-error overlay
   User sees: "Failed to load Google Maps API"
   ```

2. **Search Errors**
   ```javascript
   - No results found
   - API quota exceeded
   - Network timeout
   
   Handling: Show in console, clear predictions
   User sees: Empty dropdown, can retry
   ```

3. **Place Details Errors**
   ```javascript
   - Place no longer exists
   - API service error
   
   Handling: Display error banner
   User can: Close error, try another location
   ```

4. **Trip Integration Errors**
   ```javascript
   - Trip not found
   - Context error
   
   Handling: Show error in page, disable button
   User can: Navigate back to trips
   ```

---

## Performance Optimizations

### 1. Lazy Loading
```javascript
// Google Maps API loaded on-demand
const script = document.createElement('script')
script.async = true
script.defer = true
document.head.appendChild(script)
```

### 2. Session Tokens
- Reduces API calls by ~67%
- Auto-generate new token after each selection

### 3. Debounced Search
- Autocomplete calls wait 300ms after typing stops
- Prevents excessive API requests

### 4. Memoization (Future)
```javascript
// Could add:
const predictions = useMemo(() => ...)
const mapOptions = useMemo(() => ...)
```

### 5. Marker Reuse
```javascript
// Single marker instance
if (markerRef.current) {
  markerRef.current.setMap(null) // Remove old
}
markerRef.current = new Marker(...) // Add new
```

---

## Testing Strategy

### Unit Tests (Jest)
```javascript
// useGooglePlaces.js
- Test searchPlaces() returns predictions
- Test getPlaceDetails() extracts correct fields
- Test session token generation

// MapSearchComponent.jsx
- Test handleSearchChange() debouncing
- Test handleSelectPrediction() flow
- Test marker placement

// MapSearchPage.jsx
- Test handleAddLocation() integration
- Test error handling
- Test navigation on success
```

### Integration Tests
```javascript
1. Create trip → Map search → Add location → Check trip
2. Existing trip → Add stop → Map search → Check stop list
3. Error recovery → API error → Retry works
4. Mobile flow → Mobile viewport → Touch interactions
```

### E2E Tests (Cypress/Playwright)
```javascript
1. Search city "Paris"
2. Click first result
3. Verify marker on map
4. Click "Add to Trip"
5. Verify location in trip
6. Verify can navigate to dates editor
```

---

## Future Enhancements

### Phase 2: Activity Integration
```javascript
// Around selected location, show activities
GET /api/activities?lat=48.8584&lng=2.2945&radius=15km
```

### Phase 3: Distance Matrix
```javascript
// Calculate distances between stops
GET /api/distance-matrix?origins=A,B,C&destinations=D,E,F
```

### Phase 4: Advanced Search
```javascript
// Filter locations by:
- Budget range
- Climate/weather
- Attractions type
- Tourist rating
```

### Phase 5: Collaborative Planning
```javascript
// Multiple users:
- Share location suggestions
- Vote on destinations
- Comment on places
```

---

## Security Considerations

### API Key Security
```
✓ Never expose API key in client code
✓ Use .env with VITE_ prefix (visible to browser)
✓ Restrict key to:
  - Domain/referrer: yourdomain.com
  - APIs: Only Maps, Places, Geocoding
  - Platform: Web (JavaScript)
```

### Data Privacy
```
✓ Location data stored locally
✓ No sensitive info sent to backend
✓ Images cached by browser
✓ Place IDs are public data
```

### Input Validation
```
✓ Search input sanitized before API call
✓ Coordinates validated as numbers
✓ No user input injected into HTML
```

---

## Maintenance & Monitoring

### Key Metrics to Track
```
1. API Usage (Google Cloud Console)
   - Calls per day
   - Cost per day
   - Quota utilization

2. User Metrics
   - Searches per user
   - Locations added per trip
   - Success rate

3. Performance
   - Map load time
   - Search response time
   - Error rate
```

### Monitoring Setup
```bash
# Google Cloud Monitoring
- Set up alerts for quota > 80%
- Email notification on API errors
- Dashboard for usage trends
```

---

## Deployment Checklist

- [ ] API key configured in production .env
- [ ] Google Cloud project has billing enabled
- [ ] API key domain restricted to production domain
- [ ] All 3 APIs enabled (Maps, Places, Geocoding)
- [ ] Error logging configured
- [ ] API quota alerts set
- [ ] Mobile testing completed
- [ ] Browser compatibility tested
- [ ] Performance tested on slow network
- [ ] Documentation updated
- [ ] Team trained on new feature

---

## References

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Session Tokens](https://developers.google.com/maps/documentation/places/web-service/session-tokens)
- [Pricing Calculator](https://cloud.google.com/products/calculator)

---

**Document Version**: 1.0
**Last Updated**: 2024
**Status**: Production Ready ✅
