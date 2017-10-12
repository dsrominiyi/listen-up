import { MULTI_CHOICE_CREATE } from '../constants/actionTypes';
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';

const initState = {
  saveResponse: null
};

const createQuestionReducer = (state = initState, { type, error, payload }) => {

  switch (type) {
    case `${MULTI_CHOICE_CREATE}_${PENDING}`:
      return {
        saveResponse: null
      };
      break;

    case `${MULTI_CHOICE_CREATE}_${FULFILLED}`:
      return {
        ...state,
        saveResponse: payload
      };
      break;

    case `${MULTI_CHOICE_CREATE}_${REJECTED}`:
      const saveResponse = (payload && payload.error)
        ? payload.error
        : { success: false };
      return {
        ...state,
        saveResponse
      };
  }

  return state;
};

export default createQuestionReducer;
