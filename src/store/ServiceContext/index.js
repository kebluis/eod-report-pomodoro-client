import React, { createContext, useReducer } from "react";
import ServiceReducer from "./reducer";

export const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const initialState = {
    isBreak: true,
  };

  const [state, dispatch] = useReducer(ServiceReducer, initialState);

  const toggleService = (data) => {
    dispatch({
      type: "toggle_service",
      payload: data,
    });
  };

  return (
    <ServiceContext.Provider
      value={{ isBreak: state.isBreak, toggleService }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
