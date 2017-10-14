import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FlatButton, FontIcon } from 'material-ui';

import { flatButtonLabel } from '../style/js/appMenu';
import { HEX_LILAC } from '../constants/style';

class AppMenu extends Component {

  static propTypes = {
    closeMenu: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  handleClickOutside = event => {
    if (this.menuBox && !this.menuBox.contains(event.target)) {
      this.props.closeMenu();
    }
  }

  route = route => {
    this.props.history.push(route);
    this.props.closeMenu();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    const { route } = this;

    return (
      <div className="app-menu">
        <div className="menu-box" ref={node => this.menuBox = node}>
          <div className="home-button">
            <FlatButton
              fullWidth={true}
              icon={<FontIcon className={'material-icons icon home'}>home</FontIcon>}
              onClick={() => route('/')}
            />
          </div>

          <div className="menu-section game-modes">
            <div className="category">Game Modes</div>

            <FlatButton
              fullWidth={true}
              label="Multiple Choice"
              labelStyle={flatButtonLabel(HEX_LILAC)}
              onClick={() => route('/multi')}
            />
          </div>

          <div className="menu-section tools">
            <div className="category">Tools</div>

            <FlatButton
              fullWidth={true}
              label="Create Multiple Choice Question"
              labelStyle={flatButtonLabel()}
              onClick={() => route('/create/multi')}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AppMenu;