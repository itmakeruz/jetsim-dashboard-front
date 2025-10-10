# API Integration Guide - Happytel Admin

## Overview

This guide documents the API integration for the Happytel Admin dashboard, based on the actual API endpoints from `api-data.json`.

## Base Configuration

- **Base URL**: `https://crm.uztu.uz/api`
- **Authentication**: Bearer Token
- **Content-Type**: `application/json` (multipart/form-data for file uploads)

## Authentication

### Login

```javascript
POST /api/login
Content-Type: application/json

{
  "phone": "+998983101010",
  "password": "Laziz0890$@!"
}
```

### Logout

```javascript
POST /api/logout
Authorization: Bearer {token}
```

### Get Profile

```javascript
GET /api/me
Authorization: Bearer {token}
```

## Dashboard API

_Note: No specific dashboard endpoints found in API. Using inventory stats as alternative._

```javascript
// Get inventory stats (used for dashboard)
GET / api / inventories / { id } / stats;

// Get inventory products (used for top products)
GET / api / inventories / { id } / products;
```

## Warehouse Management

### Inventory

```javascript
// List all inventories
GET /api/inventories

// Create inventory
POST /api/inventories

// Get inventory by ID
GET /api/inventories/{id}

// Update inventory
PUT /api/inventories/{id}

// Delete inventory
DELETE /api/inventories/{id}

// Get inventory products
GET /api/inventories/{id}/products?product_group_id=1&per_page=10

// Get inventory stats
GET /api/inventories/{id}/stats

// Get missing products
GET /api/inventories/{id}/missing-products

// Complete step 1
POST /api/inventories/{id}/complete-step1
{
  "products": [
    {
      "product_id": 1,
      "actual_quantity": 95
    }
  ]
}
```

### Transfers

```javascript
// List all transfers
GET / api / transfers;

// Create transfer
POST / api / transfers;

// Get transfer by ID
GET / api / transfers / { id };

// Update transfer
PUT / api / transfers / { id };

// Delete transfer
DELETE / api / transfers / { id };

// Get branch products for transfer
GET / api / transfers / branch / { branchId } / products;
```

### Write-offs

```javascript
// List all write-offs
GET / api / write - offs;

// Create write-off
POST / api / write - offs;

// Get write-off by ID
GET / api / write - offs / { id };

// Update write-off
PUT / api / write - offs / { id };

// Delete write-off
DELETE / api / write - offs / { id };

// Get branch products for write-off
GET / api / write - offs / branch / { branchId } / products;
```

### Revaluations

```javascript
// List all revaluations
GET /api/revaluations

// Create revaluation
POST /api/revaluations

// Get revaluation by ID
GET /api/revaluations/{id}

// Update revaluation
PUT /api/revaluations/{id}

// Delete revaluation
DELETE /api/revaluations/{id}

// Get revaluation products
GET /api/revaluations/{id}/products?product_group_id=1&search=Product&per_page=10
```

## Reference Tables

### Regions

```javascript
// List all regions
GET /api/regions

// Create region (multipart/form-data)
POST /api/regions
Content-Type: multipart/form-data
{
  "name": "Москва",
  "selecting": "1",
  "status": "active",
  "img": [file]
}

// Get region by ID
GET /api/regions/{id}

// Update region (multipart/form-data)
PUT /api/regions/{id}

// Delete region
DELETE /api/regions/{id}
```

### Clients

```javascript
// List all clients
GET /api/clients

// Create client (multipart/form-data)
POST /api/clients
Content-Type: multipart/form-data

// Get client by ID
GET /api/clients/{id}

// Update client (multipart/form-data)
PUT /api/clients/{id}

// Delete client
DELETE /api/clients/{id}
```

### Client Statuses

```javascript
// List all client statuses
GET /api/client-statuses

// Create client status
POST /api/client-statuses
{
  "name": "VIP"
}

// Get client status by ID
GET /api/client-statuses/{id}

// Update client status
PUT /api/client-statuses/{id}

// Delete client status
DELETE /api/client-statuses/{id}
```

### Products

```javascript
// List all products
GET / api / products;

// Create product
POST / api / products;

// Get product by ID
GET / api / products / { id };

// Update product
PUT / api / products / { id };

// Delete product
DELETE / api / products / { id };
```

### Product Groups

```javascript
// List all product groups
GET / api / product - groups;

// Create product group
POST / api / product - groups;

// Update product group
PUT / api / product - groups / { id };

// Delete product group
DELETE / api / product - groups / { id };
```

### Product Statuses

```javascript
// List all product statuses
GET / api / product - statuses;
```

### Suppliers

```javascript
// List all suppliers
GET / api / suppliers;

// Create supplier
POST / api / suppliers;

// Update supplier
PUT / api / suppliers / { id };

// Delete supplier
DELETE / api / suppliers / { id };
```

### Tariffs

```javascript
// List all tariffs
GET / api / tariffs;

// Create tariff
POST / api / tariffs;

// Update tariff
PUT / api / tariffs / { id };

// Delete tariff
DELETE / api / tariffs / { id };
```

### Region Groups

```javascript
// List all region groups
GET / api / region - groups;

// Create region group
POST / api / region - groups;

// Update region group
PUT / api / region - groups / { id };

// Delete region group
DELETE / api / region - groups / { id };
```

### Sim Cards

