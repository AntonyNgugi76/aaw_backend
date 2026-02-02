# Admin Dashboard Specification for AAW Backend

## Overview

This document outlines the complete admin dashboard features required for the AAW (Aid & Welfare) platform based on the backend API. The admin portal will allow administrators to manage donations, requests, pantries, categories, users, pickups, and transactions.

---

## 🔐 Authentication

### Login Page
- **Endpoint**: `POST /api/auth/login`
- **Fields**:
  - Phone or Email
  - Password
- **Validation**: Only users with `role: "admin"` should access the dashboard
- **Features**:
  - JWT token storage (localStorage/sessionStorage)
  - Auto-logout on token expiration
  - Remember me functionality

---

## 📊 Dashboard Home

### Overview Stats Cards
Display key metrics at a glance:
- Total Donations (by status)
- Total Requests (by status)
- Total Users (by role)
- Total Pantries
- Total Transactions
- Recent Activity Feed

### Charts/Graphs
- Donations over time (line chart)
- Requests by category (pie chart)
- User registrations trend
- Transaction amounts (bar chart)

---

## 🎁 Donation Management

### Data Model Reference
```javascript
{
  user: ObjectId,           // Donor reference
  category: ObjectId,       // DonationCategory reference
  itemName: String,
  description: String,
  quantity: Number,
  photos: [String],         // Image URLs
  location: {
    type: "Point",
    coordinates: [Number]   // [lng, lat]
  },
  pickupMethod: "pickup" | "dropoff",
  dropOffPantry: ObjectId,
  pickupAssignedPantry: ObjectId,
  status: "pending" | "approved" | "assigned" | "collected" | "delivered" | "rejected" | "completed",
  assignedDriver: ObjectId
}
```

### Features Required

#### 1. Donations List View
| Column | Description |
|--------|-------------|
| ID | Donation ID |
| Item Name | Name of donated item |
| Category | Category name |
| Donor | User who donated |
| Quantity | Number of items |
| Pickup Method | pickup/dropoff |
| Assigned Pantry | Pantry handling the donation |
| Status | Current status with color badge |
| Created At | Date/time created |
| Actions | View, Approve, Reject, Assign |

#### 2. Filter & Search
- Filter by status: `pending`, `approved`, `assigned`, `collected`, `delivered`, `rejected`, `completed`
- Filter by category
- Filter by pickup method
- Filter by pantry
- Filter by date range
- Search by item name, donor name

#### 3. Admin Actions on Donations
| Action | Description | Status Change |
|--------|-------------|---------------|
| **Approve** | Approve pending donation | `pending` → `approved` |
| **Reject** | Reject donation with reason | `pending` → `rejected` |
| **Assign Driver** | Assign a driver for pickup | `approved` → `assigned` |
| **Mark Collected** | Driver collected from donor | `assigned` → `collected` |
| **Mark Delivered** | Delivered to pantry | `collected` → `delivered` |
| **Complete** | Fully processed | `delivered` → `completed` |

#### 4. Donation Detail View
- Full donation information
- Photos gallery
- Location on map
- Donor information
- Status history/timeline
- Assigned driver info
- Related pantry info

#### 5. API Endpoints Needed (may need to add to backend)
```
GET    /api/donations              - Get all donations (admin)
GET    /api/donations/:id          - Get donation by ID
PUT    /api/donations/:id/status   - Update donation status
PUT    /api/donations/:id/assign   - Assign driver to donation
DELETE /api/donations/:id          - Delete donation
```

---

## 📋 Request Management

### Data Model Reference
```javascript
{
  user: ObjectId,           // Destitute user reference
  category: ObjectId,       // Category reference
  itemName: String,
  description: String,
  quantity: Number,
  location: {
    type: "Point",
    coordinates: [Number]   // [lng, lat]
  },
  fulfillmentPantry: ObjectId,
  status: "pending" | "approved" | "rejected" | "fulfilled"
}
```

### Features Required

#### 1. Requests List View
| Column | Description |
|--------|-------------|
| ID | Request ID |
| Item Name | Requested item |
| Category | Category name |
| Requester | User who requested |
| Quantity | Amount needed |
| Fulfillment Pantry | Assigned pantry |
| Status | Current status |
| Created At | Date requested |
| Actions | View, Approve, Reject, Fulfill |

#### 2. Filter & Search
- Filter by status: `pending`, `approved`, `rejected`, `fulfilled`
- Filter by category
- Filter by pantry
- Filter by date range
- Search by item name, requester name

