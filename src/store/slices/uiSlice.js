import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  error: null,
  aiAnalyzing: false,
  toast: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setAiAnalyzing: (state, action) => {
      state.aiAnalyzing = action.payload
    },
    showToast: (state, action) => {
      state.toast = action.payload
    },
    clearToast: (state) => {
      state.toast = null
    },
  },
})

export const { setLoading, setError, setAiAnalyzing, showToast, clearToast } = uiSlice.actions

export default uiSlice.reducer
