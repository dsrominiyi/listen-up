import React from 'react';
import 'enzyme/mount';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import AnswerOverlay from '../../../../src/components/AnswerOverlay';

describe('<AnswerOverlay />', () => {

  let component;
  let correctChoice;
  let onContinue;

  const initialise = (isCorrect) => {
    component = shallow(
      <AnswerOverlay
        isCorrect={isCorrect}
        correctChoice={correctChoice}
        onContinue={onContinue}
      />
    );
  };

  beforeEach(() => {

    correctChoice = {
      text: 'choice 2',
      img: '/images/2.jpg'
    };
    onContinue = sinon.spy();

    initialise(true);
  });

  it('should display the correct answer message if isCorrect', () => {

    const wrongAnswerMsg = component.find('.msg.wrong');
    expect(wrongAnswerMsg).to.have.length(0);

    const correctAnswerMsg = component.find('.msg.correct');
    expect(correctAnswerMsg).to.have.length(1);

    expect(correctAnswerMsg.props().children).to.contain(correctChoice.text);
  });

  it('should display the wrong answer message if !isCorrect', () => {

    initialise(false);

    const wrongAnswerMsg = component.find('.msg.wrong');
    expect(wrongAnswerMsg).to.have.length(1);

    const correctAnswerMsg = component.find('.msg.correct');
    expect(correctAnswerMsg).to.have.length(0);

    expect(wrongAnswerMsg.props().children).to.contain(correctChoice.text);
  });

  it('should display the picture of the correct img', () => {

    const correctChoiceImg = component.find('.answer-img');
    expect(correctChoiceImg.type()).to.equal('img');
    expect(correctChoiceImg.props().src).to.equal(correctChoice.img);
  });

  it('should call onContinue when the user clicks on the overlay', () => {

    component.simulate('click');
    expect(onContinue).to.have.been.called;
  });

});