import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import promiseMiddleware from 'redux-promise-middleware';

import AppBar from './components/AppBar';
import MultiChoice from './containers/MultiChoice';
import CreateQuestion from './containers/CreateQuestion';

import rootReducer from './reducers/_reducers';

import './style/sass/index.scss';

injectTapEventPlugin(); // Needed for onTouchTap

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      promiseMiddleware()
    )
  )
);

render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router>
        <div>
          <Route path="/" component={AppBar} />
          <Route path="/multi" component={MultiChoice} />
          <Route path="/create" component={CreateQuestion} />
        </div>
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
