import React from 'react';
import 'enzyme/mount';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Notification from '../../../src/components/Notification';

describe('<Notification />', () => {

  let component;
  let type;
  let message;
  let onDismiss;

  beforeEach(() => {

    type = 'success';
    message = 'Success notification!';
    onDismiss = sinon.spy();

    component = shallow(
      <Notification
        type={type}
        message={message}
        onDismiss={onDismiss}
      />
    );
  });

  it('should display the message', () => {

    const messageDiv = component.find('.message');
    expect(messageDiv.props().children).to.contain(message);
  });

  it('should add the type string to the message div classes', () => {

    const messageDiv = component.find('.message');
    expect(messageDiv.hasClass(type)).to.equal(true);
  });

  it('should call onDismiss when clicked', () => {

    component.simulate('click');
    expect(onDismiss).to.have.been.called;
  });
});