import { MULTI_CHOICE_GET_NEW, MULTI_CHOICE_CREATE } from '../constants/actionTypes';

export const getNewQuestion = (api) => ({
  type: MULTI_CHOICE_GET_NEW,
  error: null,
  payload: api.get('/multi')
});

export const createQuestion = (api, newQuestion) => ({
  type: MULTI_CHOICE_CREATE,
  error: null,
  payload: api.post('/multi', newQuestion)
});