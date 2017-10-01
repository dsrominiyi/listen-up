import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
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

    const currentPage = history.location.pathname.replace('/', '');

    return (
      <div>
        <div className="app-bar">
          <div className="menu-button">
            <FlatButton
              fullWidth={true}
              icon={<FontIcon className={`material-icons icon menu ${currentPage}`}>menu</FontIcon>}
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
