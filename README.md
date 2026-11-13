# CollabSphere

CollabSphere is a modern, collaborative project management platform designed to streamline teamwork through real-time communication and AI-assisted planning.

## 🚀 Features

- **Project Management**: Create and manage projects with detailed descriptions and tech stacks.
- **Real-time Collaboration**:
  - **Live Chat**: Project-specific chat rooms powered by Socket.io.
  - **Team Connections**: Invite friends and colleagues to join your projects via email.
- **Task Board**: Organize work with a Kanban-style task board (Pending, In Progress, Completed).
- **AI Assistant**: Built-in AI module for context-aware task planning and project analysis (Integration ready).
- **Secure Authentication**: JWT-based user authentication and protected routes.
- **Modern UI**: Sleek, responsive interface built with React, TailwindCSS, and Framer Motion.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React](https://react.dev/) (with [Vite](https://vitejs.dev/))
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Real-time**: [Socket.io-client](https://socket.io/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://mongoosejs.com/))
- **Real-time**: [Socket.io](https://socket.io/)
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt
- **AI Integration**: OpenAI API structure (Configurable)

## 📂 Project Structure

```
CollabSphere/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components (ChatPanel, TaskBoard, etc.)
│   │   ├── pages/          # Application pages (Workspace, Dashboard, Login, etc.)
│   │   ├── store/          # Zustand state stores
│   │   └── services/       # API and Socket services
│   └── ...
├── server/                 # Backend Node.js/Express Application
│   ├── models/             # Mongoose schemas (User, Project, Task, Invitation)
│   ├── routes/             # API routes
│   ├── controllers/        # Request handlers
│   ├── socket/             # Real-time event handlers
│   └── ai/                 # AI prompt building and client logic
└── ...
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd CollabSphere
    ```

2.  **Setup Backend**

    ```bash
    cd server
    npm install
    ```

    - Create a `.env` file in the `server` directory:
      ```env
      PORT=5000
      MONGODB_URI=mongodb://localhost:27017/collabsphere
      JWT_SECRET=your_super_secret_key
      OPENAI_API_KEY=your_openai_api_key  # Optional for AI features
      ```

3.  **Setup Frontend**
    ```bash
    cd ../client
    npm install
    ```

### Running the Application

1.  **Start the Backend Server**

    ```bash
    cd server
    npm run dev
    ```

    The server will run on `http://localhost:5000`.

2.  **Start the Frontend Client**
    ```bash
    cd client
    npm run dev
    ```
    The application will open at `http://localhost:5173`.

## 🤝 Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the ISC License.
