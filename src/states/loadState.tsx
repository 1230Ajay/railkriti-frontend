// utils/loadState.js
export const loadState = () => {
  try {
    const buttonState = localStorage.getItem('buttonState');
    const loginState = localStorage.getItem('loginState');
    const forgotPasswordState = localStorage.getItem('forgotPasswordState');


    
    return {
      button: buttonState ? JSON.parse(buttonState) : undefined,
      login: loginState ? JSON.parse(loginState) : undefined,
      forgot_password: forgotPasswordState ? JSON.parse(forgotPasswordState) : undefined,
    };
  } catch (err) {
    return undefined;
  }
};
