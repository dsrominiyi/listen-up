import { MULTI_CHOICE_GET_NEW } from '../constants/actionTypes';

export const getNewQuestion = (api) => ({
  type: MULTI_CHOICE_GET_NEW,
  error: null,
  payload: api.get('/multi/new')
});