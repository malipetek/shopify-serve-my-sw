import { configureStore } from '@reduxjs/toolkit'
import saveBarReducer from './savebar'
import themesReducer from './themes'
import shopSlice from './shop'

export default configureStore({
  reducer: {
    savebar: saveBarReducer,
    themes: themesReducer,
    shop: shopSlice
  },
})