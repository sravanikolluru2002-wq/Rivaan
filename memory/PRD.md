# Rivan Reality LLP - Customer App PRD

## Overview
A premium real estate customer mobile app for **Rivan Reality LLP** with the tagline _"Legacy of trust, legacy of wealth."_ Built with Expo React Native (mobile) + FastAPI + MongoDB (backend). Includes a customer-facing app and an in-app admin dashboard.

## Brand
- Primary: Deep Forest Green `#0B5D1E`
- Accent: Vibrant Orange `#F08A2E`
- Logo: `/app/frontend/assets/images/rivan-logo.jpg`

## Auth
- Mobile OTP based (mock OTP: `123456`)
- JWT (30-day) stored via `@/src/utils/storage` (Keychain on native, AsyncStorage on web)

## Demo Accounts
| Role | Mobile | OTP | Pre-seeded |
|---|---|---|---|
| Customer | 9999900001 | 123456 | 1 plot (Rivan Greens P-005), 12 installments (3 paid), 9 documents, notifications |
| Admin | 9000000000 | 123456 | Full admin dashboard access |

## Features Implemented (MVP)

### Customer App
1. **Mobile OTP Login** – 2-step phone → OTP with dev autofill banner
2. **Home Tab** – Location dropdown, search, 7 categories, featured carousel, quick actions, property cards
3. **Property Details** – Image gallery, amenities, approvals, nearby, brochure, floating action bar
4. **Interactive Plot Layout** – 4-color coded plots (green/yellow/blue/red), filter chips, tap → details modal → book
5. **Plot Booking** – Multi-field form → confirmation: _"Thank you. Our Rivan team will contact you shortly"_
6. **Payments Tab** – Balance card (dark green), installment timeline, overdue alerts, mock Pay Now → receipts
7. **My Land Tab** – Owned plot details + quick links to Documents/Services/Payments
8. **Visits Tab** – Experience centres with Call/WhatsApp/Maps/Book buttons + visit history
9. **Profile Tab** – User info, KYC, menu (Wishlist, Documents, Services, Notifications, Settings)
10. **Document Locker** – PDF preview & download, 6 document types color-coded
11. **Property Services** – 10 categories (Cleaning, CCTV, Compound Wall, Construction, Borewell, Fencing, Electricity, Water, Maintenance, Legal) + request form
12. **Centre/Site Visit Booking** – Date + time slot selection
13. **Notifications** – In-app inbox with mark-as-read
14. **Wishlist** – Save/unsave properties

### Admin Dashboard
- Overview stats (customers, properties, plots by status, bookings, services, visits)
- Bookings management with Confirm & Assign
- Service requests with Start/Complete status
- Customer list

## Backend Endpoints (all under `/api`)
Auth: send-otp, verify-otp, me, profile update
Properties: list (filterable), featured, detail, plots
Plots: detail
Bookings: create, mine
My Land, Payments (summary/installments/history/pay), Documents
Services (catalog/request/mine), Centres, Visits (centre/site/mine)
Wishlist (toggle/list), Notifications (list/read/read-all)
Admin: stats, users, bookings (+ confirm), service-requests (+ status)

## Architecture
- **Frontend**: `/app/frontend/app/` (Expo Router file-based), `/app/frontend/src/` (theme, api, auth-context, components)
- **Backend**: Single `/app/backend/server.py` with all endpoints + auto-seed on startup
- **DB**: MongoDB collections — users, otps, properties, plots, bookings, installments, payments, documents, service_requests, centres, visits, wishlist, notifications

## Mocked Integrations
- OTP delivery (always returns `123456`)
- Payment gateway (mock receipt generation)
- Google Maps (links open external Maps URLs, no embedded map)
- Document files (sample PDF URL)
- Push notifications (in-app only, no Expo push setup)

## Business Enhancement
**Featured Properties carousel + Wishlist + WhatsApp-first enquiry flow** to maximize lead conversion. Sticky bottom action bar on property details (Visit / WhatsApp / Book) optimizes high-intent actions.
