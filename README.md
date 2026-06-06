# EduFlow

A student productivity platform for managing notes, resources, and tasks — all in one place.

---

## What it does

EduFlow helps students stay organized throughout their academic journey. Upload your notes, share study resources with your community, track tasks with a kanban board, and monitor your progress from a single dashboard.

- **Notes** — Upload PDFs and images, search by subject, track downloads
- **Resources** — Share links and files with the study community, like and discover materials
- **Tasks** — Kanban board with priorities, due dates, and status tracking
- **Dashboard** — Stats overview, recent activity, upcoming deadlines
- **Profile** — Edit your info, upload a photo, change your password
- **Dark mode** — Full dark/light theme toggle

---

## Tech stack

**Frontend**
- React 18
- Vite
- Tailwind CSS v4
- React Router v6
- Axios
- date-fns
- react-hot-toast
- Lucide React

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Cloudinary + Multer (file uploads)
- bcryptjs
- express-validator

**Hosting**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas
- Files → Cloudinary

---
## Video demo


https://github.com/user-attachments/assets/87aea24a-7dcd-4fed-9080-006e83ca6ef5



## Getting started locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/eduflow.git
cd eduflow
```

### 2. Set up the backend

```bash
cd backend
npm install --legacy-peer-deps
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/eduflow?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
node index.js
```

You should see:
```
Connected to MongoDB
EduFlow server running on port 5000
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`

---

## Project structure

```
eduflow/
├── backend/
│   ├── config/          # Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth + validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   └── index.js         # Entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/  # AppLayout, Sidebar, Topbar
        │   └── ui/      # Modal, StatCard, EmptyState, etc.
        ├── context/     # AuthContext, ThemeContext
        ├── pages/       # All page components
        ├── services/    # API service layer
        └── App.jsx
```

---

## Environment variables

| Variable | Where | Description |
|----------|-------|-------------|
| `MONGODB_URI` | backend | MongoDB Atlas connection string |
| `JWT_SECRET` | backend | Secret key for signing JWT tokens |
| `JWT_EXPIRE` | backend | Token expiry e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` | backend | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | backend | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | backend | Cloudinary API secret |
| `CLIENT_URL` | backend | Frontend URL for CORS |
| `PORT` | backend | Server port (default 5000) |
| `VITE_API_URL` | frontend | Backend API base URL |

---

## Deployment

**Backend → Render**
- Root directory: `backend`
- Build command: `npm install --legacy-peer-deps`
- Start command: `node index.js`
- Add all backend env variables in the Environment tab

**Frontend → Vercel**
- Root directory: `frontend`
- Framework: Vite
- Add `VITE_API_URL` pointing to your Render URL

After deploying both, update `CLIENT_URL` in Render to your Vercel URL and redeploy.

---

## License

MIT
