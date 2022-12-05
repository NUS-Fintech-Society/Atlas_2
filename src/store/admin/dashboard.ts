import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { AddUsersType, CSVType } from '../types/admin.type'
import type { ParseResult } from 'papaparse'
const initialState: AddUsersType[] = []

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<ParseResult<CSVType>>) => {
      state = action.payload.data.map((item) => {
        return {
          date_of_birth: item['Date of Birth'] || '',
          department: item['Department'] || '',
          diet: item['Dietary Restrictions (eg. Allergic to seafood)'] || '',
          discord:
            item[
              'Discord ID (eg: _marcus#2873 please create an account if you do not have one as Discord will be one of our main forms of communication)'
            ],
          faculty: item['Faculty'] || '',
          gender: item['Gender '] || 'Male',
          hobbies: item['Hobbies '] || '',
          linkedin: item['LinkedIn profile LINK (eg. www.linkedin.com/in/XXX)'],
          major: item['Major and Specialization (if any)'] || '',
          name: item['Full Name'],
          nus_email: item['NUS email (xxx@u.nus.edu)'],
          personal_email: item['Gmail'],
          phone: item['Phone Number'],
          race: item['Race '] || '',
          roles: item['Appointed Role '] || '',
          shirt: item['Shirt size'] || '',
          student_id: item['Student ID (AXXXXXXXX)'] || '',
          telegram: item['Telegram Handle(@xxx)'] || '',
          year: item['Year of Study'] || '',
        }
      })

      return state
    },
  },
})

export const { add } = dashboardSlice.actions
export default dashboardSlice.reducer
export const uploadedUsers = (state: RootState) => state.dashboard
