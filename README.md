# Rivan Reality

Expo + FastAPI + MongoDB customer app for Rivan Reality LLP.

## Project Structure

- `frontend/` - Expo Router app for web PWA, Android, and iOS
- `backend/` - FastAPI API with MongoDB Atlas via Motor
- `vercel.json` - Vercel static PWA deployment
- `render.yaml` - Render FastAPI deployment
- `railway.json` - Railway FastAPI deployment

## Environment

Create local env files from the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Backend variables:

```bash
MONGO_URL=mongodb+srv://<user>:<password>@<cluster-host>/rivan_reality?retryWrites=true&w=majority
DB_NAME=rivan_reality
JWT_SECRET=replace-with-a-long-random-secret
OTP_DEV_MODE=true
MOCK_OTP=123456
CORS_ORIGINS=http://localhost:8081,http://localhost:19006,https://your-vercel-domain.vercel.app
```

Frontend variables:

```bash
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000
```

For Android emulator local API testing, use `http://10.0.2.2:8000`. For physical devices, use your computer LAN URL, for example `http://192.168.1.20:8000`.

## Local Development

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

Frontend:

```bash
cd frontend
yarn install --frozen-lockfile
yarn web
```

Android and iOS development:

```bash
cd frontend
yarn android
yarn ios
```

Backend health check:

```bash
curl http://localhost:8000/api/health
```

## PWA Website

The web app uses `EXPO_PUBLIC_BACKEND_URL` for all API calls, includes a web manifest, app icons, splash asset, and a service worker for install support and offline shell caching.

Build locally:

```bash
cd frontend
EXPO_PUBLIC_BACKEND_URL=https://your-backend-domain.onrender.com yarn export:web
```

Preview locally:

```bash
cd frontend
yarn preview:web
```

## Deploy Website to Vercel

1. Import the GitHub repo in Vercel.
2. Use the repository root as the project root.
3. Add environment variable:

```bash
EXPO_PUBLIC_BACKEND_URL=https://your-backend-domain.onrender.com
```

4. Deploy. Vercel uses `vercel.json`:

```bash
cd frontend && yarn install --frozen-lockfile && yarn export:web
```

The output directory is `frontend/dist`.

## Deploy Backend to Render

1. Create a new Blueprint from this repo, or create a Web Service using `render.yaml`.
2. Set these Render environment variables:

```bash
MONGO_URL=mongodb+srv://<user>:<password>@<cluster-host>/rivan_reality?retryWrites=true&w=majority
DB_NAME=rivan_reality
JWT_SECRET=<long-random-secret>
OTP_DEV_MODE=false
CORS_ORIGINS=https://your-vercel-domain.vercel.app
```

3. Build command:

```bash
pip install -r requirements.txt
```

4. Start command:

```bash
uvicorn server:app --host 0.0.0.0 --port $PORT
```

## Deploy Backend to Railway

1. Create a Railway project from the GitHub repo.
2. Add the same backend environment variables shown above.
3. Railway uses `railway.json` to install backend requirements and start FastAPI.

Manual Railway start command:

```bash
cd backend && uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}
```

## MongoDB Atlas

1. Create an Atlas cluster and database user.
2. Add the Render/Railway outbound IPs to Atlas Network Access, or temporarily allow `0.0.0.0/0` during setup.
3. Set `MONGO_URL` to the Atlas SRV connection string.
4. Keep `DB_NAME=rivan_reality` unless you intentionally choose another database.

The backend pins Motor and PyMongo to compatible versions: `motor==3.7.1` and `pymongo>=4.9,<5`.

## EAS Builds

Install and log in:

```bash
npm install -g eas-cli
eas login
```

Configure the Expo project once:

```bash
cd frontend
eas init
```

Set production API env values in EAS:

```bash
cd frontend
eas secret:create --scope project --name EXPO_PUBLIC_BACKEND_URL --value https://your-backend-domain.onrender.com
```

Android builds:

```bash
cd frontend
eas build --platform android --profile preview
eas build --platform android --profile production
```

iOS builds:

```bash
cd frontend
eas build --platform ios --profile preview
eas build --platform ios --profile production
```

All native builds use:

- Android package: `com.rivanreality.customer`
- iOS bundle identifier: `com.rivanreality.customer`

## Auth

OTP auth works through the FastAPI backend on web, Android, and iOS. In local development, `OTP_DEV_MODE=true` returns the mock OTP (`123456`) for testing. In production, set `OTP_DEV_MODE=false` and connect a real SMS provider before public launch.
