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
      return { ...state, visible: true };
    },
    hide: (state) => {
      return { ...state, visible: false };
    },
    disable: (state) => {
      return { ...state, disabled: true };
    },
    enable: (state) => {
     return {...state, disabled: false };
    },
    setLoading: (state, action) => {
      return { ...state, loading: action.payload };
    }
  },
})

// Action creators are generated for each case reducer function
export const { show, hide } = counterSlice.actions

export default counterSlice.reducer