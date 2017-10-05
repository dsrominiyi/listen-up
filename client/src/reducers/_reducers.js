import { combineReducers } from 'redux';

import multiChoice from './multiChoiceReducer';
import createQuestion from './createQuestionReducer';


export default combineReducers({
  multiChoice,
  createQuestion
});