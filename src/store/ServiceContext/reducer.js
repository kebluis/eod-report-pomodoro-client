const ServiceReducer = (state, action) => {
  switch (action.type) {
    case "change_service":
      return {
        ...state,
        serviceSelected: action.payload,
      };

    default:
      return state;
  }
};

export default ServiceReducer;
