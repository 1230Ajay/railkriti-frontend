import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { loginReducer } from './features/login/loginSlice';
import { buttonReducer } from './features/device/deviceSlice';
import { loadState } from './states/loadState';
import { persistState } from './states/persistState';
import { forgotPasswordReducer } from './features/forgot-password/forgotPsswordSlice';



const preloadedState = loadState();

const rootReducer = combineReducers({
  login: loginReducer,
  button: buttonReducer,
  forgot_password:forgotPasswordReducer
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistState),
});
