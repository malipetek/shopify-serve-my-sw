import { createSlice } from '@reduxjs/toolkit'

export const themesSlice = createSlice({
  name: 'themes',
  initialState: {
    themes: [],
    loading: false
  },
  reducers: {
    setThemes: (state, action) => {
      state.themes = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setThemes, setLoading } = themesSlice.actions

export default themesSlice.reducer