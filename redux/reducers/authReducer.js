export default (state = {screenChanger: false,userData: null}, action) => {
  switch (action.type) {
    case 'SAVE_TOKEN':
      return {
        ...state,
        savedToken: action.payload,
        id: null
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
    case 'GET_AND_SAVE_DATA':
      console.log('In GET and save reducer')
      return {
        ...state,
        userData: action.payload
      }  
    default:
      return state;
  }
}