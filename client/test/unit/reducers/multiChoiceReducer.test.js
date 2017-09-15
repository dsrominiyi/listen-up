import multiChoiceReducer from '../../../src/reducers/multiChoiceReducer';

import { DEFAULT_MAX_PLAYS } from '../../../src/constants/common';
import { MULTI_CHOICE_GET_NEW } from '../../../src/constants/actionTypes';
import { FULFILLED } from 'redux-promise-middleware';

describe('multiChoiceReducer', () => {

  let reducer;
  let initState;
  let state;

  beforeEach(() => {

    initState = {
      choices: [],
      sound: {},
      maxPlays: DEFAULT_MAX_PLAYS
    };

    state = {
      choices: ['choices'],
      sound: { sound: ''},
      maxPlays: 4
    };

    reducer = multiChoiceReducer();
  });

  it('should return the default state if no state or matching action is passed', () => {
    
    const newState = reducer(undefined, {});
    expect(newState).to.deep.equal(initState);
  });

  it('should return the current state if no matching action is passed', () => {
    
    const newState = reducer(state, {});
    expect(newState).to.deep.equal(state);
  });

  it('should update the sound and choices when a new question is retrieved', () => {
    const action = {
      type: `${MULTI_CHOICE_GET_NEW}_${FULFILLED}`,
      error: null,
      payload: { 
        choices: ['new', 'choices'],
        sound: { sound: 'new' }
      }
    };

    const newState = reducer(state, action);
    expect(newState).to.deep.equal({
      ...state,
      choices: action.payload.choices,
      sound: action.payload.sound
    });
  });
});