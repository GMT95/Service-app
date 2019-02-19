export default (state = {screenChanger: false}, action) => {
  switch (action.type) {
    case 'SAVE_TOKEN':
      return {
        ...state,
        savedToken: action.payload
      }
    case 'SAVE_DATA':
      console.log('In save data reducer',action.payload)
      return {
        ...state,
        // savedData: action.payload.data,
        id: action.payload.id,
        name: action.payload.name,
        picture: action.payload.picture,
        screenChanger: action.payload.phoneNumberInputScreen
      }  
    default:
      return state;
  }
}