# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Get Your Free Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account (Google/GitHub login available)
3. Navigate to "API Keys" in the dashboard
4. Click "Create API Key"
5. Copy your API key

### Step 2: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your API key:
   ```env
   VITE_GROQ_API_KEY=gsk_your_actual_api_key_here
   VITE_GROQ_MODEL=llama-3.1-70b-versatile
   ```

### Step 3: Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## ✨ First Steps in the App

1. **Create a Task**
   - Click "New Task" button
   - Add title, description, priority, due date
   - Click "Create Task"

2. **Try AI Features**
   - Go to Kanban board
   - Click "AI Prioritize" to auto-assign priorities
   - Go to Dashboard and click "AI Summary"

3. **Use the Kanban Board**
   - Drag tasks between columns
   - Watch them update in real-time!

4. **Check Analytics**
   - Click "Analytics" tab
   - View charts and productivity metrics

---

## 🎯 Demo Features to Try

### AI Prioritization
Create several tasks with varying complexity:
- "Fix critical bug in production"
- "Update documentation"
- "Research new feature ideas"
- "Code review team PRs"

Then click "AI Prioritize" to see AI assign priorities!

### Daily Summary
Add and complete a few tasks, then click "AI Summary" for personalized insights.

### Drag & Drop
Move tasks across the Kanban board - smooth animations included!

---

## 🛠️ Troubleshooting

### API Key Not Working?
- Make sure your `.env` file is in the root directory
- Restart the dev server after editing `.env`
- Verify the API key starts with `gsk_`

### Port Already in Use?
```bash
# Vite will automatically try port 5174, 5175, etc.
```

### Dependencies Issues?
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Tech Stack Quick Reference

- **React 18** - UI framework
- **Redux Toolkit** - State management
- **Vite** - Build tool
- **Tailwind + shadcn/ui** - Styling
- **@dnd-kit** - Drag and drop
- **Recharts** - Analytics charts
- **Framer Motion** - Animations
- **Groq Llama 3** - AI features

---

## 🎨 Customization Tips

### Change Primary Color
Edit `src/index.css` line 6:
```css
--primary: 221.2 83.2% 53.3%; /* Change this */
```

### Add New Task Fields
1. Update `TaskDialog.jsx`
2. Modify `taskSlice.js` to store new fields
3. Update `TaskCard.jsx` to display them

### Adjust AI Prompts
Edit `src/services/aiService.js` to customize AI behavior

---

## 🌟 Project Highlights for Your Portfolio

✅ Full CRUD operations with Redux Toolkit  
✅ Real AI integration (not mock data)  
✅ Drag-and-drop with @dnd-kit  
✅ Data visualization with Recharts  
✅ Smooth animations with Framer Motion  
✅ Local data persistence  
✅ Modern shadcn/ui components  
✅ Responsive design  

---

**Happy Coding! 🚀**

If you encounter any issues, check the main README.md or create an issue on GitHub.
