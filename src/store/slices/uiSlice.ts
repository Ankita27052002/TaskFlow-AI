import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UIState, Toast } from '@/types'

const initialState: UIState = {
  isLoading: false,
  error: null,
  aiAnalyzing: false,
  toast: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setAiAnalyzing: (state, action: PayloadAction<boolean>) => {
      state.aiAnalyzing = action.payload
    },
    showToast: (state, action: PayloadAction<Toast>) => {
      state.toast = action.payload
    },
    clearToast: (state) => {
      state.toast = null
    },
  },
})

export const { setLoading, setError, setAiAnalyzing, showToast, clearToast } = uiSlice.actions

export default uiSlice.reducer
