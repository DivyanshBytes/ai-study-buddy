# AI Study Buddy 📚

**Your personal AI-powered learning companion.**

AI Study Buddy is a MERN-stack application that helps students learn smarter by interacting with their study materials through an AI-powered chatbot. Upload your learning resources and ask questions to get relevant, context-aware answers instead of searching through lengthy documents manually.

## ✨ Features

- **AI-Powered Chatbot** — Ask questions about your study materials and get contextual answers.
- **Document-Based Learning** — Use uploaded study resources as the foundation for your conversations.
- **Retrieval-Augmented Generation (RAG)** — Retrieve relevant content from study materials to help generate more accurate, context-aware responses.
- **Semantic Search** — Find relevant information based on meaning, not just exact keyword matches.
- **Full-Stack Architecture** — React frontend with a Node.js and Express backend.
- **AI Integration** — Leverage the Gemini API to generate intelligent responses.
- **Database Integration** — MongoDB for persistent application data.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend UI |
| Node.js | Backend runtime |
| Express.js | REST API and server |
| MongoDB | Database |
| Gemini API | AI-powered responses |
| RAG | Context-aware question answering |
| Semantic Search | Relevant content retrieval |

## 🏗️ Architecture

```text
User
  │
  ▼
React Frontend
  │
  ▼
Node.js + Express API
  │
  ├── Document Processing
  │
  ├── Semantic Retrieval
  │       │
  │       ▼
  │   Relevant Context
  │
  └── Gemini API
          │
          ▼
    AI-Generated Answer
          │
          ▼
     React Frontend
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- MongoDB
- A Gemini API key

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd AI-Study-Buddy
```

### 2. Install Dependencies

Install the frontend and backend dependencies in their respective directories.

```bash
cd client
npm install

cd ../server
npm install
```

*Adjust the directory names to match your project structure.*

### 3. Configure Environment Variables

Create a `.env` file in your backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Add any other environment variables required by your application. Never commit API keys, passwords, or private credentials to GitHub.

### 4. Run the Application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in a separate terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed by your frontend development server.

## 📂 Project Structure

```text
AI-Study-Buddy/
├── client/              # React frontend
│   ├── src/
│   └── package.json
├── server/              # Node.js and Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── package.json
├── .gitignore
└── README.md
```

*The structure above is illustrative; update it to reflect your actual repository.*

## 🔐 Security

- Store API keys and database credentials in environment variables.
- Keep `.env` files out of version control.
- Validate and sanitize user inputs.
- Apply appropriate authentication and authorization where required.

## 🎯 Project Goals

AI Study Buddy aims to make self-study more interactive and efficient by combining modern web technologies with AI-driven information retrieval. The project explores how Retrieval-Augmented Generation and semantic search can turn static learning resources into an interactive learning experience.

## 🔮 Future Improvements

- Support for additional document formats.
- Conversation history and saved chats.
- Personalized quizzes and flashcards.
- AI-generated summaries and revision notes.
- Improved document retrieval and answer citations.
- User dashboards and learning progress tracking.

## 👨‍💻 Author

**Divyansh Kumar**

- GitHub: [DivyanshBytes](https://github.com/DivyanshBytes)
- LinkedIn: [Divyansh](https://www.linkedin.com/in/divyansh-kumar-04860b28a/)

---

If you find this project interesting, consider giving the repository a ⭐ on GitHub!

*Built to make learning smarter, one question at a time.*
