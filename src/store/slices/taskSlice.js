import { createSlice } from '@reduxjs/toolkit'
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage'

const initialState = {
  tasks: loadFromLocalStorage('tasks') || [],
  filter: 'all', // all, high, medium, low
  sortBy: 'createdAt', // createdAt, priority, dueDate
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload)
      saveToLocalStorage('tasks', state.tasks)
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload }
        saveToLocalStorage('tasks', state.tasks)
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
      saveToLocalStorage('tasks', state.tasks)
    },
    updateTaskStatus: (state, action) => {
      const { id, status } = action.payload
      const task = state.tasks.find(task => task.id === id)
      if (task) {
        task.status = status
        if (status === 'done') {
          task.completedAt = new Date().toISOString()
        }
        saveToLocalStorage('tasks', state.tasks)
      }
    },
    bulkUpdateTasks: (state, action) => {
      action.payload.forEach(updatedTask => {
        const index = state.tasks.findIndex(task => task.id === updatedTask.id)
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...updatedTask }
        }
      })
      saveToLocalStorage('tasks', state.tasks)
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
  },
})

export const {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  bulkUpdateTasks,
  setFilter,
  setSortBy,
} = taskSlice.actions

export default taskSlice.reducer
