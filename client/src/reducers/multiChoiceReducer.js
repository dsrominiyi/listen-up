import { DEFAULT_MAX_PLAYS } from '../constants/common';
import { MULTI_CHOICE_GET_NEW } from '../constants/actionTypes';
import { FULFILLED } from 'redux-promise-middleware';

export default function multiChoiceReducer() {

  const initState = {
    choices: [],
    sound: {},
    maxPlays: DEFAULT_MAX_PLAYS
  };

  return (state = initState, { type, error, payload }) => {

    switch (type) {
      case `${MULTI_CHOICE_GET_NEW}_${FULFILLED}`:
        return {
          ...state,
          choices: payload.choices,
          sound: payload.sound
        };
    }

    return state;
  };
}
