# 🏺 Pharaoh's Guide — Backend

<div align="center">

![Pharaoh's Guide](https://img.shields.io/badge/Pharaoh's%20Guide-AI%20Tourist%20Companion-gold?style=for-the-badge)

**Your AI-powered gateway to ancient Egypt 🇪🇬**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongoosejs.com)
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
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your keys in .env

# 4. Run the server
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

REDIS_URL=your_redis_url
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
    ├── middlewares/     # Auth & error middlewares
    ├── modules/
    │   ├── ai/          # AI storytelling & recognition
    │   ├── auth/        # Register, login, JWT
    │   ├── places/      # Egyptian landmarks
    │   ├── tripPlan/    # Itinerary planner
    │   └── user/        # User profile management
    └── utils/           # Helper functions
```

---

## 🌍 API Modules

| Module | Description |
|--------|-------------|
| `/auth` | Register, login, token refresh |
| `/user` | Profile management |
| `/places` | Browse Egyptian landmarks |
| `/tripPlan` | Generate & manage trip itineraries |
| `/ai` | AI storytelling & monument recognition |

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
