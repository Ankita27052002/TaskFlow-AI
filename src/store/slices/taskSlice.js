import { createSlice } from '@reduxjs/toolkit'
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage'

// Migrate old tasks to ensure they have sprintId and boardType fields
const migrateTasks = (tasks) => {
  return tasks.map(task => ({
    ...task,
    sprintId: task.sprintId !== undefined ? task.sprintId : null,
    storyPoints: task.storyPoints !== undefined ? task.storyPoints : 0,
    acceptanceCriteria: task.acceptanceCriteria || [],
    boardType: task.boardType || 'kanban', // Default existing tasks to kanban
  }))
}

const loadedTasks = loadFromLocalStorage('tasks') || []
const migratedTasks = migrateTasks(loadedTasks)

// Save migrated tasks back to localStorage
if (migratedTasks.length > 0) {
  saveToLocalStorage('tasks', migratedTasks)
}

const initialState = {
  tasks: migratedTasks,
  filter: 'all', // all, high, medium, low
  sortBy: 'createdAt', // createdAt, priority, dueDate
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        ...action.payload,
        storyPoints: action.payload.storyPoints || 0,
        sprintId: action.payload.sprintId || null,
        acceptanceCriteria: action.payload.acceptanceCriteria || [],
        boardType: action.payload.boardType || 'kanban', // Default to kanban if not specified
      }
      state.tasks.push(newTask)
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
    updateStoryPoints: (state, action) => {
      const { id, storyPoints } = action.payload
      const task = state.tasks.find(task => task.id === id)
      if (task) {
        task.storyPoints = storyPoints
        saveToLocalStorage('tasks', state.tasks)
      }
    },
    assignToSprint: (state, action) => {
      const { taskId, sprintId } = action.payload
      const task = state.tasks.find(task => task.id === taskId)
      if (task) {
        task.sprintId = sprintId
        saveToLocalStorage('tasks', state.tasks)
      }
    },
    removeFromSprint: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload)
      if (task) {
        task.sprintId = null
        saveToLocalStorage('tasks', state.tasks)
      }
    },
    updateAcceptanceCriteria: (state, action) => {
      const { taskId, criteria } = action.payload
      const task = state.tasks.find(task => task.id === taskId)
      if (task) {
        task.acceptanceCriteria = criteria
        saveToLocalStorage('tasks', state.tasks)
      }
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
  updateStoryPoints,
  assignToSprint,
  removeFromSprint,
  updateAcceptanceCriteria,
} = taskSlice.actions

export default taskSlice.reducer

// Selectors
export const selectBacklogTasks = (state) => 
  state.tasks.tasks.filter(task => !task.sprintId && task.boardType === 'scrum')

export const selectSprintTasks = (state, sprintId) => 
  state.tasks.tasks.filter(task => task.sprintId === sprintId && task.boardType === 'scrum')

export const selectKanbanTasks = (state) =>
  state.tasks.tasks.filter(task => task.boardType === 'kanban')

export const selectTaskById = (state, taskId) =>
  state.tasks.tasks.find(task => task.id === taskId)
