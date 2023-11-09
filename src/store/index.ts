import { configureStore } from '@reduxjs/toolkit'
import userReducer, { UserState } from './reducers/user.reducer'
import workReducer, { WorkState } from './reducers/work.reducer'

export type GlobalState = {
  user: UserState
  work: WorkState
}

export default configureStore({
  reducer: {
    user: userReducer,
    work: workReducer
  }
})