import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './slices/taskSlice'
import uiReducer from './slices/uiSlice'
import sprintReducer from './slices/sprintSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    ui: uiReducer,
    sprint: sprintReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
