import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    value: number,
    isMore: boolean,
    memberList:[]
  }
  
  const initialState: UserState = {
    value: 0,
    isMore:false,
    memberList:[]
  }


  export const userSlice =  createSlice({
    name: 'user',
    initialState,
    reducers: {
      increment: (state) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.value += 1
      },
      decrement: (state) => {
        state.value -= 1
      },
      incrementByAmount: (state, action: PayloadAction<number>) => {
        state.value += action.payload
      },

      isMenuUp:(state,action) => {
        state.isMore = action.payload
      },
      isFavoriteMember:(state,action)=>{
        state.memberList = action.payload
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { increment, decrement, incrementByAmount,isMenuUp,isFavoriteMember } = userSlice.actions
  
  export default userSlice.reducer