import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './slices/taskSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    ui: uiReducer,
  },
})
