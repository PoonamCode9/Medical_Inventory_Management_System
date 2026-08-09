# TODO — Settings Page for Admin, Pharmacist, Staff

## Backend
- [x] Create `SettingsController.java` with `GET /api/settings/me` and `PUT /api/settings/password`

## Frontend API
- [x] Add `fetchCurrentUser()` and `changePassword(payload)` to `api.js`

## Settings Pages (one per role)
- [x] Create `Frontend/src/admin/Settings.jsx` (AdminLayout)
- [x] Create `Frontend/src/pharmacist/Settings.jsx` (PharmacistLayout)
- [x] Create `Frontend/src/staff/Settings.jsx` (StaffLayout)

## Routing
- [x] Update `AdminRoutes.jsx`, `PharmacistRoutes.jsx`, `StaffRoutes.jsx` to use real Settings component
- [x] Register top-level `/admin/settings` and `/pharmacist/settings` in `App.jsx`

## Verify
- [x] Review all changes for consistency and correctness
