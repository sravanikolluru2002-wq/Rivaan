#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================
# Tests must be added in YAML format below.
#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

user_problem_statement: |
  Build a full Rivan Reality LLP Customer App (Expo React Native + FastAPI + MongoDB).
  Features: Mobile OTP login, property listing, interactive plot booking, payments, my land,
  documents, services, experience-centre visits, notifications, profile, admin dashboard.
  Brand: Deep forest green (#0B5D1E) + orange accent (#F08A2E). Tagline "Legacy of trust, legacy of wealth".
  MVP scope: customer app + admin dashboard, mock payments, mock OTP (123456), mock maps.

backend:
  - task: "Mobile OTP auth (send/verify, JWT)"
    implemented: true
    working: "NA"
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Implemented /api/auth/send-otp and /api/auth/verify-otp. Mock OTP is 123456. Issues JWT 30-day token. Tested via curl - returns user + token. Demo user 9999900001 seeded."

  - task: "Properties CRUD + filters"
    implemented: true
    working: "NA"
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "GET /api/properties with filters (category, location, price, search). 7 properties seeded across all categories. GET /api/properties/featured, GET /api/properties/{id}, GET /api/properties/{id}/plots all implemented."

  - task: "Interactive plot booking with status colors"
    implemented: true
    working: "NA"
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Plots seeded for prop-1 (24 plots) and prop-6 (20 plots) with rows/cols positions and 4 statuses (available/reserved/booked/sold). POST /api/bookings creates booking and reserves plot."

  - task: "Payment summary + installments + pay flow"
    implemented: true
    working: "NA"
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "GET /api/payments/summary, /installments, /history. POST /api/payments/pay mock-processes payment, generates receipt, marks installment paid. Demo user has 12 installments (3 paid, 9 to come)."

  - task: "My Land, Documents, Services, Visits, Wishlist, Notifications, Admin"
    implemented: true
    working: "NA"
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Full CRUD for /myland, /documents, /services/*, /centres, /visits/*, /wishlist, /notifications. Admin endpoints /admin/stats, /admin/users, /admin/bookings (+ confirm), /admin/service-requests (+ status). Admin user 9000000000 seeded."

frontend:
  - task: "OTP Login Flow"
    implemented: true
    working: "NA"
    file: "frontend/app/login.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Two-step login: phone -> OTP. Dev OTP banner with autofill. Demo hint shows 9999900001. JWT stored via expo-secure-store via @/src/utils/storage."

  - task: "Home screen with categories + featured + properties"
    implemented: true
    working: "NA"
    file: "frontend/app/(tabs)/index.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Location dropdown, search, 8 categories, featured horizontal carousel, quick actions (Services/Documents/Wishlist/Admin), property list cards."

  - task: "Property details + image gallery"
    implemented: true
    working: "NA"
    file: "frontend/app/property/[id].tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Image gallery with paging, all property details (amenities, approvals, nearby, specs), bottom action bar with WhatsApp/Visit/Layout."

  - task: "Interactive plot layout with color coding"
    implemented: true
    working: "NA"
    file: "frontend/app/layout/[id].tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Grid of plots with strict color mapping (green/yellow/blue/red). Filter chips, scroll horizontally. Tap plot -> modal with details and Book CTA. Book takes user to booking form."

  - task: "Plot booking form"
    implemented: true
    working: "NA"
    file: "frontend/app/booking/[plotId].tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Form with name/mobile/whatsapp/message. Shows success confirmation 'Thank you. Our Rivan team will contact you shortly.'"

  - task: "Payments tab: summary, installments, history, pay flow"
    implemented: true
    working: "NA"
    file: "frontend/app/(tabs)/payments.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Dark green summary card, upcoming/history tabs, pay-now button per installment, overdue alerts."

  - task: "My Land, Visits, Profile tabs"
    implemented: true
    working: "NA"
    file: "frontend/app/(tabs)/*.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "My Land shows owned plots with property info. Visits shows centres + history. Profile shows user info, KYC, all settings menu, logout."

  - task: "Documents, Services, Notifications, Wishlist, Centre Visit, Admin"
    implemented: true
    working: "NA"
    file: "frontend/app/*.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Document locker, services catalog + request form, notifications inbox, wishlist, centre/site visit booking, full admin dashboard with stats/bookings/services/users."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 0
  run_ui: true

test_plan:
  current_focus:
    - "Mobile OTP auth (send/verify, JWT)"
    - "Properties CRUD + filters"
    - "Interactive plot booking with status colors"
    - "Payment summary + installments + pay flow"
    - "OTP Login Flow"
    - "Home screen with categories + featured + properties"
    - "Interactive plot layout with color coding"
    - "Plot booking form"
    - "Payments tab: summary, installments, history, pay flow"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Initial MVP complete. Backend uses FastAPI + Motor (MongoDB async). All endpoints under /api prefix.
      Seed data automatically inserted on startup. Demo user 9999900001 / OTP 123456 has full data (1 owned plot, 12 installments, 9 docs, notifications). Admin: 9000000000 / 123456.
      Frontend uses Expo Router file-based routing with auth-gated layout. JWT stored via @/src/utils/storage (expo-secure-store on native, AsyncStorage on web).
      Please test backend endpoints first, then end-to-end flows: login → browse properties → view layout → book plot → check payments → my land → documents → services request → centre visit → admin dashboard.
