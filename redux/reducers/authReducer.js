export default (state = {}, action) => {
  switch (action.type) {
    case 'SAVE_TOKEN':
      return {
        ...state,
        savedToken: action.payload
      }
    default:
      return state;
  }
}