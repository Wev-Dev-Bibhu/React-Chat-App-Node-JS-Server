# React Chat App (Backend)

A simple and scalable **real-time chat application frontend** built with **React**, supporting **multiple backends** (Node.js).

## 🌐 Live Demo

👉 https://spring-react-chatapp.netlify.app/

---

## ✨ Features

- Real-time one-to-one messaging
- Clean and user-friendly UI
- Fully responsive (desktop & mobile)
- Backend support:
  - **Node.js backend (Render)**
- Optimized API handling using React Context

---

## 🛠 Tech Stack

### Frontend

- React
- Context API
- Hooks (`useState`, `useEffect`, `useMemo`)
- CSS / Responsive UI

### Backend (Supported)

- Node.js + PostgreSQL

### Deployment

- Netlify (Frontend)
- Render (Backend)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

---

### Installation

```bash
git clone https://github.com/yourusername/react-dev-frontend.git
cd react-dev-frontend
npm install


## 🗄 Database Schema (PostgreSQL)

The following SQL queries are required to set up the database for the chat application.

### 👤 Users Table

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    login BOOLEAN DEFAULT true,
    avatar TEXT,
    about TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email
ON public.users(email);

CREATE INDEX idx_users_deleted_at
ON public.users(deleted_at);

CREATE TABLE public.messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    message_text TEXT NOT NULL,
    read_status BOOLEAN DEFAULT false,
    delivered_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,

    CONSTRAINT fk_sender
        FOREIGN KEY (sender_id)
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_recipient
        FOREIGN KEY (recipient_id)
        REFERENCES public.users(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_messages_sender_recipient
ON public.messages(sender_id, recipient_id);

CREATE INDEX idx_messages_deleted_at
ON public.messages(deleted_at);

CREATE INDEX idx_messages_updated_at
ON public.messages(updated_at);
```
