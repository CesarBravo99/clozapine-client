import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getDefaultUserState, type UserState } from './user.types'
import { getDefaultUser } from '@/domain/user/user.types'

const userSlice = createSlice({
  name: 'user',
  initialState: getDefaultUserState(),
  reducers: {
    setUserState: (state: UserState, action: PayloadAction<UserState>) => {
      state.user = action.payload.user
      state.affiliations = action.payload.affiliations
    },
    userLogout: (state: UserState) => {
      state.user = getDefaultUser()
      state.affiliations = {}
    },
  },
  selectors: {
    selectUserState: (state: UserState) => state,
    selectUser: (state: UserState) => state?.user,
    selectAffiliations: (state: UserState) => state?.affiliations,
  },
})

export const { setUserState, userLogout } = userSlice.actions
export const { selectUserState, selectUser, selectAffiliations } = userSlice.selectors
export default userSlice.reducer
