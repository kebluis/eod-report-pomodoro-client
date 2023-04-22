import React, { createContext, useReducer } from "react";
import AuthReducer from "./reducer";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialState = {
    isSignedIn: false,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const isAuthenticated = (data) => {
    dispatch({
      type: "is_authenticated",
      payload: data,
    });
  };

  return (
    <AuthContext.Provider
      value={{ isSignedIn: state.isSignedIn, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
