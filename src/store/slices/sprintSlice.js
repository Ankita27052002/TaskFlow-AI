import { createSlice } from '@reduxjs/toolkit'
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage'

const initialState = {
  sprints: loadFromLocalStorage('sprints') || [],
  activeSprint: loadFromLocalStorage('activeSprint') || null,
  sprintHistory: loadFromLocalStorage('sprintHistory') || [],
}

const sprintSlice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    createSprint: (state, action) => {
      const newSprint = {
        id: Date.now().toString(),
        name: action.payload.name,
        goal: action.payload.goal,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        status: 'planned', // planned, active, completed
        tasks: [],
        capacity: action.payload.capacity || 0,
        velocity: 0,
        createdAt: new Date().toISOString(),
      }
      state.sprints.push(newSprint)
      saveToLocalStorage('sprints', state.sprints)
    },

    updateSprint: (state, action) => {
      const index = state.sprints.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.sprints[index] = { ...state.sprints[index], ...action.payload.updates }
        saveToLocalStorage('sprints', state.sprints)
      }
    },

    deleteSprint: (state, action) => {
      state.sprints = state.sprints.filter(s => s.id !== action.payload)
      if (state.activeSprint === action.payload) {
        state.activeSprint = null
        saveToLocalStorage('activeSprint', null)
      }
      saveToLocalStorage('sprints', state.sprints)
    },

    startSprint: (state, action) => {
      const sprint = state.sprints.find(s => s.id === action.payload)
      if (sprint) {
        sprint.status = 'active'
        sprint.actualStartDate = new Date().toISOString()
        state.activeSprint = action.payload
        saveToLocalStorage('sprints', state.sprints)
        saveToLocalStorage('activeSprint', action.payload)
      }
    },

    completeSprint: (state, action) => {
      const sprint = state.sprints.find(s => s.id === action.payload.id)
      if (sprint) {
        sprint.status = 'completed'
        sprint.completedDate = new Date().toISOString()
        sprint.velocity = action.payload.velocity || 0
        sprint.completedStoryPoints = action.payload.completedStoryPoints || 0
        
        // Move to history
        state.sprintHistory.push({
          ...sprint,
          retrospective: action.payload.retrospective || '',
        })
        
        // Remove from active sprints
        state.sprints = state.sprints.filter(s => s.id !== action.payload.id)
        
        if (state.activeSprint === action.payload.id) {
          state.activeSprint = null
          saveToLocalStorage('activeSprint', null)
        }
        
        saveToLocalStorage('sprints', state.sprints)
        saveToLocalStorage('sprintHistory', state.sprintHistory)
      }
    },

    addTaskToSprint: (state, action) => {
      const { sprintId, taskId } = action.payload
      const sprint = state.sprints.find(s => s.id === sprintId)
      if (sprint && !sprint.tasks.includes(taskId)) {
        sprint.tasks.push(taskId)
        saveToLocalStorage('sprints', state.sprints)
      }
    },

    removeTaskFromSprint: (state, action) => {
      const { sprintId, taskId } = action.payload
      const sprint = state.sprints.find(s => s.id === sprintId)
      if (sprint) {
        sprint.tasks = sprint.tasks.filter(t => t !== taskId)
        saveToLocalStorage('sprints', state.sprints)
      }
    },

    updateSprintVelocity: (state, action) => {
      const { sprintId, velocity } = action.payload
      const sprint = state.sprints.find(s => s.id === sprintId)
      if (sprint) {
        sprint.velocity = velocity
        saveToLocalStorage('sprints', state.sprints)
      }
    },

    setActiveSprint: (state, action) => {
      state.activeSprint = action.payload
      saveToLocalStorage('activeSprint', action.payload)
    },
  },
})

export const {
  createSprint,
  updateSprint,
  deleteSprint,
  startSprint,
  completeSprint,
  addTaskToSprint,
  removeTaskFromSprint,
  updateSprintVelocity,
  setActiveSprint,
} = sprintSlice.actions

export default sprintSlice.reducer

// Selectors
export const selectAllSprints = (state) => state.sprint.sprints
export const selectActiveSprint = (state) => {
  if (!state.sprint.activeSprint) return null
  return state.sprint.sprints.find(s => s.id === state.sprint.activeSprint)
}
export const selectSprintById = (state, sprintId) => 
  state.sprint.sprints.find(s => s.id === sprintId)
export const selectSprintHistory = (state) => state.sprint.sprintHistory
export const selectPlannedSprints = (state) => 
  state.sprint.sprints.filter(s => s.status === 'planned')