```javascript
// List all sim cards
GET / api / sim - cards;

// Create sim card
POST / api / sim - cards;

// Update sim card
PUT / api / sim - cards / { id };

// Delete sim card
DELETE / api / sim - cards / { id };
```

### Order Statuses

```javascript
// List all order statuses
GET / api / order - statuses;

// Create order status
POST / api / order - statuses;

// Update order status
PUT / api / order - statuses / { id };

// Delete order status
DELETE / api / order - statuses / { id };
```

### Payment Types

```javascript
// List all payment types
GET / api / payment - types;

// Create payment type
POST / api / payment - types;

// Update payment type
PUT / api / payment - types / { id };

// Delete payment type
DELETE / api / payment - types / { id };
```

## Orders

### Product Orders

```javascript
// List product orders with filters
GET /api/product-orders?user_id=1&status=completed&date_from=2024-01-01&date_to=2024-12-31&per_page=20&page=1&sort_by=created_at&sort_direction=desc

// Create product order
POST /api/product-orders/create

// Get product order by ID
GET /api/product-orders/{id}

// Update product order
PUT /api/product-orders/{id}

// Delete product order
DELETE /api/product-orders/{id}
```

### Sim Card Orders

```javascript
// List all sim orders
GET / api / sim - orders;

// Create sim order
POST / api / sim - orders;

// Update sim order
PUT / api / sim - orders / { id };

// Delete sim order
DELETE / api / sim - orders / { id };
```

### Quick Orders

```javascript
// Create quick order
POST / api / quick - orders;
```

### Customer Orders

```javascript
// Get customer orders
GET / api / customer / order - simcard / my - orders;

// Get customer archive orders
GET / api / customer / order - simcard / my - archive - orders;

// Check order balance
GET / api / customer / order - simcard / balance / { id };
```

## Settings

### Roles

```javascript
// List all roles
GET /api/roles

// Create role
POST /api/roles
{
  "name": "manager",
  "permissions": [1, 4, 5]
}

// Get role by ID
GET /api/roles/{id}

// Update role
PUT /api/roles/{id}

// Delete role
DELETE /api/roles/{id}
```

### Permissions

```javascript
// List all permissions
GET /api/permissions

// Create permission
POST /api/permissions
{
  "name": "region_management"
}

// Get permission by ID
GET /api/permissions/{id}

// Update permission
PUT /api/permissions/{id}

// Delete permission
DELETE /api/permissions/{id}
```

### Users

```javascript
// List all users
GET /api/users

// Create user
POST /api/users

// Get user by ID
GET /api/users/{id}

// Update user
PUT /api/users/{id}

// Delete user
DELETE /api/users/{id}

// Assign roles to user
POST /api/users/{id}/assign-roles
{
  "role": "manager"
}

// Assign permissions to user
POST /api/users/{id}/assign-permissions
{
  "permissions": ["view_client", "edit_client", "delete_client"]
}
```

## Site Management

### News

```javascript
// List all news
GET / api / news;

// Create news
POST / api / news;

// Get news by ID
GET / api / news / { id };

// Update news
PUT / api / news / { id };

// Delete news
DELETE / api / news / { id };
```

### FAQ

```javascript
// List all FAQ
GET / api / faq;

// Create FAQ
POST / api / faq;

// Get FAQ by ID
GET / api / faq / { id };

// Update FAQ
PUT / api / faq / { id };

// Delete FAQ
DELETE / api / faq / { id };
```

## Reports

```javascript
// List all reports
GET / api / reports;

// Get report by ID
GET / api / reports / { id };

// Generate report
POST / api / reports / generate;
```

## Other Endpoints

### Contractors

```javascript
// List all contractors
GET / api / contractors;

// Create contractor
POST / api / contractors;

// Update contractor
PUT / api / contractors / { id };

// Delete contractor
DELETE / api / contractors / { id };
```

### Branches

```javascript
// List all branches
GET / api / branches;

// Create branch
POST / api / branches;

// Update branch
PUT / api / branches / { id };

// Delete branch
DELETE / api / branches / { id };
```

### Warehouses

```javascript
// List all warehouses
GET / api / warehouses;
```

### Transactions

```javascript
// List all transactions
GET / api / transactions;

// Create transaction
POST / api / transactions;

// Update transaction
PUT / api / transactions / { id };

// Delete transaction
DELETE / api / transactions / { id };
```

## Response Formats

### Success Response

```json
{
  "data": [...],
  "message": "Success message",
  "status": "success"
}
```

### Error Response

```json
{
  "message": "Error message",
  "errors": {
    "field": ["Error description"]
  },
  "status": "error"
}
```

### Pagination Response

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 20,
    "total": 200
  }
}
```

## File Upload

For endpoints that require file uploads (regions, clients), use `multipart/form-data`:

```javascript
const formData = new FormData();
formData.append("name", "Region Name");
formData.append("img", file);
formData.append("status", "active");

axios.post("/api/regions", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Authentication Flow

1. User submits login credentials
2. Server returns JWT token
3. Token is stored in localStorage
4. Token is included in Authorization header for all subsequent requests
5. On logout, token is removed from localStorage

## Implementation Notes

- All API calls are made through the centralized `api.js` service layer
- Authentication is handled by the `authStore` Zustand store
- File uploads use `multipart/form-data` content type
- Error handling includes toast notifications
- Loading states are managed for better UX

---

**Status**: ✅ Complete - All major pages converted to real API
**Last Updated**: January 2025
**Version**: 1.0.0
