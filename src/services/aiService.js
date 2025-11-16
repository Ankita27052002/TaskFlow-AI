import axios from 'axios'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const API_KEY = import.meta.env.VITE_GROQ_API_KEY
const MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.1-70b-versatile'

class AIService {
  constructor() {
    this.client = axios.create({
      baseURL: GROQ_API_URL,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    })
  }

  async chat(messages, temperature = 0.7) {
    try {
      const response = await this.client.post('', {
        model: MODEL,
        messages,
        temperature,
        max_tokens: 1024,
      })
      return response.data.choices[0].message.content
    } catch (error) {
      console.error('AI Service Error:', error)
      throw new Error('Failed to get AI response')
    }
  }

  async analyzeTaskPriority(task) {
    const prompt = `Analyze this task and assign a priority (high, medium, or low) and estimate time to complete in hours.
    
Task: ${task.title}
Description: ${task.description || 'No description'}

Respond ONLY with a JSON object in this exact format:
{
  "priority": "high|medium|low",
  "estimatedTime": number (in hours),
  "reasoning": "brief explanation"
}`

    const messages = [
      {
        role: 'system',
        content: 'You are a task management AI that helps prioritize tasks. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    const response = await this.chat(messages, 0.3)
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Invalid AI response format')
  }

  async analyzeBulkTasks(tasks) {
    const tasksText = tasks.map((t, i) => 
      `${i + 1}. ${t.title} - ${t.description || 'No description'}`
    ).join('\n')

    const prompt = `Analyze these tasks and assign priority (high, medium, low) and estimated time (in hours) for each.

Tasks:
${tasksText}

Respond ONLY with a JSON array in this exact format:
[
  {
    "index": 0,
    "priority": "high|medium|low",
    "estimatedTime": number,
    "reasoning": "brief explanation"
  }
]`

    const messages = [
      {
        role: 'system',
        content: 'You are a task management AI. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    const response = await this.chat(messages, 0.3)
    
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Invalid AI response format')
  }

  async generateDailySummary(tasks) {
    const completedToday = tasks.filter(t => {
      if (!t.completedAt) return false
      const completed = new Date(t.completedAt)
      const today = new Date()
      return completed.toDateString() === today.toDateString()
    })

    const pendingTasks = tasks.filter(t => t.status !== 'done')

    const prompt = `Generate a brief daily summary based on these tasks.

Completed Today (${completedToday.length}):
${completedToday.map(t => `- ${t.title}`).join('\n') || 'None'}

Pending Tasks (${pendingTasks.length}):
${pendingTasks.slice(0, 5).map(t => `- ${t.title} (${t.priority || 'no priority'})`).join('\n') || 'None'}

Provide a motivating summary with:
1. Celebration of completed tasks
2. Key priorities for tomorrow
3. Brief productivity insight
4. Encouraging message

Keep it concise (3-4 sentences).`

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful productivity assistant that generates motivating daily summaries.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    return await this.chat(messages, 0.8)
  }

  async generateWeeklySummary(tasks) {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const weeklyCompleted = tasks.filter(t => {
      if (!t.completedAt) return false
      return new Date(t.completedAt) >= oneWeekAgo
    })

    const prompt = `Generate a weekly productivity summary.

Tasks Completed This Week: ${weeklyCompleted.length}
${weeklyCompleted.map(t => `- ${t.title} (${t.priority || 'no priority'})`).join('\n') || 'None'}

Total Active Tasks: ${tasks.filter(t => t.status !== 'done').length}

Provide:
1. Weekly achievements summary
2. Productivity trends observed
3. Recommendations for next week
4. Motivational message

Keep it concise but insightful (4-5 sentences).`

    const messages = [
      {
        role: 'system',
        content: 'You are a productivity analyst providing weekly insights.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    return await this.chat(messages, 0.8)
  }

  async clusterTasks(tasks) {
    const tasksText = tasks.map((t, i) => 
      `${i + 1}. ${t.title} - ${t.description || ''}`
    ).join('\n')

    const prompt = `Analyze these tasks and group them into logical categories.

Tasks:
${tasksText}

Respond ONLY with a JSON object grouping tasks by category:
{
  "categories": {
    "Category Name 1": [0, 2, 5],
    "Category Name 2": [1, 3, 4]
  },
  "insights": "Brief insight about task distribution"
}`

    const messages = [
      {
        role: 'system',
        content: 'You are a task organization AI. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    const response = await this.chat(messages, 0.4)
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Invalid AI response format')
  }
}

export const aiService = new AIService()