#### 3. Admin Actions on Requests
| Action | Description | Status Change |
|--------|-------------|---------------|
| **Approve** | Approve request | `pending` → `approved` |
| **Reject** | Reject with reason | `pending` → `rejected` |
| **Mark Fulfilled** | Request completed | `approved` → `fulfilled` |
| **Assign Pantry** | Change fulfillment pantry | No status change |

#### 4. Request Detail View
- Full request information
- Requester details
- Location on map
- Assigned pantry info
- Status history

#### 5. API Endpoints (Existing)
```
GET    /api/requests              - Get all requests (admin only)
PUT    /api/requests/:id/status   - Update request status
```

---

## 🏪 Pantry Management

### Data Model Reference
```javascript
{
  name: String,
  description: String,
  location: {
    type: "Point",
    coordinates: [Number]   // [lng, lat]
  },
  address: String,
  contactPhone: String
}
```

### Features Required

#### 1. Pantries List View
| Column | Description |
|--------|-------------|
| ID | Pantry ID |
| Name | Pantry name |
| Address | Physical address |
| Contact Phone | Phone number |
| Location | Coordinates/Map link |
| Created At | Date added |
| Actions | View, Edit, Delete |

#### 2. Admin Actions on Pantries
| Action | Description |
|--------|-------------|
| **Create** | Add new pantry |
| **Edit** | Update pantry details |
| **Delete** | Remove pantry |
| **View Stats** | See donations/requests at this pantry |

#### 3. Pantry Form Fields
- Name (required)
- Description
- Coordinates [lng, lat] (required) - use map picker
- Address
- Contact Phone

#### 4. Pantry Detail View
- Full pantry information
- Location on interactive map
- List of donations assigned to this pantry
- Statistics (total donations received, pending pickups, etc.)

#### 5. API Endpoints (Existing)
```
GET    /api/pantries              - Get all pantries
POST   /api/pantries              - Create pantry (admin)
PUT    /api/pantries/:id          - Update pantry (admin)
DELETE /api/pantries/:id          - Delete pantry (admin)
```

---

## 📁 Category Management

### Data Model Reference
```javascript
{
  name: String,
  description: String
}
```

### Features Required

#### 1. Categories List View
| Column | Description |
|--------|-------------|
| ID | Category ID |
| Name | Category name |
| Description | Category description |
| Donations Count | Number of donations in category |
| Requests Count | Number of requests in category |
| Actions | Edit, Delete |

#### 2. Admin Actions
| Action | Description |
|--------|-------------|
| **Create** | Add new category |
| **Edit** | Update category |
| **Delete** | Remove category (if no associated items) |

#### 3. API Endpoints (Existing)
```
GET    /api/categories            - Get all categories
POST   /api/categories            - Create category (admin)
PUT    /api/categories/:id        - Update category (admin)
DELETE /api/categories/:id        - Delete category (admin)
```

---

## 👥 User Management

### Data Model Reference
```javascript
{
  name: String,
  email: String,
  phone: String,
  role: "donor" | "destitute" | "admin" | "driver",
  location: {
    type: "Point",
    coordinates: [Number]
  },
  avatarUrl: String,
  createdAt: Date
}
```

### Features Required

#### 1. Users List View
| Column | Description |
|--------|-------------|
| ID | User ID |
| Name | Full name |
| Email | Email address |
| Phone | Phone number |
| Role | User role (color-coded badge) |
| Location | Coordinates |
| Joined | Registration date |
| Actions | View, Edit Role, Deactivate |

#### 2. Filter & Search
- Filter by role: `donor`, `destitute`, `admin`, `driver`
- Search by name, email, phone
- Filter by date joined

#### 3. Admin Actions on Users
| Action | Description |
|--------|-------------|
| **View Profile** | See full user details |
| **Change Role** | Update user role |
| **Deactivate** | Disable user account |
| **Create Admin** | Create new admin user |
| **Create Driver** | Create new driver user |

#### 4. User Detail View
- Full profile information
- Activity history (donations made/requests submitted)
- Statistics per user

#### 5. API Endpoints Needed (add to backend)
```
GET    /api/users                 - Get all users (admin)
GET    /api/users/:id             - Get user by ID (admin)
PUT    /api/users/:id             - Update user (admin)
PUT    /api/users/:id/role        - Change user role (admin)
DELETE /api/users/:id             - Deactivate user (admin)
```

---

## 🚚 Pickup Management

