import { createSlice } from '@reduxjs/toolkit'

export const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    shop: ''
  },
  reducers: {
    setShop: (state, action) => {
      return {...state, shop: action.payload }
    }
  },
})

// Action creators are generated for each case reducer function
export const { setShop } = shopSlice.actions

export default shopSlice.reducer