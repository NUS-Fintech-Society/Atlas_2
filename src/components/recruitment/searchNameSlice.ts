import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '~/store/store'

export interface SearchNameSlice {
  value: string
}

const initialState: SearchNameSlice = {
  value: '',
}

export const searchNameSlice = createSlice({
  name: 'searchName',
  initialState,
  reducers: {
    searchByName: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  },
})

export const { searchByName } = searchNameSlice.actions

export const selectSearchValue = (state: RootState) => state.searchName.value

export default searchNameSlice.reducer
