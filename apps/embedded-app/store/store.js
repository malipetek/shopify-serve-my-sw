import { configureStore } from '@reduxjs/toolkit'
import saveBarReducer from './savebar'
import themesReducer from './themes'

export default configureStore({
  reducer: {
    savebar: saveBarReducer,
    themes: themesReducer
  },
})