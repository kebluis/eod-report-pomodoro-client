import React, { createContext, useReducer } from "react";
import AuthReducer from "./reducer";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialState = {
    isSignedIn: false,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);
  
  return (
    <AuthContext.Provider value={{ isSignedIn: state.isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
