import React from 'react';
import 'enzyme/mount';
import { shallow } from 'enzyme';

import AppBar from '../../../src/components/AppBar';

describe('<AppBar />', () => {

  let component;
  let history;

  beforeEach(() => {

    history = {
      location: {
        pathname: '/test/path'
      }
    };

    component = shallow(<AppBar history={history} />);
  });

  it('should initialise with menuOpen = false', () => {

    expect(component.state().menuOpen).to.equal(false);
  });

  it('should render the menu button', () => {

    const menuButton = component.find('.menu-button');
    expect(menuButton.length).to.equal(1);
  });

  it('should set menuOpen = true when the menu button is clicked', () => {
    
    const menuButton = component.find('.menu-button');
    menuButton.find('.button').simulate('click');

    expect(component.state().menuOpen).to.equal(true);
  });

  it('the AppMenu should not be rendered when menuOpen = false', () => {
    
    const appMenu = component.find('.app-menu');
    expect(appMenu.length).to.equal(0);
  });

  it('the AppMenu should be rendered when menuOpen = true', () => {

    component.setState({ menuOpen: true });
    
    const appMenu = component.find('.app-menu');
    expect(appMenu.length).to.equal(1);
  });

  it('the AppMenu closeMenu prop should set menuOpen to false', () => {

    component.setState({ menuOpen: true });
    
    const appMenu = component.find('.app-menu');
    appMenu.props().closeMenu();

    expect(component.state().menuOpen).to.equal(false);
  });
});