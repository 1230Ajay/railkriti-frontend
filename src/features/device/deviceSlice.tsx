import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ButtonState {
  deviceButtonStates: {
    [deviceUid: string]: {
      disabled: boolean;
      timer: number | null;
    };
  };
}

const initialState: ButtonState = {
  deviceButtonStates: {},
};

const buttonSlice = createSlice({
  name: 'button',
  initialState,
  reducers: {
    disableButton(state, action: PayloadAction<{ deviceUid: string }>) {
      const { deviceUid } = action.payload;
      state.deviceButtonStates[deviceUid] = {
        ...state.deviceButtonStates[deviceUid],
        disabled: true,
      };
    },
    enableButton(state, action: PayloadAction<{ deviceUid: string }>) {
      const { deviceUid } = action.payload;
      state.deviceButtonStates[deviceUid] = {
        ...state.deviceButtonStates[deviceUid],
        disabled: false,
      };
    },
    setTimer(state, action: PayloadAction<{ deviceUid: string; timer: number | null }>) {
      const { deviceUid, timer } = action.payload;
      state.deviceButtonStates[deviceUid] = {
        ...state.deviceButtonStates[deviceUid],
        timer,
      };
    },
  },
});

export const { disableButton, enableButton, setTimer } = buttonSlice.actions;
export const buttonReducer = buttonSlice.reducer;
