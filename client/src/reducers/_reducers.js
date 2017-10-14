import { combineReducers } from 'redux';

import multiChoice from './multiChoiceReducer';
import createMulti from './createMultiReducer';


export default combineReducers({
  multiChoice,
  createMulti
});