# TaskFlow AI

<div align="center">
  
  ![TaskFlow AI Logo](https://img.shields.io/badge/TaskFlow-AI-brightgreen?style=for-the-badge)
  
  **Smart Task Management with AI-Powered Insights**
  
  A modern, intelligent task management application that combines powerful agile methodologies with AI-driven analytics to supercharge your productivity.

  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [AI Integration](#-ai-integration)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 **Core Functionality**
- **Dual Board View**: Switch seamlessly between Kanban and Scrum boards
- **Sprint Planning**: Plan and manage sprints with story points and velocity tracking
- **Drag & Drop**: Intuitive task management with smooth drag-and-drop interactions
- **Real-time Updates**: Instant synchronization across all views

### 🤖 **AI-Powered Features**
- **Smart Task Analysis**: AI automatically analyzes and suggests task priorities
- **Story Point Estimation**: Get intelligent estimates for task complexity
- **Bulk Task Processing**: Analyze multiple tasks simultaneously
- **Sprint Predictions**: AI-driven sprint velocity and completion forecasts
- **Daily Summaries**: Generate comprehensive AI summaries of your progress

### 📊 **Analytics & Insights**
- **Priority Distribution**: Visualize tasks by priority levels
- **Completion Trends**: Track your productivity over time
- **Time Allocation**: See estimated time breakdown by priority
- **Sprint Metrics**: Monitor velocity, story points, and completion rates

### 🎨 **User Experience**
- **Dark Mode**: Beautiful light and dark themes
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Smooth Animations**: Polished transitions and micro-interactions
- **Google Authentication**: Secure sign-in with Firebase Auth

---

## 🛠 Tech Stack

### **Frontend**
- **React 18.2** - Modern UI library with hooks
- **TypeScript 5.0** - Type-safe development
- **Vite 5.0** - Lightning-fast build tool
- **TailwindCSS 3.4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations

### **State Management**
- **Redux Toolkit** - Predictable state container
- **React Query** - Server state management

### **UI Components**
- **Radix UI** - Unstyled, accessible components
- **Lucide Icons** - Beautiful icon library
- **Chart.js** - Interactive charts and graphs
- **DND Kit** - Modern drag-and-drop toolkit

### **Backend & Services**
- **Firebase** - Authentication and real-time database
- **OpenRouter API** - AI model integration (Llama 3.3 70B)
- **Groq API** - Fast AI inference (Llama 3.1 70B)

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS transformations
- **Axios** - HTTP client

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ankita27052002/TaskFlow-AI.git
   cd TaskFlow-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id

   # AI API Configuration
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   VITE_OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_GROQ_MODEL=llama-3.1-70b-versatile
   ```

### Environment Setup

#### **Firebase Setup**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Google Sign-In)
4. Copy your configuration keys to `.env`

#### **AI API Setup**
1. **OpenRouter**: Sign up at [OpenRouter](https://openrouter.ai/) and get your API key
2. **Groq**: Register at [Groq](https://groq.com/) for free API access

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 💡 Usage

### **Dashboard**
- View task statistics and metrics
- Create new tasks quickly
- Generate AI-powered daily summaries
- Access recent tasks at a glance

### **Kanban Board**
- Visualize workflow across columns (To Do, In Progress, Review, Done)
- Drag and drop tasks between statuses
- Use AI to bulk analyze and prioritize pending tasks
- Filter and organize tasks efficiently

### **Sprint Planning**
- Create and manage sprints
- Assign tasks from backlog to sprints
- Track story points and capacity
- Monitor sprint progress

### **Scrum Board**
- Active sprint view with real-time updates
- Track sprint velocity and burndown
- Manage tasks within sprint lifecycle
- Complete sprints with retrospectives

### **Analytics**
- View priority distribution charts
- Track completion trends over time
- Analyze time allocation
- Monitor key productivity metrics

---

## 📁 Project Structure

```
TaskFlowAI/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Reusable UI components
│   │   ├── Layout.tsx  # Main layout wrapper
│   │   └── ...
│   ├── contexts/       # React contexts (Auth)
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   │   ├── Dashboard.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── ScrumBoard.tsx
│   │   ├── SprintPlanning.tsx
│   │   └── Analytics.tsx
│   ├── services/       # API services
│   │   └── aiService.ts
│   ├── store/          # Redux store
│   │   ├── slices/     # Redux slices
│   │   └── store.ts
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── tailwind.config.js  # Tailwind CSS config
└── vite.config.ts      # Vite configuration
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
```

---

## 🤖 AI Integration

TaskFlow AI leverages cutting-edge language models to provide intelligent task management:

### **Supported AI Features**

1. **Task Priority Analysis**
   - Analyzes task title and description
   - Suggests optimal priority level
   - Provides reasoning for recommendations

2. **Story Point Estimation**
   - Estimates complexity on Fibonacci scale (1, 2, 3, 5, 8, 13)
   - Considers task scope and requirements
   - Helps with sprint planning

3. **Bulk Task Processing**
   - Analyze multiple tasks simultaneously
   - Batch priority assignment
   - Efficient time estimation

4. **Sprint Predictions**
   - Forecast sprint completion
   - Velocity calculations
   - Risk assessment

5. **Daily Summaries**
   - Generate comprehensive progress reports
   - Highlight achievements and blockers
   - Provide actionable insights

### **AI Models**
- **OpenRouter**: Meta Llama 3.3 70B Instruct (Free tier)
- **Groq**: Llama 3.1 70B Versatile (Ultra-fast inference)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Code Standards**
- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenRouter** for providing free AI API access
- **Groq** for ultra-fast AI inference
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Firebase** for authentication and backend services

---

## 📧 Contact

**Ankita Mandal** - [@Ankita27052002](https://github.com/Ankita27052002)

**Project Link**: [https://github.com/Ankita27052002/TaskFlow-AI](https://github.com/Ankita27052002/TaskFlow-AI)

---

<div align="center">
  
  **Made with ❤️ by Ankita Mandal**
  
  ⭐ Star this repo if you find it helpful!
  
</div>
