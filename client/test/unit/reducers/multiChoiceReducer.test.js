import multiChoiceReducer, { initState } from '../../../src/reducers/multiChoiceReducer';

import { MULTI_CHOICE_GET_NEW } from '../../../src/constants/actionTypes';
import { FULFILLED } from 'redux-promise-middleware';

describe('multiChoiceReducer', () => {

  let state;

  beforeEach(() => {

    state = {
      description: '',
      choices: ['choices'],
      sound: { sound: ''},
      maxPlays: 4
    };
  });

  it('should return the default state if no state or matching action is passed', () => {
    
    const newState = multiChoiceReducer(undefined, {});
    expect(newState).to.deep.equal(initState);
  });

  it('should return the current state if no matching action is passed', () => {
    
    const newState = multiChoiceReducer(state, {});
    expect(newState).to.deep.equal(state);
  });

  it('should update the props when a new question is retrieved', () => {
    const action = {
      type: `${MULTI_CHOICE_GET_NEW}_${FULFILLED}`,
      error: null,
      payload: {
        description: 'new question', 
        choices: ['new', 'choices'],
        sound: { sound: 'new' }
      }
    };

    const newState = multiChoiceReducer(state, action);
    expect(newState).to.deep.equal({
      ...state,
      description: action.payload.description,
      choices: action.payload.choices,
      sound: action.payload.sound
    });
  });
});