### Data Model Reference
```javascript
{
  donation: ObjectId,
  driver: ObjectId,
  status: "assigned" | "enroute" | "collected" | "cancelled" | "completed",
  pickupWindowStart: Date,
  pickupWindowEnd: Date,
  notes: String
}
```

### Features Required

#### 1. Pickups List View
| Column | Description |
|--------|-------------|
| ID | Pickup ID |
| Donation | Linked donation |
| Driver | Assigned driver |
| Status | Current pickup status |
| Pickup Window | Start - End time |
| Notes | Additional notes |
| Actions | View, Update Status, Reassign |

#### 2. Admin Actions
| Action | Description | Status Change |
|--------|-------------|---------------|
| **Assign Driver** | Assign driver to pickup | → `assigned` |
| **Mark Enroute** | Driver on the way | → `enroute` |
| **Mark Collected** | Item collected | → `collected` |
| **Complete** | Delivery complete | → `completed` |
| **Cancel** | Cancel pickup | → `cancelled` |
| **Reassign** | Change assigned driver | - |

#### 3. API Endpoints Needed (add to backend)
```
GET    /api/pickups               - Get all pickups (admin)
POST   /api/pickups               - Create pickup
PUT    /api/pickups/:id           - Update pickup
PUT    /api/pickups/:id/status    - Update pickup status
DELETE /api/pickups/:id           - Cancel/delete pickup
```

---

## 💰 Transaction Management

### Data Model Reference
```javascript
{
  user: ObjectId,
  donation: ObjectId,
  amount: Number,
  provider: "mpesa" | "manual" | "other",
  mpesaCheckoutRequestId: String,
  mpesaResponse: Object,
  status: "initiated" | "successful" | "failed" | "pending"
}
```

### Features Required

#### 1. Transactions List View
| Column | Description |
|--------|-------------|
| ID | Transaction ID |
| User | Payer |
| Amount | Transaction amount |
| Provider | Payment method |
| Status | Payment status |
| M-Pesa ID | Checkout request ID |
| Created At | Transaction date |
| Actions | View Details |

#### 2. Filter & Search
- Filter by status: `initiated`, `successful`, `failed`, `pending`
- Filter by provider
- Filter by date range
- Filter by amount range

#### 3. Transaction Detail View
- Full transaction details
- User information
- Linked donation (if any)
- M-Pesa response data (if applicable)

#### 4. API Endpoints Needed (add to backend)
```
GET    /api/transactions          - Get all transactions (admin)
GET    /api/transactions/:id      - Get transaction by ID
GET    /api/transactions/stats    - Get transaction statistics
```

---

## 🗺️ Map View (Optional Feature)

### Features
- Interactive map showing:
  - All pantry locations (markers)
  - Donation pickup locations
  - Destitute request locations
  - Driver locations (real-time if possible)
- Filter by type (pantries, donations, requests)
- Click marker to view details

---

## 📈 Reports & Analytics

### Reports Dashboard
1. **Donations Report**
   - Total donations by status
   - Donations by category
   - Donations by time period
   - Top donors

2. **Requests Report**
   - Total requests by status
   - Requests by category
   - Fulfillment rate
   - Average fulfillment time

3. **Pantry Report**
   - Inventory levels per pantry
   - Most active pantries
   - Geographic distribution

4. **User Report**
   - User registrations over time
   - Users by role
   - Most active users

5. **Financial Report**
   - Total transactions
   - Successful vs failed payments
   - Revenue over time

### Export Features
- Export to CSV/Excel
- Export to PDF
- Print reports

---

## 🛠️ System Settings

### Admin Settings
- Manage admin accounts
- System configurations
- Notification settings
- API keys management

### Audit Log
- Track all admin actions
- Filter by action type, user, date
- View action details

---

## 🎨 UI/UX Requirements

### Technology Stack Recommendation
```
- React 18+
- React Router v6
- Tailwind CSS or Material UI
- Axios for API calls
- React Query for data fetching
- Chart.js or Recharts for charts
- React-Leaflet for maps
- React Hook Form for forms
- React Hot Toast for notifications
```

### Layout Structure
```
├── Sidebar Navigation
│   ├── Dashboard
│   ├── Donations
│   ├── Requests
│   ├── Pantries
│   ├── Categories
│   ├── Users
│   ├── Pickups
│   ├── Transactions
│   ├── Reports
│   └── Settings
├── Header
│   ├── Search
│   ├── Notifications
│   └── Admin Profile
└── Main Content Area
```

### Responsive Design
- Desktop-first approach
- Tablet and mobile responsive
- Collapsible sidebar on smaller screens

