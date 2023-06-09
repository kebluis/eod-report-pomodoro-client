const ServiceReducer = (state, action) => {
  switch (action.type) {
    case "change_service":
      return {
        ...state,
        serviceSelected: action.payload,
      };
    case "toggle_countdown":
      return {
        ...state,
        isCountdownStarted: action.payload,
      };

    default:
      return state;
  }
};

export default ServiceReducer;
