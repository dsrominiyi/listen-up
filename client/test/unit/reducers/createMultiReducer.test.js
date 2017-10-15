import createMultiReducer, { initState } from '../../../src/reducers/createMultiReducer';

import { MULTI_CHOICE_CREATE } from '../../../src/constants/actionTypes';
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';

describe('createMultiReducer', () => {

  let state;

  beforeEach(() => {

    state = { saveResponse: { success: true } };
  });

  it('should return the default state if no state or matching action is passed', () => {
    
    const newState = createMultiReducer(undefined, {});
    expect(newState).to.deep.equal(initState);
  });

  it('should return the current state if no matching action is passed', () => {
    
    const newState = createMultiReducer(state, {});
    expect(newState).to.deep.equal(state);
  });

  it('should clear saveResponse when a create action is pending', () => {
    const action = {
      type: `${MULTI_CHOICE_CREATE}_${PENDING}`,
      error: null,
      payload: {}
    };

    const newState = createMultiReducer(state, action);
    expect(newState).to.deep.equal({
      ...state,
      saveResponse: null
    });
  });

  it('should update saveResponse with the payload when a create action is fulfilled', () => {
    const action = {
      type: `${MULTI_CHOICE_CREATE}_${FULFILLED}`,
      error: null,
      payload: { success: true, questionId: 'newId' }
    };

    const newState = createMultiReducer(state, action);
    expect(newState).to.deep.equal({
      ...state,
      saveResponse: action.payload
    });
  });

  it('should update saveResponse with payload.error when a create action is rejected', () => {
    const action = {
      type: `${MULTI_CHOICE_CREATE}_${REJECTED}`,
      error: null,
      payload: { error: { success: false, error: 'Error!'} }
    };

    const newState = createMultiReducer(state, action);
    expect(newState).to.deep.equal({
      ...state,
      saveResponse: action.payload.error
    });
  });

  it('should update saveResponse with a generic response on rejection if !payload.error', () => {
    const action = {
      type: `${MULTI_CHOICE_CREATE}_${REJECTED}`,
      error: null,
      payload: {}
    };

    const newState = createMultiReducer(state, action);
    expect(newState).to.deep.equal({
      ...state,
      saveResponse: { success: false }
    });
  });
});