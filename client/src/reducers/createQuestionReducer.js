import { MULTI_CHOICE_CREATE } from '../constants/actionTypes';
import { PENDING, FULFILLED } from 'redux-promise-middleware';

const initState = {
  isSaving: false,
  saveResponse: {}
};

const createQuestionReducer = (state = initState, { type, error, payload }) => {

  switch (type) {
    case `${MULTI_CHOICE_CREATE}_${PENDING}`:
      return {
        ...state,
        isSaving: true
      };
      break;
    case `${MULTI_CHOICE_CREATE}_${FULFILLED}`:
      return {
        ...state,
        isSaving: false,
        saveResponse: payload
      };
      break;
  }

  return state;
};

export default createQuestionReducer;
