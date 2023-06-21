import React, { createContext, useReducer } from "react";
import AuthReducer from "./reducer";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialState = {
    token: null,
    isSignedIn: false,
    userInfo: null
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const storeToken = (data) => {
    dispatch({
      type: "store_token",
      payload: data,
    });
  };

  const isAuthenticated = (data) => {
    dispatch({
      type: "is_authenticated",
      payload: data,
    });
  };

  const storeUserInfo = data => {
    dispatch({
      type: "user_info",
      payload: data,
    });
  }

  return (
    <AuthContext.Provider
      value={{  token: state.token, isSignedIn: state.isSignedIn, storeToken, isAuthenticated, storeUserInfo, userInfo: state.userInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
