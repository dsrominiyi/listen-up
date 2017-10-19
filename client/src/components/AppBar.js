import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FlatButton, FontIcon } from 'material-ui';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import AppMenu from './AppMenu';

class AppBar extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired
  };

  state = {
    menuOpen: false
  }

  render() {
    const { menuOpen } = this.state;
    const { history } = this.props;

    const pathRoot = history.location.pathname.replace(/(\/)([a-z0-9\-\.]+)(\/.+)?/gi, '$2');

    return (
      <div>
        <div className="app-bar">
          <div className="menu-button">
            <FlatButton
              className="button"
              fullWidth={true}
              icon={<FontIcon className={`material-icons icon menu ${pathRoot}`}>menu</FontIcon>}
              onClick={() => this.setState({ menuOpen: true })}
            />
          </div>


          <div className="app-logo">
            <FontIcon className="material-icons app icon">hearing</FontIcon>
          </div>
        </div>

        <ReactCSSTransitionGroup
          transitionName="app-menu"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
        >
          {
            menuOpen
              ? (
                <AppMenu 
                  className="app-menu"
                  history={history} 
                  closeMenu={() => this.setState({ menuOpen: false })} 
                />
              )
              : ''
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default AppBar;
