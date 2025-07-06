# Meal Rescue

**Meal Rescue** is a MERN stack web application that helps reduce food waste by connecting individuals with leftover food to NGOs who can collect and distribute it. 

---

## Features

- User Roles: Regular users and NGOs.
- Post Leftover Food: Users can upload food details (photo, quantity, veg/non-veg, address, city).
- NGO Dashboard: NGOs can search city-wise posts and claim available food.
- OTP-Based Email Verification: Users verify their email before registering.
- JWT Authentication: Secure login & protected routes.
- Cloudinary Integration: Food images are uploaded and stored on Cloudinary.
- Email Notifications: NGOs receive email when a food post is claimed.
- Responsive UI: Built using Material UI.

---

## Project Structure

```
MealRescue/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── api/
│   │   └── App.jsx
│   └── vite.config.js
├── .env
└── README.md
```

---

## Technologies Used

### Frontend
- React
- React Router
- Context API
- Material UI
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Bcrypt
- JWT
- Nodemailer
- Cloudinary
- Joi (validation)

---

## Getting Started

### 1. Clone the repository
```bash
git clone git@github.com:namita3599/MealRescue.git
cd MealRescue
```

### 2. Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Setup environment variables

Create a `.env` file in the `backend/` directory with:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> Make sure to use an App Password for Gmail if 2FA is enabled.

Create a `.env` file in the `frontend/` directory with:

```env
VITE_BACKEND_URL=http://localhost:5000/api
```
Or

```env
VITE_BACKEND_URL=https://mealrescue-backend.onrender.com/api/
```

> All Vite environment variables must start with `VITE_`.

---

### 4. Run the app

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run dev
```

---

## Acknowledgments

Made with love to help reduce food waste and support NGOs.
