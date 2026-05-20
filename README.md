# Video Streaming Platform (V1)

A backend-focused video streaming platform built with **Node.js, Express.js, MongoDB, FFmpeg, HLS, and NGINX** that simulates how real-world video streaming systems process, store, and deliver media content.

This project demonstrates the complete lifecycle of uploaded videos:
upload → process → transcode → store → stream.

---

## Features

- User authentication
- Video upload API
- MongoDB integration
- User & Video models
- Video metadata storage
- Background video transcoding
- FFmpeg MP4 → HLS conversion
- HLS playlist generation (`.m3u8`)
- Video segment generation (`.ts`)
- NGINX static file serving
- HTML frontend pages
- RESTful API architecture
- Video processing status tracking
- Separation between API and media delivery

---

## Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Video Processing
- FFmpeg
- HLS (HTTP Live Streaming)

### Web Server / Media Delivery
- NGINX

### Frontend
- HTML
- CSS
- Vanilla JavaScript

---

# System Architecture

```text
Client (Browser)
      │
      ▼
NGINX (Serve HLS Static Files)
      │
      ▼
Node.js / Express API
      │
      ▼
MongoDB
      │
      ▼
Transcoding Worker
      │
      ▼
FFmpeg
      │
      ▼
HLS Storage (.m3u8 + .ts)
```

This architecture separates:

- API responsibilities
- Video transcoding
- Media delivery
- Database persistence

Which follows the same logic used in scalable streaming systems.

---

# Project Flow

## 1) User Uploads Video
The client uploads an MP4 file.

## 2) Store Original File
The server stores the raw uploaded file.

## 3) Create Database Record
A video document is created in MongoDB.

## 4) Trigger Transcoding
A worker starts FFmpeg processing.

## 5) Convert to HLS
FFmpeg creates:
- `.m3u8` playlist
- `.ts` segments

## 6) Store HLS Files
Converted files are saved in HLS storage.

## 7) Serve Video
NGINX serves static HLS files.

## 8) Playback
Frontend uses HLS.js to stream the video.

---

# Folder Structure

```bash
video-streaming-expressjs/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── videoController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Video.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── videoRoutes.js
│   │
│   ├── workers/
│   │   └── transcoder.js
│   │
│   └── app.js
│
├── uploads/
│
├── hls/
│   └── VIDEO_ID/
│       ├── playlist.m3u8
│       ├── segment0.ts
│       ├── segment1.ts
│       └── ...
│
├── public/
│   ├── index.html
│   ├── upload.html
│   ├── login.html
│   └── player.html
│
├── nginx/
│   └── nginx.conf
│
├── .env
├── package.json
└── server.js
```

---

# Database Models

## User Model
Stores:
- username
- email
- password (hashed)

## Video Model
Stores:
- title
- original file path
- HLS path
- upload owner
- transcoding status
- createdAt

---

# API Endpoints

## Authentication

### Register User
```http
POST /api/auth/register
```

### Login User
```http
POST /api/auth/login
```

Returns JWT token.

---

## Videos

### Upload Video
```http
POST /api/videos/upload
```

Uploads MP4 and triggers transcoding.

### Get Video
```http
GET /api/videos/:id
```

Returns metadata.

### Stream Playlist
```http
GET /hls/:videoId/playlist.m3u8
```

Served by NGINX.

---

# Running Locally

## 1) Clone Repository

```bash
git clone https://github.com/ahmed-magdy2002/video-streaming-expressjs.git
cd video-streaming-expressjs
```

---

## 2) Install Dependencies

```bash
npm install
```

---

## 3) Create Environment Variables

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
```

---

## 4) Install FFmpeg

Add FFmpeg to system PATH.

Check installation:

```bash
ffmpeg -version
```

---

## 5) Configure NGINX

Set NGINX to serve:

```bash
/hls/
```

as static files.

---

## 6) Start Server

```bash
npm run dev
```

---

# Error Handling

Current project includes handling for:

- Missing uploaded file
- Invalid authentication token
- Video not found
- FFmpeg process failure
- Database operation errors
- Invalid request payloads

---

# Challenges Solved

This project helped me understand:

- HTTP streaming
- Range requests
- HLS playlists
- Video segmentation
- Background workers
- FFmpeg integration
- NGINX static serving
- Backend architecture
- File lifecycle management
- Separation of concerns
- API vs content delivery logic

---

# Future Improvements

Planned upgrades:

- Redis + BullMQ queue
- Multi-resolution adaptive bitrate streaming
- Dockerization
- S3 object storage
- CDN integration
- Monitoring & logging
- Retry mechanisms
- Rate limiting
- Production-grade deployment
- Better scalability

---

# Why This Project Matters

Real streaming platforms don’t directly stream uploaded MP4 files from backend APIs.

They separate:
- Upload logic
- Processing
- Transcoding
- Storage
- Delivery

This project follows that architecture in a simplified first version.

---

# Author

Ahmed Magdy

GitHub:
https://github.com/ahmed-magdy2002

---

# License

This project is for learning and backend architecture exploration.
