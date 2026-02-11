# 🚀 CareerGen AI — Resume Builder SaaS Backend

A production-grade AI-powered Resume Builder SaaS backend built with Node.js, Express, MongoDB, and JWT Authentication.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Security](#security)

---

## ✨ Features

- **Authentication**: Register, Login, JWT access tokens, bcrypt password hashing
- **Resume Management**: Full CRUD (Create, Read, Update, Delete) with ownership enforcement
- **AI Integration**: Generate professional summaries via OpenAI-compatible API
- **Security**: Helmet headers, rate limiting, CORS, input validation
- **Architecture**: MVC + Service Layer, clean separation of concerns
- **Docker Ready**: Multi-stage build, docker-compose with MongoDB

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcryptjs |
| Validation | Joi |
| Security | Helmet, express-rate-limit, CORS |
| Logging | Morgan |
| Containerization | Docker + Docker Compose |

---

## 📁 Project Structure

```
resume-ai-saas/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── logger.js          # Morgan logger config
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── resume.controller.js
│   │   └── ai.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification
│   │   ├── error.middleware.js # Global error handler
│   │   └── validate.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Resume.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── resume.routes.js
│   │   └── ai.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── resume.service.js
│   │   └── ai.service.js
│   ├── utils/
│   │   ├── ApiError.js        # Custom error class
│   │   └── asyncHandler.js    # Async wrapper
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── resume.validator.js
│   └── app.js                 # Express app setup
├── server.js                  # Entry point
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .dockerignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ and npm
- **MongoDB** (local or Atlas)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/nithin200526/careergen-ai-saas.git
cd careergen-ai-saas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Start development server
npm run dev
```

The server will start on `http://localhost:5000`.

### Verify Installation

```bash
curl http://localhost:5000/health
```

---

## 📡 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | ❌ |
| POST | `/api/v1/auth/login` | Login user | ❌ |
| GET | `/api/v1/auth/me` | Get current user | ✅ |

### Resumes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/resumes` | Create resume | ✅ |
| GET | `/api/v1/resumes` | Get all user resumes | ✅ |
| GET | `/api/v1/resumes/:id` | Get single resume | ✅ |
| PUT | `/api/v1/resumes/:id` | Update resume | ✅ |
| DELETE | `/api/v1/resumes/:id` | Delete resume | ✅ |

### AI
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/ai/generate-summary` | Generate professional summary | ✅ |

### Example Requests

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Create Resume:**
```bash
curl -X POST http://localhost:5000/api/v1/resumes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Software Engineer Resume",
    "personalInfo": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA"
    },
    "summary": "Experienced software engineer...",
    "skills": [{"name": "Node.js", "level": "expert"}]
  }'
```

**Generate AI Summary:**
```bash
curl -X POST http://localhost:5000/api/v1/ai/generate-summary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jobTitle": "Senior Software Engineer",
    "skills": [{"name": "Node.js"}, {"name": "React"}, {"name": "MongoDB"}],
    "tone": "professional"
  }'
```

---

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | — |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `AI_API_KEY` | AI provider API key | — |
| `AI_API_URL` | AI API endpoint | OpenAI default |
| `AI_MODEL` | AI model name | `gpt-3.5-turbo` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |
| `CORS_ORIGIN` | Allowed CORS origin | `*` |

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Using Docker Only

```bash
# Build the image
docker build -t resume-ai-saas .

# Run the container
docker run -d \
  --name resume-ai-api \
  -p 5000:5000 \
  --env-file .env \
  resume-ai-saas
```

---

## ☁️ Production Deployment

### Option 1: AWS EC2 / DigitalOcean Droplet

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Install Docker and Docker Compose
sudo apt update && sudo apt install -y docker.io docker-compose

# 3. Clone the repository
git clone https://github.com/nithin200526/careergen-ai-saas.git
cd careergen-ai-saas

# 4. Set up environment
cp .env.example .env
nano .env  # Edit with production values

# 5. Deploy
docker-compose up -d --build

# 6. Set up Nginx reverse proxy (optional)
sudo apt install -y nginx
```

### Option 2: Railway / Render

1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Deploy — the platform handles the rest

### Option 3: MongoDB Atlas (Cloud DB)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Set `MONGO_URI` in your `.env` to the Atlas connection string

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use a strong, unique `JWT_SECRET`
- [ ] Use MongoDB Atlas or a managed MongoDB instance
- [ ] Set `CORS_ORIGIN` to your frontend domain
- [ ] Enable HTTPS via Nginx or a reverse proxy
- [ ] Set up log aggregation (e.g., Datadog, Logtail)
- [ ] Configure a process manager (PM2) or use Docker restart policies
- [ ] Set up monitoring and alerting

---

## 🔒 Security

- **Helmet**: Sets various HTTP headers to prevent common attacks
- **Rate Limiting**: Prevents brute-force and DDoS attacks (100 req / 15 min)
- **CORS**: Restricts cross-origin requests to allowed domains
- **Input Validation**: Joi validates and sanitizes all request bodies
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT**: Stateless authentication with configurable expiration
- **Non-root Docker**: Container runs as unprivileged user
- **Error Handling**: Never exposes stack traces in production

---

## 📄 License

ISC

---

Built with ❤️ by [nithin200526](https://github.com/nithin200526)
