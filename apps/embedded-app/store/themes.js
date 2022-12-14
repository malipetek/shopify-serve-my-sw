import { createSlice } from '@reduxjs/toolkit'

export const themesSlice = createSlice({
  name: 'themes',
  initialState: {
    themes: [],
    loading: false,
    openTheme: null
  },
  reducers: {
    setThemes: (state, action) => {
      return { ...state, themes: action.payload };
    },
    setLoading: (state, action) => {
      return { ...state, loading: action.payload };
    },
    setAssets: (state, action) => {
      return {
        ...state,
        themes: state.themes.map(theme => {
          return theme.id == action.payload.id ?
            { ...theme, assets: action.payload.assets }
            : theme;
        })
      }
    },
    setOpenTheme: (state, action) => {
      return {
        ...state,
        openTheme: action.payload
      };
    }
  },
})

// Action creators are generated for each case reducer function
export const { setThemes, setLoading, setAssets, setOpenTheme } = themesSlice.actions

export default themesSlice.reducer