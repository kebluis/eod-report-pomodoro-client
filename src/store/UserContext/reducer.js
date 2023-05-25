const UserReducer = (state, action) => {
  switch (action.type) {
    case "set_user_info":
      return {
        ...state,
        userInfo: action.payload,
      };

    default:
      return state;
  }
};

export default UserReducer;
