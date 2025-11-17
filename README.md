# TaskFlow AI - Smart Task Manager with AI & Scrum

<div align="center">

![TaskFlow AI](https://img.shields.io/badge/TaskFlow-AI-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern task management app with Kanban & Scrum boards, AI-powered features, sprint planning, and productivity analytics.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [AI Setup](#-ai-setup)

</div>

---

## 🚀 Features

### Kanban Board
- ✅ **Drag & Drop Interface** - Smooth task movement between columns
- 🎯 **AI-Powered Prioritization** - Automatic priority assignment
- ⏱️ **Time Estimation** - AI suggests estimated completion time
- 📊 **Visual Progress** - Real-time task status tracking

### Scrum Board
- 🏃 **Sprint Planning** - Create and manage sprints
- 📈 **Story Points** - Fibonacci estimation (0,1,2,3,5,8,13,21)
- 🤖 **AI Story Point Estimation** - Smart complexity analysis
- 🎯 **Sprint Metrics** - Progress tracking, velocity, burndown
- 🔄 **Backlog Management** - Drag tasks from backlog to sprints
- ✅ **Sprint Completion** - Retrospectives and summaries

### AI Features
- **Bulk Task Analysis** - Analyze multiple tasks at once
- **Priority Assignment** - Intelligent categorization
- **Story Point Estimation** - AI-powered complexity scoring
- **Sprint Summaries** - AI-generated sprint insights
- **Sprint Predictions** - Forecast sprint completion
- **Daily/Weekly Summaries** - Productivity reports

### Core Features
- 🔐 **Firebase Authentication** - Google & Email login
- 💾 **Local Persistence** - Tasks & sprints saved to localStorage
- 📊 **Analytics Dashboard** - Charts and productivity metrics
- 🎨 **Beautiful UI** - Modern design with smooth animations
- 🌙 **Dark Mode** - Eye-friendly theme support

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **JavaScript** - ES6+ features

### State Management
- **Redux Toolkit** - Efficient state management
- **React Redux** - React bindings

### Styling & UI
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Beautiful, accessible components
- **Framer Motion** - Smooth animations
- **Lucide React** - Clean icons

### Functionality
- **@dnd-kit** - Drag and drop for both boards
- **Recharts** - Analytics charts
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for AI APIs

### Backend Services
- **Firebase Auth** - User authentication
- **OpenRouter / Groq** - AI inference APIs

---

## 📋 Prerequisites

- **Node.js** 18+ and npm installed
- **Firebase Project** - [Create one](https://console.firebase.google.com)
- **AI API Key** (choose one):
  - **OpenRouter** (Recommended) - [Get free key](https://openrouter.ai/keys)
  - **Groq** (Backup) - [Get free key](https://console.groq.com)

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Ankita27052002/TaskFlow-AI.git
cd TaskFlowAI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# OpenRouter API Configuration (Recommended)
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free

# Groq API Configuration (Backup)
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_GROQ_MODEL=llama-3.1-70b-versatile

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🤖 AI Setup Guide

### Option 1: OpenRouter (Recommended - Free Llama 3.3)

1. **Get API Key**:
   - Visit https://openrouter.ai/keys
   - Sign up/Login with Google or Email
   - Click "Create Key"
   - Copy your API key

2. **Update `.env`**:
   ```env
   VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxx
   VITE_OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
   ```

3. **Free Models Available**:
   - `meta-llama/llama-3.3-70b-instruct:free` (Recommended)
   - `meta-llama/llama-3.1-8b-instruct:free`
   - `google/gemma-7b-it:free`
   - `microsoft/phi-3-mini-128k-instruct:free`

### Option 2: Groq (Backup - Fast Inference)

1. **Get API Key**:
   - Visit https://console.groq.com
   - Sign up and navigate to API Keys
   - Create new key

2. **Update `.env`**:
   ```env
   VITE_GROQ_API_KEY=gsk_xxxxx
   VITE_GROQ_MODEL=llama-3.1-70b-versatile
   ```

3. **Available Models**:
   - `llama-3.1-70b-versatile` (Best quality)
   - `llama-3.1-8b-instant` (Fastest)
   - `mixtral-8x7b-32768` (Large context)

**Note**: The app automatically uses OpenRouter if configured, otherwise falls back to Groq.

---

## 🔥 Firebase Setup

1. **Create Firebase Project**:
   - Go to https://console.firebase.google.com
   - Click "Add Project"
   - Follow the setup wizard

2. **Enable Authentication**:
   - In Firebase Console, go to Authentication
   - Click "Get Started"
   - Enable "Google" sign-in method
   - Enable "Email/Password" (optional)

3. **Get Config**:
   - Go to Project Settings (⚙️ icon)
   - Scroll to "Your apps" → "Web app"
   - Copy the config values to `.env`

---

## 🚀 Running the App

### Development Mode

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 📱 Usage Guide

### Kanban Board

1. **Create Task**:
   - Click "New Task" button
   - Fill in details (title, description, priority, due date)
   - Task is created in Kanban board

2. **Drag & Drop**:
   - Drag tasks between columns (To Do → In Progress → Done)
   - Status updates automatically

3. **AI Prioritize**:
   - Click "AI Prioritize" button
   - AI analyzes all pending tasks
   - Assigns priority levels and time estimates

### Scrum Board

1. **Create Sprint**:
   - Go to Sprint Planning
   - Click "Create Sprint"
   - Set name, goal, dates, and capacity

2. **Add Tasks to Sprint**:
   - Create tasks with story points
   - Use AI to estimate story points
   - Drag tasks from backlog to sprint

3. **Start Sprint**:
   - Click "Start Sprint" button
   - Go to Scrum Board to manage active sprint

4. **Manage Sprint**:
   - Drag tasks between columns
   - Add new tasks to active sprint
   - Track progress and metrics

5. **Complete Sprint**:
   - Click "Complete Sprint"
   - Add retrospective notes
   - View sprint summary

### 2. **Use the Kanban Board**
- Navigate to "Kanban" tab
- Drag tasks between columns (To Do → In Progress → Done)
- Tasks automatically update their status

### 3. **AI Prioritization**
- Click "AI Prioritize" on the Kanban board
- AI analyzes all pending tasks
- Automatically assigns priority levels and time estimates

### 4. **Generate AI Summaries**
- Go to Dashboard
- Click "AI Summary" button
- Get motivating insights about your productivity

### 5. **View Analytics**
- Navigate to "Analytics" tab
- View charts for:
  - Priority distribution
  - Status overview
  - Completion trends (last 7 days)
  - Time allocation by priority

---

## 🎯 Project Structure

```
TaskFlowAI/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Layout.jsx      # Main layout with navigation
│   │   ├── TaskCard.jsx    # Individual task card
│   │   ├── TaskDialog.jsx  # Task create/edit modal
│   │   ├── ThemeProvider.jsx # Dark mode support
│   │   └── ProtectedRoute.jsx # Auth guard
│   ├── pages/              # Route pages
│   │   ├── Dashboard.jsx   # Overview & stats
│   │   ├── KanbanBoard.jsx # Kanban drag-and-drop
│   │   ├── SprintPlanning.jsx # Sprint management
│   │   ├── ScrumBoard.jsx  # Active sprint board
│   │   ├── Analytics.jsx   # Charts & insights
│   │   ├── Login.jsx       # Authentication
│   │   └── VerifyEmail.jsx # Email verification
│   ├── store/              # Redux store
│   │   ├── store.js        # Store configuration
│   │   └── slices/
│   │       ├── taskSlice.js    # Task state (Kanban + Scrum)
│   │       ├── sprintSlice.js  # Sprint management
│   │       └── uiSlice.js      # UI state
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx # Firebase auth
│   ├── services/           # External services
│   │   └── aiService.js    # OpenRouter/Groq AI
│   ├── lib/                # Utilities
│   │   ├── utils.js        # Helper functions
│   │   ├── localStorage.js # Persistence
│   │   └── firebase.js     # Firebase config
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # Tailwind configuration
```

---

## 🤖 AI Features Explained

### Task Prioritization Algorithm

The AI analyzes tasks based on:
- **Keywords** - Urgency indicators like "urgent", "asap", "important"
- **Complexity** - Task description length and detail
- **Context** - Related tasks and dependencies

### Story Point Estimation

AI estimates complexity using Fibonacci sequence (0,1,2,3,5,8,13,21) based on:
- Task description and scope
- Technical complexity indicators
- Similar task patterns
- Acceptance criteria requirements

### Sprint Intelligence

AI provides:
- **Sprint Summaries** - Key achievements and metrics
- **Velocity Predictions** - Forecast sprint completion
- **Bottleneck Detection** - Identify blocking issues
- **Recommendations** - Task prioritization suggestions

### Smart Summaries

Summaries include:
- ✅ Completed tasks celebration
- 🎯 Key priorities for tomorrow
- 📈 Productivity insights
- 💪 Motivational messages

---

## 📊 Key Metrics Tracked

### Kanban Metrics
- **Total Tasks** - Overall task count
- **Completion Rate** - Percentage of completed tasks
- **Priority Distribution** - High/Medium/Low breakdown
- **Status Overview** - To Do/In Progress/Done
- **Time Allocation** - Estimated hours by priority

### Scrum Metrics
- **Story Points** - Completed vs. Total per sprint
- **Sprint Velocity** - Average points per sprint
- **Sprint Progress** - Real-time completion percentage
- **Burndown** - Remaining work over time
- **Team Capacity** - Available vs. committed points

---

## 🌟 Why This Project Stands Out

### Technical Highlights
✅ **Dual Board System** - Kanban + Scrum in one app  
✅ **AI Integration** - Multiple AI providers (OpenRouter, Groq)  
✅ **Firebase Auth** - Production-ready authentication  
✅ **State Management** - Redux Toolkit with persistence  
✅ **Drag & Drop** - Advanced @dnd-kit implementation  
✅ **Modern Stack** - React 18, Vite, Tailwind  
✅ **Type Safety** - Proper prop validation  
✅ **Responsive Design** - Mobile-first approach  

### For Your Resume
> "Developed a comprehensive task management platform with dual Kanban/Scrum boards, AI-powered story point estimation, and sprint analytics. Integrated OpenRouter AI (Llama 3.3) for intelligent task prioritization, Firebase authentication, and implemented advanced drag-and-drop functionality using @dnd-kit. Built with React, Redux Toolkit, and TailwindCSS."

---

## 🎨 Customization

### Change Color Theme

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(142 71% 45%)", // Green theme
      },
    },
  },
}
```

### Switch AI Provider

In `.env`, prioritize OpenRouter or Groq:

```env
# Use OpenRouter (will be used if key is valid)
VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Fallback to Groq
VITE_GROQ_API_KEY=gsk_xxxxx
```

### Adjust AI Prompts

Edit `src/services/aiService.js` to customize:
- Priority assignment logic
- Story point estimation criteria
- Sprint summary format
- Prediction algorithms

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai) - Free AI model access
- [Groq](https://groq.com) - Fast AI inference
- [Firebase](https://firebase.google.com) - Authentication & backend
- [shadcn/ui](https://ui.shadcn.com) - Beautiful component library
- [Recharts](https://recharts.org) - Chart library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [@dnd-kit](https://dndkit.com/) - Drag and drop toolkit
- [Meta Llama](https://www.llama.com/) - Open-source AI models

---

## 📧 Contact

**Ankita** - [GitHub](https://github.com/Ankita27052002)

**Project Link**: [https://github.com/Ankita27052002/TaskFlow-AI](https://github.com/Ankita27052002/TaskFlow-AI)

---

<div align="center">

**Built with ❤️ using React, Redux, Firebase, TailwindCSS, and AI**

⭐ Star this repo if you find it helpful!

### 🚀 Features: Kanban Board • Scrum Board • Sprint Planning • AI Story Points • Firebase Auth • Analytics

</div>
