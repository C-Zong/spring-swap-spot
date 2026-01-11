# Swap Spot

A full-stack e-commerce web application built for learning and experimentation.

Swap Spot is a personal project where users can list items, browse listings, favorite products, manage carts, and chat with other users.  
The goal of this project is **hands-on full-stack practice**, not building a production-ready marketplace.

---

## ✨ Features

### Core

- User authentication (JWT, cookie-based)
- Item listing & management (create / edit / delete)
- Browse & search items
- Favorites (saved items)
- Shopping cart (grouped by seller)
- User profile & seller pages

### Messaging

- Direct messages between users
- Thread-based conversations
- Rich-text message content (JSON-based editor output)
- Unread tracking with Redis

### Dashboard

- Personal dashboard
- My listings / favorites
- Trade history

---

## 🛠 Tech Stack

### Frontend

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- Chart.js
- Tiptap (rich text editor)

### Backend

- **Spring Boot**
- **MyBatis-Plus**
- **JWT Authentication**
- **MySQL (primary database)**
- Redis (cache & unread tracking)

### Infrastructure

- AWS S3 (image storage)
- AWS EC2 (Ubuntu)
- Dockerized deployment via Docker Compose
- Nginx as a reverse proxy for frontend and backend
- Frontend (Next.js) and backend (Spring Boot) run as separate containers

---

## 📦 Database Design

- Users
- Items & item images
- Favorites
- Cart items
- Purchase records
- DM threads & messages

Relational data is stored in **MySQL**, while Redis is used for:

- unread message tracking (lightweight state caching)

---

## 🚀 Versions

- Node.js 22
- Java 21

---

## ⚠️ Notes & Limitations

- This project prioritizes learning and shipping features over perfect architecture or optimization.
- Frontend code may be messy in places as features evolved quickly, and ESLint rules are not strictly enforced.
- Some implementations are not performance-optimized, as efficiency was not the main focus at this stage.
- Certain environment variables were temporarily committed to the repository during development. These credentials (e.g. EC2 / S3–related resources) are short-lived and will be deleted, and the site is not intended for real-world use or long-term deployment.

---

## 🧠 Thoughts

- I need to plan better before writing code, especially for larger features.
- I need to write clearer comments to make the code easier to understand and maintain.
- I need to improve my Linux command-line skills.
- I need to get more hands-on experience with Docker.

---

## 📌 Features That Could Be Added

- Better search capabilities (e.g. Elasticsearch).
- Improved user experience, such as:
  - Recommendation systems based on tags or user behavior
  - Order tracking and history
  - Seller comments or reviews
- Message queue–based asynchronous processing (e.g. for notifications or background tasks)

---

## 📄 License

- This project is for personal learning and experimentation.
