import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage'
import type { Task, TaskState, TaskStatus, RootState } from '@/types'

// Migrate old tasks to ensure they have sprintId and boardType fields
const migrateTasks = (tasks: Task[]): Task[] => {
  return tasks.map(task => ({
    ...task,
    sprintId: task.sprintId !== undefined ? task.sprintId : null,
    storyPoints: task.storyPoints !== undefined ? task.storyPoints : 0,
    acceptanceCriteria: task.acceptanceCriteria || [],
    boardType: task.boardType || 'kanban', // Default existing tasks to kanban
  }))
}

const loadedTasks = loadFromLocalStorage<Task[]>('tasks') || []
const migratedTasks = migrateTasks(loadedTasks)

// Save migrated tasks back to localStorage
if (migratedTasks.length > 0) {
  saveToLocalStorage('tasks', migratedTasks)
}

const initialState: TaskState = {
  tasks: migratedTasks,
  filter: 'all', // all, high, medium, low
  sortBy: 'createdAt', // createdAt, priority, dueDate
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      const newTask: Task = {
        ...action.payload,
        storyPoints: action.payload.storyPoints || 0,
        sprintId: action.payload.sprintId || null,
        acceptanceCriteria: action.payload.acceptanceCriteria || [],
        boardType: action.payload.boardType || 'kanban', // Default to kanban if not specified
      }
      state.tasks.push(newTask)
      saveToLocalStorage('tasks', state.tasks)
    },
    updateTask: (state, action: PayloadAction<Partial<Task> & { id: string }>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload }
        saveToLocalStorage('tasks', state.tasks)
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
      saveToLocalStorage('tasks', state.tasks)
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: TaskStatus }>) => {
      const { id, status } = action.payload
      const task = state.tasks.find(task => task.id === id)
      if (task) {
        task.status = status
        if (status === 'done') {
          task.updatedAt = new Date().toISOString()
        }
        saveToLocalStorage('tasks', state.tasks)
      }
    },
    bulkUpdateTasks: (state, action: PayloadAction<Array<Partial<Task> & { id: string }>>) => {
      action.payload.forEach(updatedTask => {
        const index = state.tasks.findIndex(task => task.id === updatedTask.id)
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...updatedTask }
        }
      })
      saveToLocalStorage('tasks', state.tasks)
    },
    setFilter: (state, action: PayloadAction<TaskState['filter']>) => {
      state.filter = action.payload
    },
    setSortBy: (state, action: PayloadAction<TaskState['sortBy']>) => {
      state.sortBy = action.payload
    },
    updateStoryPoints: (state, action: PayloadAction<{ id: string; storyPoints: number }>) => {
      const { id, storyPoints } = action.payload
      const task = state.tasks.find(task => task.id === id)
      if (task) {
        task.storyPoints = storyPoints
        saveToLocalStorage('tasks', state.tasks)
      }
    },
    assignToSprint: (state, action: PayloadAction<{ taskId: string; sprintId: string }>) => {
      const { taskId, sprintId } = action.payload
      const task = state.tasks.find(task => task.id === taskId)
      if (task) {
        task.sprintId = sprintId
        saveToLocalStorage('tasks', state.tasks)
      }
    },
    removeFromSprint: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload)
      if (task) {
        task.sprintId = null
        saveToLocalStorage('tasks', state.tasks)
      }
    },
    updateAcceptanceCriteria: (state, action: PayloadAction<{ taskId: string; criteria: string[] }>) => {
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
export const selectBacklogTasks = (state: RootState): Task[] => 
  state.tasks.tasks.filter(task => !task.sprintId && task.boardType === 'scrum')

export const selectSprintTasks = (state: RootState, sprintId: string): Task[] => 
  state.tasks.tasks.filter(task => task.sprintId === sprintId && task.boardType === 'scrum')

export const selectKanbanTasks = (state: RootState): Task[] =>
  state.tasks.tasks.filter(task => task.boardType === 'kanban')

export const selectTaskById = (state: RootState, taskId: string): Task | undefined =>
  state.tasks.tasks.find(task => task.id === taskId)
