const AuthReducer = (state, action) => {
  switch (action.type) {
    case "is_authenticated":
      return {
        ...state,
        isSignedIn: action.payload,
      };
    case "store_token":
      return {
        ...state,
        token: action.payload,
      };

    default:
      return state;
  }
};

export default AuthReducer;
