<div align="center">
  <h1 style="font-size:3rem; font-weight:bold;">🎵 Streamify</h1>
  <h3>Modern Chat & Streaming Platform</h3>
  <img src="https://img.shields.io/badge/Full%20Stack-React%20%7C%20Node%20%7C%20MongoDB-blue" alt="Tech Stack" />
</div>

---

## 📖 Table of Contents
- [About Streamify](#about-streamify)
- [Features](#features)
- [Architecture Overview](#architecture-overview)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Functionality Overview](#functionality-overview)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 📝 About Streamify

**Streamify** is a full-stack real-time chat and streaming application designed to revolutionize the way people connect and communicate online. With a focus on speed, security, and user experience, Streamify empowers users to sign up, log in, and engage in dynamic conversations and media sharing in a modern, intuitive environment. Whether you're looking to chat with friends, join group discussions, or collaborate in real time, Streamify provides a robust platform that adapts to your needs. Built with a scalable architecture using React, Node.js, and MongoDB, Streamify ensures seamless communication, instant notifications, and a responsive interface across all devices. Its advanced onboarding, profile management, and notification systems make it the ideal choice for both casual users and professional communities seeking a reliable and feature-rich chat and streaming solution.

---

## 🚀 Features

- **User Authentication:** Secure signup, login, and logout with JWT and cookies.
- **Onboarding:** Guided onboarding for new users.
- **Real-Time Chat:** Powered by Stream Chat API for instant messaging.
- **Profile Management:** Update personal info, avatar, and preferences.
- **Notifications:** Get alerts for new messages and activities.
- **Protected Routes:** Only authenticated users can access certain pages.
- **Responsive Design:** Works on desktop and mobile.
- **Dark/Light Mode:** Comfortable viewing for all users.

---

## 🏗️ Architecture Overview

### Frontend
- **Framework:** React (Vite for fast builds)
- **Routing:** React Router
- **State Management:** React Query
- **Pages:**
  - **HomePage:** Main dashboard and chat
  - **LoginPage / SignUpPage:** Authentication
  - **OnboardingPage:** User setup
  - **ChatPage:** Real-time chat interface
  - **CallPage:** (If enabled) Audio/video calls
  - **NotificationsPage:** Alerts and reminders
- **Components:**
  - **Navbar, Sidebar, ChatList, MessageInput, PageLoader, Toaster, etc.**

### Backend
- **Framework:** Node.js with Express
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, cookie-based sessions
- **API Endpoints:**
  - `/api/auth` - Auth routes (signup, login, logout, onboarding, me)
  - `/api/chat` - Chat operations
  - `/api/notifications` - Alerts and reminders
- **Controllers:** Business logic for each resource
- **Middleware:** Auth protection, error handling
- **Lib:** DB connection, Stream Chat integration

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Stream Chat API credentials


```

### Installation

#### Backend
```sh
cd backend
npm install
npm run dev
```

#### Frontend
```sh
cd frontend
npm install
npm run dev
```

---

## 🧩 Tech Stack
- **Frontend:** React, Vite, React Query, React Router
- **Backend:** Node.js, Express, Mongoose, JWT, Cookie-Parser
- **Database:** MongoDB
- **Other:** Stream Chat API

---

## ⚙️ Functionality Overview


Streamify provides a seamless, secure, and interactive experience for users to communicate, collaborate, and share in real time. The application is designed with a focus on usability, performance, and privacy, ensuring that users can enjoy a modern chat and streaming platform with minimal friction. Key flows and features include:

- **Sign Up / Login:**
  - Users can securely register and log in using their email and password. The authentication system uses JWT and cookies to ensure sessions are safe and persistent. The onboarding process guides new users through profile setup, language preferences, and avatar selection, making it easy to get started.

- **Chat:**
  - Real-time messaging is powered by the Stream Chat API, allowing users to send and receive messages instantly. Users can participate in one-on-one or group chats, share media, and view message history. The chat interface is designed for clarity and speed, with support for typing indicators, read receipts, and more.

- **Profile Management:**
  - Users can update their personal information, change their profile picture, set their native and learning languages, and manage their bio and location. The profile system is flexible, allowing users to personalize their experience and connect with others who share similar interests.

- **Notifications:**
  - Streamify keeps users informed with real-time notifications for new messages, friend requests, and important updates. The notification system is customizable, ensuring users receive only the alerts that matter to them, and can view a history of past notifications.

- **Protected Routes & Security:**
  - Sensitive pages and actions are protected by authentication middleware, ensuring only authorized users can access private data and features. All user data is securely stored and transmitted, with best practices for privacy and compliance.

- **Responsive & Modern UI:**
  - The application is fully responsive, adapting to desktops, tablets, and mobile devices. Users can switch between dark and light modes for optimal comfort, and the interface is designed for accessibility and ease of use.

---

## 📁 Project Structure

```text
Streamify/
  backend/
    src/
      controllers/
      lib/
      middleware/
      models/
      routes/
      server.js
    package.json
  frontend/
    src/
      assets/
      App.jsx
      main.jsx
    public/
    package.json
    vite.config.js
  README.md
```

---


## 🗄️ Database Schema Examples

### User Schema
```js
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  bio: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  nativeLanguage: { type: String, default: "" },
  learningLanguage: { type: String, default: "" },
  location: { type: String, default: "" },
  isOnboarded: { type: Boolean, default: false },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
```

### Chat Schema
```js
const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  isGroupChat: { type: Boolean, default: false },
  chatName: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

### Message Schema
```js
const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
```

### Notification Schema
```js
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["message", "friend_request", "system"], required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
```

---

## 🛣️ Roadmap
- [x] User authentication & onboarding
- [x] Real-time chat
- [x] Profile management
- [ ] Group chat
- [ ] Audio/video calls
- [ ] Notifications & reminders
- [ ] Mobile app (React Native)
- [ ] Integrations (export data, third-party APIs)
- [ ] PWA support

---

## 🤝 Contributing

Contributions are welcome! Please open issues and submit pull requests for new features, bug fixes, or improvements. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the ISC License.

---

<div align="center">
  <b>Streamify</b> &mdash; Connect, chat, and stream with ease!
</div>
