
# 🏺 Pharaoh's Guide — Backend

<div align="center">

![Pharaoh's Guide](https://img.shields.io/badge/Pharaoh's%20Guide-AI%20Tourist%20Companion-gold?style=for-the-badge)

**Your AI-powered gateway to ancient Egypt 🇪🇬**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongoosejs.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com)
[![Tests](https://img.shields.io/badge/Tests-33%20passing-brightgreen?style=flat-square&logo=jest)](https://jestjs.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## 📖 About

**Pharaoh's Guide** is an intelligent AI-powered tourist companion that transforms how visitors experience Egypt's ancient wonders.

> *"You now stand before the temple where Ramses II declared his eternal glory…"* 🎬

Instead of boring info dumps, Pharaoh's Guide delivers **immersive AI storytelling**, **personalized itineraries**, and **real-time monument recognition** — making every tourist feel like the hero of their own historical adventure.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Smart Trip Planner** | Personalized day-by-day plans based on days, budget & interests |
| 🤖 **AI Storytelling** | Immersive narratives powered by Google Gemini & OpenAI |
| 📸 **Monument Recognition** | Upload a photo and get the full story of any landmark |
| 💬 **Real-time Chat** | Live communication via Socket.io |
| ❤️ **Favorites** | Save and manage your favorite places |
| 👤 **User Profiles** | Full auth system with JWT |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **AI Engine** | Google Generative AI (Gemini) + OpenAI |
| **Auth** | JWT + bcryptjs |
| **Image Upload** | Cloudinary + Multer |
| **Real-time** | Socket.io |
| **Caching** | Redis (ioredis) |
| **Containerization** | Docker + Docker Compose |
| **Testing** | Jest |
| **Validation** | Zod |
| **Security** | Helmet + Rate Limiting |
| **API Docs** | Swagger / OpenAPI 3.0 |

---

## 🔒 Security

| Feature | Details |
|---------|---------|
| 🛡️ **Helmet** | Secure HTTP headers |
| 🚦 **Rate Limiting** | Redis-based, 100 req/min globally, 10 req/15min on auth |
| ✅ **Zod Validation** | Input validation on all endpoints |
| 🧹 **XSS Sanitization** | Sanitize all incoming requests |
| 🔐 **JWT Auth** | Access + Refresh token system |

---

## 🤖 AI Integration

| Feature | Details |
|---------|---------|
| 🗺️ **Trip Plan Generator** | Generates personalized day-by-day itineraries using AI |
| 📖 **Place Storyteller** | Immersive 2nd-person historical narratives for each landmark |
| 💬 **AI Tour Guide Chat** | Conversational AI specialized in Ancient Egyptian civilization |
| 🔄 **Multi-model Fallback** | Tries multiple AI models automatically if one fails |
| ⚡ **Redis Caching** | AI responses cached to reduce API calls |
| 🌍 **Bilingual** | Full Arabic and English support |

---

## 🚀 Getting Started

### Prerequisites
```
Node.js 18+
MongoDB
Redis
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ahmed0ty/Pharaoh-s-Guide_Backend.git
cd Pharaoh-s-Guide_Backend

# 2. Install dependencies
cd src
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your keys in .env

# 4. Run the server
npm start
```

---

## 🐳 Running with Docker

The easiest way to run the full stack locally (Node.js + MongoDB + Redis) with a single command.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Run

```bash
# 1. Clone the repository
git clone https://github.com/ahmed0ty/Pharaoh-s_Guide_Backend.git
cd Pharaoh-s_Guide_Backend/backend

# 2. Set up environment variables
cp .env.example .env
# Fill in your keys in .env

# 3. Start all services
docker-compose up
```

The server will be available locally at `http://localhost:3000` 🚀

> **Production:** The API is deployed on Render.

### Useful Commands

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start all containers |
| `docker-compose up -d` | Start in background |
| `docker-compose down` | Stop all containers |
| `docker-compose logs -f` | View live logs |

> **Note:** No need to install MongoDB or Redis locally — Docker handles everything!

---

## 🧪 Testing

The project uses **Jest** for unit testing with mocked dependencies — no real database connection needed.

### Run Tests

```bash
cd src
npm test
```

### Test Coverage

| Module | Tests |
|--------|-------|
| `auth` | 13 ✅ |
| `places` | 8 ✅ |
| `user` | 6 ✅ |
| `tripPlan` | 6 ✅ |
| **Total** | **33 ✅** |

---

## 📚 API Documentation

Swagger UI is available at:
```
http://localhost:3000/api/docs
```

| Module | Endpoints |
|--------|-----------|
| `/auth` | 7 endpoints |
| `/user` | 6 endpoints |
| `/places` | 5 endpoints |
| `/trip-plans` | 4 endpoints |
| `/ai` | 3 endpoints |

---

## 🔑 Environment Variables

Create a `.env` file in the `src/` directory:

```env
PORT=
MONGO_URI=
JWT_SECRET=
REFRESH_SECRET=

OPENROUTER_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 📁 Project Structure

```
backend/
└── src/
    ├── config/          # DB & app configuration
    ├── DB/
    │   ├── connection/  # MongoDB connection
    │   └── models/      # Mongoose models
    ├── middlewares/     # Auth, validation & error middlewares
    ├── modules/
    │   ├── ai/          # AI storytelling & recognition
    │   ├── auth/        # Register, login, JWT
    │   ├── places/      # Egyptian landmarks
    │   ├── tripPlan/    # Itinerary planner
    │   └── user/        # User profile management
    └── utils/           # Helper functions & logger
```

---

## 🌍 API Modules

| Module | Description |
|--------|-------------|
| `/auth` | Register, login, token refresh |
| `/user` | Profile management & favorites |
| `/places` | Browse Egyptian landmarks |
| `/trip-plans` | Generate & manage trip itineraries |
| `/ai` | AI storytelling, story & chat |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ for Egypt 🇪🇬 — *Bringing the Pharaohs back to life, one story at a time.*

</div>
