import { MULTI_CHOICE_CREATE } from '../constants/actionTypes';
import { STATUS_READY, STATUS_LOADING } from '../constants/common';
import { PENDING, FULFILLED } from 'redux-promise-middleware';

const initState = {
  saveResponse: {},
  status: STATUS_READY
};

const createQuestionReducer = (state = initState, { type, error, payload }) => {

  switch (type) {
    case `${MULTI_CHOICE_CREATE}_${PENDING}`:
      return {
        ...state,
        status: STATUS_LOADING
      };
      break;
    case `${MULTI_CHOICE_CREATE}_${FULFILLED}`:
      return {
        ...state,
        saveResponse: payload,
        status: STATUS_READY
      };
      break;
  }

  return state;
};

export default createQuestionReducer;
