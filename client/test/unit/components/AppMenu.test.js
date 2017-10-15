import React from 'react';
import 'enzyme/mount';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import AppMenu from '../../../src/components/AppMenu';

describe('<AppMenu />', () => {

  let component;
  let closeMenu;
  let history;
  let gameModes;
  let tools;

  beforeEach(() => {

    closeMenu = sinon.spy();
    history = {
      push: sinon.spy()
    };

    gameModes = {
      multi: '/multi'
    };

    tools = {
      createMulti: '/create/multi'
    };

    component = shallow(
      <AppMenu
        closeMenu={closeMenu}
        history={history}
      />
    );
  });

  it('should render the home button', () => {

    const homeButton = component.find('#home');
    expect(homeButton.length).to.equal(1);

    homeButton.simulate('click');

    expect(history.push).to.have.been.calledWith('/');
  });

  it('should render buttons that route the user to each game mode', () => {

    Object.entries(gameModes).forEach(([id, route]) => {
      const button = component.find(`#${id}`);
      expect(button.length).to.equal(1);

      button.simulate('click');

      expect(history.push).to.have.been.calledWith(route);
      expect(closeMenu).to.have.been.called;
    });
  });

  it('should render buttons that route the user to each tool', () => {

    Object.entries(tools).forEach(([id, route]) => {
      const button = component.find(`#${id}`);
      expect(button.length).to.equal(1);

      button.simulate('click');

      expect(history.push).to.have.been.calledWith(route);
      expect(closeMenu).to.have.been.called;
    });
  });
});