// utils/persistState.js
export const persistState = (store: { getState: () => any; }) => (next: (arg0: any) => any) => (action: any) => {
  const result = next(action);
  const state = store.getState();
  try {
    const serializedButtonState = JSON.stringify(state.button);
    localStorage.setItem('buttonState', serializedButtonState);
    
    const serializedLoginState = JSON.stringify(state.login);
    localStorage.setItem('loginState', serializedLoginState);

    const serializedForgotPasswordState = JSON.stringify(state.forgot_password);
    localStorage.setItem('forgotPasswordState', serializedLoginState);
  } catch (err) {
    // Ignore write errors
  }
  return result;
};
