# TaskFlow AI - Smart Task Manager with AI Prioritization

<div align="center">

![TaskFlow AI](https://img.shields.io/badge/TaskFlow-AI-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern kanban/task management app with AI-powered prioritization, time estimation, and productivity analytics.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Screenshots](#-screenshots)

</div>

---

## 🚀 Features

### Core Functionality
- ✅ **Smart Task Management** - Create, edit, delete, and organize tasks
- 🎯 **AI-Powered Prioritization** - Automatic priority assignment using Llama 3
- ⏱️ **Time Estimation** - AI suggests estimated completion time
- 🎨 **Beautiful Kanban Board** - Drag-and-drop interface with smooth animations
- 📊 **Progress Analytics** - Visual charts showing productivity metrics
- 📝 **AI Summaries** - Daily/weekly task summaries and insights
- 🔄 **Real-time Updates** - Instant state management with Redux Toolkit
- 💾 **Local Persistence** - Tasks saved to browser localStorage

### AI Features (Powered by Groq Llama 3)
- **Bulk Task Analysis** - Analyze multiple tasks at once
- **Priority Assignment** - Intelligent high/medium/low categorization
- **Time Estimation** - Smart estimation based on task complexity
- **Daily Summaries** - Motivating daily productivity reports
- **Weekly Summaries** - Comprehensive weekly insights
- **Task Clustering** - Automatic categorization of related tasks

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **JavaScript** - No TypeScript for simplicity

### State Management
- **Redux Toolkit** - Efficient state management
- **React Redux** - React bindings for Redux

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **Framer Motion** - Smooth animations

### UI Functionality
- **@dnd-kit** - Drag and drop for Kanban board
- **Recharts** - Beautiful, composable charts
- **Lucide React** - Clean, consistent icons

### Data & API
- **React Query** - Async state management
- **Axios** - HTTP client for AI API calls

### AI Integration
- **Groq Llama 3** - Fast, free AI inference
- **Together.ai** - Alternative AI provider (optional)

### Routing
- **React Router v6** - Client-side routing

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and npm/yarn installed
- **Groq API Key** (free) - Get it at [console.groq.com](https://console.groq.com)
  - Sign up for free
  - Navigate to API Keys
  - Create a new API key
  - Copy the key for later use

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

```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:

```env
VITE_GROQ_API_KEY=your_actual_groq_api_key_here
VITE_GROQ_MODEL=llama-3.1-70b-versatile
```

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

### 1. **Create Your First Task**
- Click "New Task" button
- Fill in task details (title, description, priority, due date, estimated time)
- Click "Create Task"

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
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── input.jsx
│   │   │   ├── tabs.jsx
│   │   │   └── toast.jsx
│   │   ├── Layout.jsx      # Main layout with navigation
│   │   ├── TaskCard.jsx    # Individual task card
│   │   └── TaskDialog.jsx  # Task create/edit modal
│   ├── pages/              # Route pages
│   │   ├── Dashboard.jsx   # Overview & stats
│   │   ├── KanbanBoard.jsx # Drag-and-drop board
│   │   └── Analytics.jsx   # Charts & insights
│   ├── store/              # Redux store
│   │   ├── store.js        # Store configuration
│   │   └── slices/
│   │       ├── taskSlice.js # Task state management
│   │       └── uiSlice.js   # UI state management
│   ├── services/           # External services
│   │   └── aiService.js    # Groq AI integration
│   ├── lib/                # Utilities
│   │   ├── utils.js        # Helper functions
│   │   └── localStorage.js # Local storage helpers
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── .env.example            # Environment variables template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── README.md               # This file
```

---

## 🤖 AI Features Explained

### Task Prioritization Algorithm

The AI analyzes tasks based on:
- **Keywords** - Urgency indicators like "urgent", "asap", "important"
- **Complexity** - Task description length and detail
- **Context** - Related tasks and dependencies

### Time Estimation

AI provides estimates considering:
- Task description and scope
- Historical patterns (if available)
- Complexity indicators

### Smart Summaries

Summaries include:
- ✅ Completed tasks celebration
- 🎯 Key priorities for tomorrow
- 📈 Productivity insights
- 💪 Motivational messages

---

## 🎨 Customization

### Change Color Theme

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(var(--primary))", // Change this
      },
    },
  },
}
```

### Adjust AI Prompts

Edit `src/services/aiService.js` to customize AI behavior

### Add New Task Categories

Modify `src/store/slices/taskSlice.js`

---

## 📊 Key Metrics Tracked

- **Total Tasks** - Overall task count
- **Completion Rate** - Percentage of completed tasks
- **Priority Distribution** - High/Medium/Low breakdown
- **Status Overview** - To Do/In Progress/Done
- **Time Allocation** - Estimated hours by priority
- **Weekly Trends** - 7-day completion history

---

## 🌟 Why This Project Stands Out

### For Your Resume
✅ **Full-Stack Complexity** - Redux, React Query, routing  
✅ **AI Integration** - Real AI features, not just UI  
✅ **Modern Tech Stack** - Industry-standard tools  
✅ **Production-Ready** - Error handling, state persistence  
✅ **Great UI/UX** - Smooth animations, responsive design  

### Resume Line
> "Built a task management platform with AI-based prioritization, summaries, and productivity analytics using React, Redux Toolkit, and Llama AI models via Groq API. Implemented drag-and-drop Kanban board, real-time analytics with Recharts, and automated task clustering."

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

- [Groq](https://groq.com) - For fast, free AI inference
- [shadcn/ui](https://ui.shadcn.com) - Beautiful component library
- [Recharts](https://recharts.org) - Chart library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [@dnd-kit](https://dndkit.com/) - Drag and drop toolkit

---

## 📧 Contact

**Ankita** - [GitHub](https://github.com/Ankita27052002)

**Project Link**: [https://github.com/Ankita27052002/TaskFlow-AI](https://github.com/Ankita27052002/TaskFlow-AI)

---

<div align="center">

**Built with ❤️ using React, Redux, TailwindCSS, and AI**

⭐ Star this repo if you find it helpful!

</div>
