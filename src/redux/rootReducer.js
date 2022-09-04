import { combineReducers } from 'redux';


    import notesReducer from './Notes/notes.reducer';


    const rootReducer = combineReducers({

        notes: notesReducer,

    });

    export default rootReducer;