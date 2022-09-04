import { INCREMENT, DECREMENT, ISLOGIN } from './notes.types';


const INITIAL_STATE = {
  islogin: localStorage.getItem('token') ? true : false
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ISLOGIN:
      return {
        ...state, islogin: action.payload
      }
    default: return state;

  }

};

export default reducer;