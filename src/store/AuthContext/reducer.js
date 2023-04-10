const AuthReducer = (state, action) => {
  switch (action.type) {
    case "is_authenticated":
      return {
        ...state,
        isSignedIn: action.payload,
      };
      break;

    default:
      return state;
      break;
  }
};

export default AuthReducer;
