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

    const pathRoot = history.location.pathname.replace(/(\/)([a-z\-]+)(\/.+)?/gi, '$2');
    const homePage = (pathRoot === '/');

    const menuButton = (
      <div className="menu-button">
        <FlatButton
          className="button"
          fullWidth={true}
          icon={<FontIcon className={`material-icons icon menu ${pathRoot}`}>menu</FontIcon>}
          onClick={() => this.setState({ menuOpen: true })}
        />
      </div>
    );

    const appLogo = (
      <div 
        className={`app-logo ${homePage ? 'xl hvr-pulse-grow-active' : ''}`}
        onClick={homePage ? () => this.setState({ menuOpen: true }) : () => {} }
      >
        <FontIcon className="material-icons app icon">hearing</FontIcon>
      </div>
    );

    return (
      <div>
        <div className="app-bar">
          { homePage ? '' : menuButton }
          { homePage ? '' : appLogo }
        </div>

        { homePage ? appLogo : '' }

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
