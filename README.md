# Motion Lore: AI-Powered Ballet Subtitle Generator

Motion Lore is an intelligent, context-aware subtitle generator designed specifically for ballet performances. By leveraging advanced multimodal AI models, the application analyzes video recordings of ballet and translates non-verbal gestures, pantomime, dramatic expressions, and musical stages into structured narrative subtitles.

---

## Architecture Overview

The system is split into a modern decoupled architecture consisting of a Next.js frontend client and a high-performance FastAPI backend server.

```
+------------------+           +------------------+           +------------------+
|                  |  POST     |                  |  Analyze  |                  |
| Next.js Frontend | --------> | FastAPI Backend  | --------> | Gemini Multi-    |
| (React, Stage3D) | <-------- | (Async Queue)    | <-------- | modal AI Engine  |
|                  |  Poll     |                  |           |                  |
+------------------+           +------------------+           +------------------+
         |                               |                             |
         v                               v                             v
+------------------+           +------------------+           +------------------+
|                  |           |                  |           |                  |
| Local Storage    |           | AWS S3           |           | AWS DynamoDB     |
| (Subtitle Cache) |           | (Video Storage)  |           | (Job States)     |
|                  |           |                  |           |                  |
+------------------+           +------------------+           +------------------+
```

### 1. Frontend Client
- **Framework**: Next.js (App Router) and React.
- **Visual Presentation**: Features an immersive, responsive 3D parallax theatre stage setting using Next.js Image Optimization and mathematical cursor-distance alignment constraints.
- **Playback & Integration**:
  - Implements the YouTube IFrame API to embed standard links, programmatically polling video playtime.
  - Automatically branches to an HTML5 video player for custom uploaded files, streaming via the backend's presigned S3 endpoints.
  - Subtitle cues are bound to the video time context, enabling real-time overlay sync and interactive click-to-seek seeking.

### 2. Backend API
- **Framework**: FastAPI (Python 3.13) utilizing asynchronous lifespans and background tasks for non-blocking analysis processing.
- **Database & Storage**:
  - **Amazon S3**: Temporarily holds uploaded video files for analysis.
  - **Amazon DynamoDB**: Maintains job progress states, indexing metadata, and caches finalized subtitle results.
  - **Local Memory Fallbacks**: Automatically falls back to local storage and in-memory databases if AWS credentials are not configured or fail smoke checks.

### 3. AI Analysis Engine
- **Core Engine**: Google Gemini Multimodal APIs.
- **Pipeline**:
  1. The video file or YouTube stream is ingested.
  2. The Gemini engine processes the video frames and audio context.
  3. The model extracts spatial-temporal movements, identifying classical ballet mime gestures (e.g., oath of love, heart-clasping, pleading) and emotional shifts.
  4. Structured text cues are returned containing timestamps and tagging categories (`PANTOMIME`, `EMOTION`, `NARRATIVE`).

---

## Subtitle Schema / Data Model

Subtitle tracks are stored in DynamoDB and local caches under the following schema:

```json
{
  "video_id": "sha256_content_hash",
  "title": "Swan Lake Act II",
  "source_url": "https://www.youtube.com/watch?v=...",
  "ballet_context": {
    "setting": "A moonlit lakeside shore surrounded by ruins",
    "tone": "Tragic, melancholic, and romantic",
    "characters": [
      { "name": "Odette", "role": "The Swan Queen" },
      { "name": "Prince Siegfried", "role": "The Prince" }
    ]
  },
  "cues": [
    {
      "start_ms": 75000,
      "end_ms": 78000,
      "gesture_type": "PANTOMIME",
      "text": "She extends her arms, making the mime gesture for a sacred oath of love."
    }
  ]
}
```

---

## Installation & Setup

### Prerequisites
- Python 3.13 or higher
- Node.js 18.x or higher
- AWS Account (S3 and DynamoDB tables configured)
- Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and configure your environment file:
   ```bash
   cp .env.example .env
   ```
   Provide the following parameters:
   - `GEMINI_API_KEY`: Your Google Gemini developer key.
   - `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`: AWS credentials.
   - `DYNAMODB_TABLE` & `DYNAMODB_JOBS_TABLE`: Target DynamoDB tables.
   - `S3_BUCKET`: Target S3 bucket.

3. Install dependencies and start the backend development server using `uv`:
   ```bash
   uv sync
   uv run uvicorn backend.main:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   The client will be running at `http://localhost:3000`.

---

## API Documentation

### 1. Ingest Video
- **Endpoint**: `POST /api/analyze`
- **Payload**: `Multipart/Form-Data`
  - `video_url` (Optional): String (YouTube URL)
  - `file` (Optional): Uploaded video file
  - `title` (Optional): String
- **Response**:
  ```json
  {
    "status": "queued",
    "job_id": "uuid-v4-string"
  }
  ```

### 2. Check Job Status
- **Endpoint**: `GET /api/job/{job_id}`
- **Response**:
  ```json
  {
    "job_id": "uuid-v4-string",
    "status": "processing | done | failed",
    "subtitle_track": null,
    "error": null
  }
  ```

### 3. Fetch Cached Subtitles
- **Endpoint**: `GET /api/subtitles/{video_id}`
- **Response**: Returns the fully analyzed `SubtitleTrack` JSON payload if cached.

### 4. Fetch Presigned Video Playback URL
- **Endpoint**: `GET /api/video/{job_id}`
- **Response**:
  ```json
  {
    "url": "https://s3.amazonaws.com/bucket/uploads/...?"
  }
  ```
