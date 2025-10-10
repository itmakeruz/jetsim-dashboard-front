# Image URL Configuration

## Overview

All image URLs in the project are now dynamic and configurable through environment variables. This allows you to easily change the base URL for images without modifying the code.

## Environment Variables

### Required Variables

```env
# API Configuration
VITE_API_BASE_URL=https://api.happytel.uz/api

# Storage Configuration (Optional)
# If not provided, it will automatically remove /api from VITE_API_BASE_URL
VITE_STORAGE_BASE_URL=https://api.happytel.uz
```

### Configuration Examples

#### Development Environment

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STORAGE_BASE_URL=http://localhost:8000
```

#### Production Environment

```env
VITE_API_BASE_URL=https://api.happytel.uz/api
VITE_STORAGE_BASE_URL=https://api.happytel.uz
```

#### Alternative Storage Server

```env
VITE_API_BASE_URL=https://api.happytel.uz/api
VITE_STORAGE_BASE_URL=https://crm.uztu.uz
```

## How It Works

### Utility Functions

The project now uses utility functions from `src/utils/imageUtils.js`:

- `getImageUrl(imagePath)` - General image URL function
- `getPassportImageUrl(passportPath)` - Specific for passport images
- `getNewsPhotoUrl(photoPath)` - Specific for news photos

### Usage Examples

```javascript
import { getImageUrl, getPassportImageUrl } from "@/utils/imageUtils.js";

// General image
const imageUrl = getImageUrl("uploads/passport.jpg");
// Result: https://api.happytel.uz/storage/uploads/passport.jpg

// Passport image
const passportUrl = getPassportImageUrl("passports/client_123.jpg");
// Result: https://api.happytel.uz/storage/passports/client_123.jpg
```

### Important Note

The utility automatically handles the `/api` suffix:

- If `VITE_API_BASE_URL=https://api.happytel.uz/api`
- The storage URL becomes `https://api.happytel.uz/storage/` (not `/api/storage/`)
- This prevents double `/api` in the URL

## Updated Files

The following files have been updated to use dynamic image URLs:

1. `src/components/simOrders/PassportModal.jsx`
2. `src/pages/site/news/pages/NewsSingle.jsx`
3. `src/pages/reference/clients/pages/SingleClientPage.jsx`
4. `src/pages/reference/clients/components/ClientsTbody.jsx`
5. `src/pages/reference/clients/pages/SingleClientPageEdit.jsx`
6. `src/pages/settings/users/components/UsersTbody.jsx`
7. `src/pages/warehouse/arrival/components/ArrivalTbody.jsx`
8. `src/pages/reference/regionGroups/components/RegionsGroupForm.jsx`
9. `src/pages/reference/simCards/index.jsx`

## Benefits

- ✅ Centralized configuration
- ✅ Easy environment switching
- ✅ No hardcoded URLs in code
- ✅ Consistent image handling across the app
- ✅ Easy to maintain and update

## Setup Instructions

1. Create a `.env` file in your project root
2. Add the required environment variables
3. Restart your development server
4. All images will now use the configured base URL
