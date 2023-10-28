import { configureStore } from '@reduxjs/toolkit'
import userReducer, { UserState } from './reducers/user.reducer'

export type GlobalState = {
  user: UserState
}

export default configureStore({
  reducer: {
    user: userReducer
  }
})