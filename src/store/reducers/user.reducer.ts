import { UserProps } from '@/types/user'
import { DEFAULT_TOKEN_KEY } from '@/utils/http'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type UserState = {
  userProps: UserProps | null
}

const INIT_STATE: UserState = {
  userProps: null
}

const slice = createSlice({
  name: 'user',

  initialState: INIT_STATE,

  reducers: {
    setUserInfo(state, action: PayloadAction<UserProps | null>) {
      state.userProps = action.payload
    },

    logout(state) {
      localStorage.removeItem(DEFAULT_TOKEN_KEY)
      state.userProps = null
    }
  },
})

export const {
  setUserInfo,
  logout

} = slice.actions

export default slice.reducer
