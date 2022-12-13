import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'savebar',
  initialState: {
    visible: false,
    loading: false,
    disabled: false
  },
  reducers: {
    show: (state) => {
      state.visible = true
    },
    hide: (state) => {
      state.visible = false
    },
    disable: (state) => {
      state.disabled = true
    },
    enable: (state) => {
      state.disabled = false
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { show, hide, onSave, onDiscard } = counterSlice.actions

export default counterSlice.reducer