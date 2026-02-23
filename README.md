# ido_eyali_helfy_task

# Task Manager App

A simple fullstack Task Manager application built with **React (Vite)** for the frontend and **Express + Node.js** for the backend.

The app allows users to create, view, update, delete, and filter tasks.  
Tasks are displayed in an animated endless carousel.

---

## Tech Stack

Frontend:
- React (Vite)
- Plain CSS

Backend:
- Node.js
- Express.js
- In-memory data storage (no database)

---

# Setup and Installation

## Clone the repository

```bash
git clone https://github.com/idoeyali/ido_eyali_helfy_task.git
cd task-manager
```
### Backend

```bash
cd backend
npm install
```

## Frontend

```bash
cd frontend
npm install
```

---

## How to Run

### Run Backend

```bash
cd backend
npm run dev
```

The API runs at **http://localhost:4000**.

---

## API Documentation
GET /api/tasks- 
POST /api/tasks- 
PUT /api/tasks/:id- 
DELETE /api/tasks/:id- 
PATCH /api/tasks/:id/toggle

## Design Decisions & Assumptions

* Tasks are stored in memory (as required), so data resets when the server restarts.

* PUT endpoint performs full update to match REST conventions.

* The carousel uses duplicated task arrays to create a seamless infinite scrolling effect.

* requestAnimationFrame is used for smooth animation.

* Auto-scroll pauses when the user interacts with the carousel for better usability.

* Simple CSS (no frameworks) was used to keep the implementation lightweight and clear.

## Time Spent
Backend - 1.5 Hours
Frontend - 1 Hour and 45 minutes
Styling and polish - 45 minutes
