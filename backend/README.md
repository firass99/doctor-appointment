# Doctor Appointment App - Backend

REST API for booking doctor appointments, built with Express and MongoDB.
The React frontend will come in the next phase.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication + bcryptjs
- Swagger (API docs)
- Docker (MongoDB)

## Features

- User registration and login (JWT)
- Roles: `ADMIN`, `DOCTOR`, `USER` (patient)
- Specialities management
- Doctor profiles with working hours, breaks and days off
- Free slots calculation for each doctor and day
- Appointment booking, confirming, completing and cancelling
- In-app notifications (unread count, mark as read, delete)
- Interactive API documentation with Swagger

## Project Structure

```
backend/
├── config/
│   └── swagger.js
├── controllers/
├── middlewares/
│   └── auth.js
├── models/
│   ├── User.js
│   ├── Doctor.js
│   ├── Speciality.js
│   ├── Appointment.js
│   └── notification.js
├── routes/
├── utils/
│   └── slots.js
├── .env
├── docker-compose.yml
├── package.json
└── server.js
```

## Getting Started

### 1. Start MongoDB with Docker

```bash
docker compose up -d
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```
PORT=5000
MONGO_URI=mongodb://admin:secret123@localhost:27017/doctor_appointments?authSource=admin
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
```

### 4. Run the server

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

## API Documentation

Swagger UI is available at:

```
http://localhost:5000/api-docs
```

To test protected routes, log in with `POST /api/users/login`, click **Authorize** and paste the token.

## Main Endpoints

| Group         | Base route           | Description                                |
| ------------- | -------------------- | ------------------------------------------ |
| Users         | `/api/users`         | Register, login, profile, roles (admin)    |
| Specialities  | `/api/specialities`  | List and manage specialities               |
| Doctors       | `/api/doctors`       | Doctor profiles, working hours, free slots |
| Appointments  | `/api/appointments`  | Book, list, confirm, cancel                |
| Notifications | `/api/notifications` | List, unread count, mark as read           |

## Roles

| Role     | Can do                                                        |
| -------- | ------------------------------------------------------------- |
| `USER`   | Book and cancel own appointments, view own notifications      |
| `DOCTOR` | Edit own profile and hours, confirm or complete appointments  |
| `ADMIN`  | Manage users, specialities and doctors, view all appointments |

## Creating the First Admin

Register a normal account, then change its `role` to `ADMIN` directly in MongoDB (with MongoDB Compass or `mongosh`). After that, use the API to manage the other users.

To create a doctor, an admin calls `POST /api/doctors` with the user id and a speciality id.

## Booking Flow

1. The patient picks a doctor and a date.
2. `GET /api/doctors/:id/slots?date=YYYY-MM-DD` returns the free slots.
3. `POST /api/appointments` books one of them.
4. The doctor confirms or cancels, and the patient gets a notification.

## Next Steps

- React frontend
- Seed script for test data
- Rate limiting on login
- Real-time notifications and emails
