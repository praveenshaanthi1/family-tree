# 🌸 Our Family Story

A beautiful family memory timeline web app — built with Node.js, MongoDB, and deployed on Vercel.

## ✨ Features

- **Timeline** of family memories with custom doodle illustrations
- **Add / Edit / Delete** memories with photos
- **Photo uploads** stored as base64 in MongoDB
- **Frame photo** for the hero section
- **Falling petals** background animation
- **Recurring yearly events** (birthdays & anniversaries) auto-generated
- Fully **persistent** — all data saved in MongoDB

---

## 🗂 Project Structure

```
family-story/
├── api/
│   └── index.js        # Express API server (Vercel serverless function)
├── public/
│   └── index.html      # Frontend (served as static)
├── vercel.json         # Vercel routing config
├── package.json
├── .env.example        # Environment variable template
└── README.md
```

---

## 🚀 Deploy to Vercel (Step-by-Step)

### 1. Set up MongoDB Atlas (free)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free account
2. Create a **free M0 cluster**
3. Under **Database Access**, create a user with read/write permissions
4. Under **Network Access**, add `0.0.0.0/0` (allow all IPs — needed for Vercel)
5. Click **Connect → Connect your application** and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/family-story.git
git push -u origin main
```

### 3. Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
2. Click **New Project** → Import your `family-story` repository
3. In **Environment Variables**, add:
   - Key: `MONGODB_URI`
   - Value: your MongoDB connection string (with username & password filled in)
4. Click **Deploy** 🚀

Your site will be live at `https://family-story.vercel.app` (or similar)!

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- A MongoDB Atlas URI (or local MongoDB)

### Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your MONGODB_URI

# Start API server (port 3001)
node api/index.js

# In another terminal, serve the frontend (port 3000)
npx serve public -p 3000
```

Then open [http://localhost:3000](http://localhost:3000).

> **Note:** For local dev, the frontend's `API_URL` uses `window.location.origin`, so if you open `public/index.html` directly in a browser (file://), API calls will fail. Always serve it via a local server.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/memories` | Fetch all memories |
| POST | `/api/memories` | Create a new memory |
| PUT | `/api/memories/:id` | Update a memory |
| DELETE | `/api/memories/:id` | Delete a memory |
| GET | `/api/settings/:key` | Get a setting (e.g. framePhoto) |
| POST | `/api/settings/:key` | Save a setting |
| GET | `/api/health` | Health check |

---

## 🧩 Customisation

The family names, marriage date, and birthdays are all in `public/index.html`:

- **Hero names**: Search for `Praveenraj` and `Keerthana` in the HTML
- **Recurring events** (birthdays/anniversary): Find the `recurringEvents` array in the `<script>` section
- **Initial memories**: The `memories` array holds the seed timeline events

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Hosting | Vercel (serverless) |
| Fonts | Google Fonts (Cormorant Garamond, Satisfy, Jost) |
