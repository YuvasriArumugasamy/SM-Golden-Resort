# SM Golden Resorts — MERN Stack Hotel Booking Website

A complete, production-ready hotel booking website for **SM Golden Resorts**, Courtallam, Tamil Nadu.

---

## Project Structure

```
sm-golden-resorts/
├── backend/          # Node.js + Express + MongoDB API
├── frontend/         # React 18 + Vite + Tailwind CSS
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** installed locally OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free account
- **npm** 8+ (comes with Node.js)

---

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smgoldenresorts
JWT_SECRET=your_super_secret_jwt_key_change_this
ADMIN_EMAIL=admin@smgoldenresorts.com
ADMIN_PASSWORD=Admin@1234
```

Start the backend server:

```bash
npm run dev
```

Backend runs on: **http://localhost:5000**

On first start, the server will automatically:
- Connect to MongoDB
- Seed all 11 rooms into the database
- Create the default admin account

---

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend dev server:

```bash
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## Default Admin Credentials

| Field    | Value                        |
|----------|------------------------------|
| Email    | admin@smgoldenresorts.com    |
| Password | Admin@1234                   |

Admin panel: **http://localhost:5173/admin/login**

---

## MongoDB Atlas Setup (Optional Cloud DB)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new **Free Tier (M0)** cluster
3. Under **Database Access**, create a user with read/write permissions
4. Under **Network Access**, add your IP or allow all (`0.0.0.0/0`) for development
5. Click **Connect** → **Connect your application** → copy the connection string
6. Replace `MONGO_URI` in `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smgoldenresorts?retryWrites=true&w=majority
```

---

## API Endpoints

### Public Routes
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| GET    | /api/rooms           | Get all rooms            |
| POST   | /api/bookings        | Create a new booking     |
| POST   | /api/admin/login     | Admin login              |

### Protected Routes (JWT Required)
| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /api/bookings                   | Get all bookings         |
| PATCH  | /api/bookings/:id/status        | Update booking status    |
| DELETE | /api/bookings/:id               | Delete a booking         |
| GET    | /api/admin/stats                | Get dashboard stats      |
| PATCH  | /api/rooms/:roomId/toggle       | Toggle room availability |

---

## Production Deployment Notes

### Backend (Render / Railway / Heroku)
1. Push backend folder to a separate git repo
2. Set environment variables in the platform dashboard
3. Start command: `node server.js`
4. Update CORS origin in `server.js` to your frontend domain

### Frontend (Vercel / Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set `VITE_API_URL` to your deployed backend URL
4. Add `_redirects` file in `public/` for SPA routing:
   ```
   /* /index.html 200
   ```

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB, Mongoose                       |
| Auth      | JWT (jsonwebtoken), bcryptjs            |
| UI Icons  | lucide-react                            |
| Animation | framer-motion                           |
| Alerts    | react-hot-toast                         |
| HTTP      | axios                                   |

---

## Support

- **Phone 1:** 9443710440  
- **Phone 2:** 9003549849  
- **Address:** Old Falls Main Road, Old Falls, Courtallam, Tamil Nadu
