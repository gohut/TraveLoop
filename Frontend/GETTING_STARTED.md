# 🚀 GETTING STARTED WITH MAP SEARCH

**You're 3 minutes away from having a fully working map search feature!**

## What You Need To Do

### Step 1: Get Google Maps API Key (1 minute)

Go to: **https://console.cloud.google.com/**

1. Create a new project (if you don't have one)
2. **Enable 3 APIs**:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Click **Credentials** on the left
4. Click **Create Credentials** → **API Key**
5. **Copy the API key** (it's a long text starting with `AIza...`)

### Step 2: Add Key to Your App (1 minute)

In your terminal, go to the Frontend folder:
```bash
cd Frontend
```

Open the file `.env` and add your API key:
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Save the file (Ctrl+S).

### Step 3: Restart Dev Server (1 minute)

In your terminal:
```bash
Ctrl+C  (to stop the current dev server)
npm run dev
```

Then open: **http://localhost:5173/**

## Test It!

1. Click **"Plan New Trip"** button on the Dashboard
2. Fill in: Trip name, start date, end date
3. Click **"Create Trip"** or **"Next"**
4. ✅ You should see a **map** with a search bar!
5. Try searching for "Paris", "Tokyo", or "New York"
6. Click a result and it will be added to your trip!

## 🎉 That's It!

You now have a dynamic map-based search feature!

---

## Need Help?

- **Still can't find the API key?**  
  → See `SETUP_MAP_SEARCH.md`

- **Dev server won't restart?**  
  → Try: Clear browser cache (Ctrl+Shift+Delete), then refresh

- **Map still not showing?**  
  → Make sure you copied the FULL API key with no extra spaces

- **Want more details?**  
  → Read `QUICK_START.md`

---

## What Changed?

**Before**: "Plan New Trip" → Trip Form → City List (8 hardcoded cities)

**Now**: "Plan New Trip" → Trip Form → **MAP SEARCH** (search ANY location!)

That's the power of map-based destination search! 🗺️
