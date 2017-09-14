import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin(); // Needed for onTouchTap

render(
  <MuiThemeProvider>
    <span>TESTEROO</span>
  </MuiThemeProvider>,
  document.getElementById('root')
);
