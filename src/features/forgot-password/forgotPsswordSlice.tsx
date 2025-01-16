import { createSlice } from "@reduxjs/toolkit";

export const forgotPasswordSlice = createSlice({
    name: "forgot_password",
    initialState: {
        identifier: ''
    },
    reducers:{
        setIdentifier:(state,action)=>{
          state.identifier=action.payload;
        }
    }
});

export const {setIdentifier} = forgotPasswordSlice.actions;
export const forgotPasswordReducer = forgotPasswordSlice.reducer;