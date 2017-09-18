import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import './style/index.scss';

import MultiChoice from './containers/MultiChoice';

import multiChoiceReducer from './reducers/multiChoiceReducer';

injectTapEventPlugin(); // Needed for onTouchTap

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  multiChoiceReducer(),
  composeEnhancers(
    applyMiddleware(
      promiseMiddleware(),
      thunk
    )
  )
);

render(
  <MuiThemeProvider>
    <Provider store={store}>
      <MultiChoice/>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
