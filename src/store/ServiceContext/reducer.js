const ServiceReducer = (state, action) => {
  switch (action.type) {
    case "toggle_service":
      return {
        ...state,
        isBreak: action.payload,
      };

    default:
      return state;
  }
};

export default ServiceReducer;
