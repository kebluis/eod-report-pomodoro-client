import React, { createContext, useReducer } from "react";
import AuthReducer from "./reducer";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialState = {
    token: null,
    isSignedIn: false,
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

  return (
    <AuthContext.Provider
      value={{  token: state.token, isSignedIn: state.isSignedIn, storeToken, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
