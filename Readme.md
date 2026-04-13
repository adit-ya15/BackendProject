# VideoTube

A full-stack video platform built with a Node.js/Express API, MongoDB, and a React + Vite frontend.

This repository contains both:
- Backend API (`/src`)
- Frontend client (`/frontend`)

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Base and Routes](#api-base-and-routes)
- [Screenshots](#screenshots)
- [Deployment Notes](#deployment-notes)
- [License](#license)

## Overview

Null is a production-oriented learning project inspired by modern video platforms. It includes authentication, video workflows, social features, and dashboard endpoints in a modular backend architecture with a dedicated React frontend.

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (media upload)
- Multer (multipart handling)

### Frontend
- React
- Vite
- React Router
- Axios
- Framer Motion

## Project Structure

```text
.
|-- src/                    # Backend source
|   |-- controllers/
|   |-- db/
|   |-- middlewares/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- app.js
|   `-- index.js
|-- frontend/               # React frontend
|   |-- src/
|   |-- public/
|   `-- vite.config.js
|-- public/
|-- temp/
`-- package.json
```

## Features

- User authentication and authorization
- Access/refresh token flow
- Video upload and management
- Comments, likes, playlists, subscriptions, and tweets
- Dashboard and healthcheck routes
- Cookie-based + bearer-token-ready API behavior
- Frontend pages for home, dashboard, auth, channel, player, playlists, and more

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd BackendProject
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Configure environment variables

Create a `.env` file in the project root (same level as `package.json`) and add the required values listed below.

### 5. Run the backend

```bash
npm run dev
```

Backend starts on `http://localhost:8000` by default (or `PORT` from `.env`).

### 6. Run the frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

Frontend starts on Vite's dev server (typically `http://localhost:5173`).

## Environment Variables

Create `.env` in the root directory:

```env
# Server
PORT=8000
CORS_ORIGIN=http://localhost:5173

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Notes:
- `MONGODB_URI` should be the base URI; database name is appended in code.
- Keep all secrets out of version control.

## Available Scripts

### Backend (root)

```bash
npm run dev
```

Runs backend using nodemon.

### Frontend (`frontend/`)

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## API Base and Routes

Base path:

```text
/api/v1
```

Configured route groups:
- `/users`
- `/videos`
- `/comments`
- `/likes`
- `/tweets`
- `/subscriptions`
- `/playlist`
- `/dashboard`
- `/healthcheck`

### Endpoint Map

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/v1/healthcheck` | Health status of API |
| POST | `/api/v1/users/register` | Register a new user |
| POST | `/api/v1/users/login` | Authenticate user and issue tokens |
| POST | `/api/v1/users/logout` | Logout user and clear session tokens |
| POST | `/api/v1/users/refresh-token` | Refresh access token using refresh token |
| POST | `/api/v1/users/change-password` | Change current user password |
| GET | `/api/v1/users/current-user` | Get currently authenticated user |
| PATCH | `/api/v1/users/update-account` | Update account profile details |
| PATCH | `/api/v1/users/avatar` | Update user avatar |
| PATCH | `/api/v1/users/cover-image` | Update user cover image |
| GET | `/api/v1/users/c/:username` | Get channel profile by username |
| GET | `/api/v1/users/history` | Get watch history |
| GET | `/api/v1/videos` | List videos (with filters/pagination where supported) |
| POST | `/api/v1/videos` | Upload/create a video |
| GET | `/api/v1/videos/:videoId` | Fetch single video details |
| PATCH | `/api/v1/videos/:videoId` | Update video metadata |
| DELETE | `/api/v1/videos/:videoId` | Delete a video |
| PATCH | `/api/v1/videos/toggle/publish/:videoId` | Toggle published status |
| POST | `/api/v1/comments/:videoId` | Add a comment to a video |
| GET | `/api/v1/comments/:videoId` | List comments for a video |
| PATCH | `/api/v1/comments/c/:commentId` | Update a comment |
| DELETE | `/api/v1/comments/c/:commentId` | Delete a comment |
| POST | `/api/v1/likes/toggle/v/:videoId` | Toggle like on a video |
| POST | `/api/v1/likes/toggle/c/:commentId` | Toggle like on a comment |
| POST | `/api/v1/likes/toggle/t/:tweetId` | Toggle like on a tweet |
| GET | `/api/v1/likes/videos` | Get liked videos |
| POST | `/api/v1/subscriptions/c/:channelId` | Toggle channel subscription |
| GET | `/api/v1/subscriptions/c/:channelId` | Get channel subscribers |
| GET | `/api/v1/subscriptions/u/:subscriberId` | Get channels subscribed by a user |
| POST | `/api/v1/playlist` | Create a playlist |
| GET | `/api/v1/playlist/:playlistId` | Get playlist details |
| PATCH | `/api/v1/playlist/:playlistId` | Update playlist |
| DELETE | `/api/v1/playlist/:playlistId` | Delete playlist |
| PATCH | `/api/v1/playlist/add/:videoId/:playlistId` | Add video to playlist |
| PATCH | `/api/v1/playlist/remove/:videoId/:playlistId` | Remove video from playlist |
| GET | `/api/v1/playlist/user/:userId` | Get playlists for a user |
| POST | `/api/v1/tweets` | Create a tweet |
| GET | `/api/v1/tweets/user/:userId` | Get tweets by user |
| PATCH | `/api/v1/tweets/:tweetId` | Update a tweet |
| DELETE | `/api/v1/tweets/:tweetId` | Delete a tweet |
| GET | `/api/v1/dashboard/stats` | Fetch dashboard statistics |
| GET | `/api/v1/dashboard/videos` | Fetch channel videos for dashboard |

> Note: Some routes are protected and require a valid `Authorization: Bearer <accessToken>` header and/or cookies.

Example health endpoint:

```text
GET /api/v1/healthcheck
```

## Screenshots

Add screenshots to this section as the UI evolves.

### Home Page

![Home Page Screenshot](./docs/screenshots/home.png)

### Login Page

![Login Page Screenshot](./docs/screenshots/login.png)

### Dashboard

![Dashboard Screenshot](./docs/screenshots/dashboard.png)

### Video Player

![Video Player Screenshot](./docs/screenshots/video-player.png)

> Tip: Create a folder at `docs/screenshots/` and place images using the same names as above, or update paths as needed.

## Deployment Notes

- Set strict `CORS_ORIGIN` to your frontend domain in production.
- Store secrets in your hosting provider's environment manager.
- Ensure MongoDB network access and credentials are configured securely.
- Consider adding request logging, rate limiting, and monitoring for production hardening.

## License

Licensed under the MIT License.
