# StayWise - Hotel Booking Application 🏨

A full-stack hotel booking web application built with the **MERN stack**.  
It allows users to browse hotels, make bookings, and manage reservations.  
Admins can manage hotels and view bookings.

---

## 🚀 Features

- **User Authentication** (JWT-based Login/Signup)
- **Hotel Management** (Admins can add/delete hotels)
- **Booking Management** (Users can create bookings, Admins can view all bookings)
- **Responsive UI** built with React + Tailwind
- **RESTful API** using Express + MongoDB
- **Deployed**:
  - Backend on **Render**
  - Frontend on **Vercel**

---

## 🧑‍💻 Tech Stack

- **Frontend:** React, React Router, Axios, React Query, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT
- **Database:** MongoDB Atlas
- **Deployment:** Render (Backend), Vercel (Frontend)

---

## 📂 Folder Structure

```
stayWise/
│── backend/ # Express + MongoDB + Controllers + Routes
    ├── config/ // db
    ├── controllers/ // authController, property, booking
    ├── middleware/ // auth, errorHandler
    ├── models/ // User, Property, Booking
    ├── routes/ // auth, property, bookings
    ├── utils/ // seed
    └── server.js
│── frontend/ # React + Tailwind + React Query
    src/
        ├── components/ // Navbar, Loader, ProtectedRoute
        ├── pages/ // Login, Signup, MyBookings, PropertyList, AdminDashboard, AdminBokkings, PropertyDetail
        ├── api/ // client
        ├── context/ // AuthContext
        ├── App.jsx
        └── main.jsx
│── README.md

```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Mallikarjuna-dev/stayWise.git

cd stayWise
```

### 2️⃣ Backend Setup

```
cd backend

npm install
```

- Create a .env file inside backend/:

```
PORT=5000
MONGO_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-secret-key>
```

- Run backend:

```
npm run start
```

### 3️⃣ Frontend Setup

```
cd ../frontend

npm install
```

- Create a .env file inside frontend/:

```
VITE_SERVER_URL=https://<your-backend-url>.onrender.com
```

- Run frontend:

```
npm run dev
```

👤 Test Credentials

🔑 Admin

```
Email: admin@staywise.com
Password: admin123
```

👥 User

```
Email: user_id@mail.com
Password: your_password
```

## 📌 API Endpoints

### Auth

```
POST /api/auth/register → Register

POST /api/auth/login → Login
```

### Property

```
GET /api/properties → Get all properties

GET /api/properties/:id → Get property details

POST /api/properties (Admin) → Create hotel
```

### Bookings

```
GET /api/bookings (User/Admin) → Get bookings

GET /api/bookings/:id (User/Admin) → Get bookings details

POST /api/bookings (User) → Create booking
```

## 🔗 Live Demo

### Frontend (Vercel): https://staywise.vercel.app

### Backend (Render):https://staywise-api.onrender.com

## 👨‍💻 Author

### Mallikarjuna Annigeri
