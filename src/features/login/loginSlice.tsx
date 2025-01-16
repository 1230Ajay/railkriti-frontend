import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    email: '',
    mobile:'',
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setMobileNumber:(state,action)=>{
      state.mobile=action.payload;
    }
  },
});

export const { setEmail ,setMobileNumber } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
