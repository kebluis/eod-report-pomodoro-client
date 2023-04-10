const AuthReducer = (state, action) => {
  switch (action.type) {
    case "is_authenticated":
      return {
        ...state,
        isSignedIn: action.payload,
      };

    default:
      return state;
  }
};

export default AuthReducer;