---

## 🔒 Security Requirements

1. **Authentication**
   - JWT token-based auth
   - Token refresh mechanism
   - Secure token storage

2. **Authorization**
   - Role-based access control
   - Admin-only routes protection
   - API endpoint validation

3. **Input Validation**
   - Client-side validation
   - Server-side validation
   - XSS prevention

---

## 📝 Backend API Additions Required

Based on the current backend, these endpoints need to be added:

### User Routes (`/api/users`)
```javascript
GET    /                  - Get all users
GET    /:id               - Get user by ID
PUT    /:id               - Update user
PUT    /:id/role          - Change user role
DELETE /:id               - Deactivate user
```

### Donation Routes (additions to `/api/donations`)
```javascript
GET    /                  - Get all donations (admin)
GET    /:id               - Get donation by ID
PUT    /:id/status        - Update donation status
PUT    /:id/assign        - Assign driver
DELETE /:id               - Delete donation
```

### Pickup Routes (`/api/pickups`)
```javascript
GET    /                  - Get all pickups
POST   /                  - Create pickup
PUT    /:id               - Update pickup
PUT    /:id/status        - Update status
DELETE /:id               - Delete pickup
```

### Transaction Routes (`/api/transactions`)
```javascript
GET    /                  - Get all transactions
GET    /:id               - Get transaction by ID
GET    /stats             - Get statistics
```

### Stats Routes (`/api/stats`)
```javascript
GET    /dashboard         - Dashboard overview stats
GET    /donations         - Donation statistics
GET    /requests          - Request statistics
GET    /users             - User statistics
```

---

## 🚀 Implementation Priority

### Phase 1 (MVP)
1. ✅ Authentication (Login)
2. ✅ Dashboard Overview
3. ✅ Request Management (approve/reject)
4. ✅ Donation Management (approve/reject)
5. ✅ Pantry CRUD
6. ✅ Category CRUD

### Phase 2
1. User Management
2. Pickup Management
3. Transaction Viewing
4. Basic Reports

### Phase 3
1. Advanced Analytics
2. Map View
3. Export Features
4. Audit Logging
5. System Settings

---

## 📁 Suggested React Project Structure

```
src/
├── assets/
│   ├── images/
│   └── styles/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── DataTable.jsx
│   │   ├── Modal.jsx
│   │   ├── StatusBadge.jsx
│   │   └── ...
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── Layout.jsx
│   └── charts/
│       ├── LineChart.jsx
│       ├── PieChart.jsx
│       └── BarChart.jsx
├── pages/
│   ├── auth/
│   │   └── Login.jsx
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── donations/
│   │   ├── DonationsList.jsx
│   │   └── DonationDetail.jsx
│   ├── requests/
│   │   ├── RequestsList.jsx
│   │   └── RequestDetail.jsx
│   ├── pantries/
│   │   ├── PantriesList.jsx
│   │   ├── PantryForm.jsx
│   │   └── PantryDetail.jsx
│   ├── categories/
│   │   ├── CategoriesList.jsx
│   │   └── CategoryForm.jsx
│   ├── users/
│   │   ├── UsersList.jsx
│   │   └── UserDetail.jsx
│   ├── pickups/
│   │   └── PickupsList.jsx
│   ├── transactions/
│   │   └── TransactionsList.jsx
│   └── reports/
│       └── Reports.jsx
├── services/
│   ├── api.js
│   ├── auth.service.js
│   ├── donation.service.js
│   ├── request.service.js
│   ├── pantry.service.js
│   ├── category.service.js
│   ├── user.service.js
│   └── ...
├── hooks/
│   ├── useAuth.js
│   ├── useDonations.js
│   └── ...
├── context/
│   └── AuthContext.jsx
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
├── App.jsx
└── main.jsx
```

---

## Summary

This admin dashboard will provide complete control over the AAW platform with features to:

| Module | Key Admin Actions |
|--------|-------------------|
| **Donations** | Approve, Reject, Assign Driver, Track Status |
| **Requests** | Approve, Reject, Mark Fulfilled |
| **Pantries** | Create, Edit, Delete, View Stats |
| **Categories** | Create, Edit, Delete |
| **Users** | View All, Change Roles, Manage Accounts |
| **Pickups** | Assign, Track, Complete |
| **Transactions** | View, Monitor Payments |
| **Reports** | Generate Analytics & Export |

This specification ensures the admin can manage all client needs from donation approval to request fulfillment.
