import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage'
import type { Sprint, SprintState, SprintStatus, RootState } from '@/types'

interface CreateSprintPayload {
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  capacity?: number;
}

interface UpdateSprintPayload {
  id: string;
  updates: Partial<Sprint>;
}

interface CompleteSprintPayload {
  id: string;
  velocity?: number;
  completedStoryPoints?: number;
  retrospective?: string;
}

interface SprintTaskPayload {
  sprintId: string;
  taskId: string;
}

interface UpdateVelocityPayload {
  sprintId: string;
  velocity: number;
}

const initialState: SprintState = {
  sprints: loadFromLocalStorage<Sprint[]>('sprints') || [],
  activeSprint: loadFromLocalStorage<string | null>('activeSprint') || null,
  sprintHistory: loadFromLocalStorage<Sprint[]>('sprintHistory') || [],
}

const sprintSlice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    createSprint: (state, action: PayloadAction<CreateSprintPayload>) => {
      const newSprint: Sprint = {
        id: Date.now().toString(),
        name: action.payload.name,
        goal: action.payload.goal,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        status: 'planned' as SprintStatus,
        tasks: [],
        capacity: action.payload.capacity || 0,
        velocity: 0,
        createdAt: new Date().toISOString(),
      }
      state.sprints.push(newSprint)
      saveToLocalStorage('sprints', state.sprints)
    },

    updateSprint: (state, action: PayloadAction<UpdateSprintPayload>) => {
      const index = state.sprints.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.sprints[index] = { ...state.sprints[index], ...action.payload.updates }
        saveToLocalStorage('sprints', state.sprints)
      }
    },

    deleteSprint: (state, action: PayloadAction<string>) => {
      state.sprints = state.sprints.filter(s => s.id !== action.payload)
      if (state.activeSprint === action.payload) {
        state.activeSprint = null
        saveToLocalStorage('activeSprint', null)
      }
      saveToLocalStorage('sprints', state.sprints)
    },

    startSprint: (state, action: PayloadAction<string>) => {
      const sprint = state.sprints.find(s => s.id === action.payload)
      if (sprint) {
        sprint.status = 'active'
        state.activeSprint = action.payload
        saveToLocalStorage('sprints', state.sprints)
        saveToLocalStorage('activeSprint', action.payload)
      }
    },

    completeSprint: (state, action: PayloadAction<CompleteSprintPayload>) => {
      const sprint = state.sprints.find(s => s.id === action.payload.id)
      if (sprint) {
        sprint.status = 'completed'
        sprint.velocity = action.payload.velocity || 0
        
        // Move to history
        state.sprintHistory.push(sprint)
        
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

    addTaskToSprint: (state, action: PayloadAction<SprintTaskPayload>) => {
      const { sprintId, taskId } = action.payload
      const sprint = state.sprints.find(s => s.id === sprintId)
      if (sprint && !sprint.tasks.includes(taskId)) {
        sprint.tasks.push(taskId)
        saveToLocalStorage('sprints', state.sprints)
      }
    },

    removeTaskFromSprint: (state, action: PayloadAction<SprintTaskPayload>) => {
      const { sprintId, taskId } = action.payload
      const sprint = state.sprints.find(s => s.id === sprintId)
      if (sprint) {
        sprint.tasks = sprint.tasks.filter(t => t !== taskId)
        saveToLocalStorage('sprints', state.sprints)
      }
    },

    updateSprintVelocity: (state, action: PayloadAction<UpdateVelocityPayload>) => {
      const { sprintId, velocity } = action.payload
      const sprint = state.sprints.find(s => s.id === sprintId)
      if (sprint) {
        sprint.velocity = velocity
        saveToLocalStorage('sprints', state.sprints)
      }
    },

    setActiveSprint: (state, action: PayloadAction<string | null>) => {
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
export const selectAllSprints = (state: RootState): Sprint[] => state.sprint.sprints
export const selectActiveSprint = (state: RootState): Sprint | null => {
  if (!state.sprint.activeSprint) return null
  return state.sprint.sprints.find(s => s.id === state.sprint.activeSprint) || null
}
export const selectSprintById = (state: RootState, sprintId: string): Sprint | undefined => 
  state.sprint.sprints.find(s => s.id === sprintId)
export const selectSprintHistory = (state: RootState): Sprint[] => state.sprint.sprintHistory
export const selectPlannedSprints = (state: RootState): Sprint[] => 
  state.sprint.sprints.filter(s => s.status === 'planned')
