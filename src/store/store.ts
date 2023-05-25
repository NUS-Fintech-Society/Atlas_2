import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './admin/dashboard'
import searchNameReducer from '../components/recruitment/searchNameSlice'

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    searchName: searchNameReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export default store
