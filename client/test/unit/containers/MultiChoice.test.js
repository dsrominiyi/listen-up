import React from 'react';
import '../../../node_modules/enzyme/mount';
import { shallowWithStore } from 'enzyme-redux';
import { createMockStore } from 'redux-test-utils';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

import * as multiChoiceActions from '../../../src/actions/multiChoiceActions';

import { BASE_POINTS } from '../../../src/constants/common';

const bubbles = { 
  start: sinon.spy(),
  stop: sinon.spy() 
};

const ApiClient = function() { return { get: () => {} }; };
const Bubbles = function() { return bubbles; };

proxyquire.noCallThru();

const module = proxyquire(
  '../../../src/containers/MultiChoice',
  {
    '../services/ApiClient': ApiClient,
    '../style/js/animation/Bubbles': Bubbles 
  }
);
const MultiChoice = module.default;

describe('<MultiChoice />', () => {

  let component;
  let store;
  let choices;
  let sound;
  let maxPlays;
  let api;

  const initialise = () => {
    const state = {
      choices,
      sound,
      maxPlays
    };

    store = createMockStore(state);
    component = shallowWithStore(<MultiChoice />, store).dive();
  };

  beforeEach(() => {

    choices = [];
    for (let i=1; i<=4; i++) {
      choices.push({
        id: i,
        text: `choice ${i}`,
        img: `/images/${i}.jpg`
      });
    }
    sound = { 
      src: '/audio/sound1.mp3',
      answerId: 2
    };
    maxPlays = 3;
    
    api = new ApiClient();

    bubbles.start.reset();
    bubbles.stop.reset();
    
    initialise();
  });

  it('should retrieve a question when the component has mounted', () => {
    const expectedAction = multiChoiceActions.getNewQuestion(api);

    component.instance().componentDidMount();
    expect(store.isActionDispatched(expectedAction)).to.equal(true);
  });

  it('should not render the background animation if there are no choices', () => {
    choices = [];
    initialise();

    component.instance().componentDidUpdate();
    expect(bubbles.start).to.not.have.been.called;
  });

  it('should render the background animation and set animateBackground to true', () => {

    component.instance().componentDidUpdate();
    expect(bubbles.start).to.have.been.called;
    expect(component.state().animateBackground).to.equal(true);
  });

  it('should not attempt to re-render the background animation if animateBackground is true', () => {

    component.instance().componentDidUpdate();
    expect(bubbles.start).to.have.been.called;
    expect(component.state().animateBackground).to.equal(true);

    bubbles.start.reset();
    component.instance().componentDidUpdate();
    expect(bubbles.start).to.not.have.been.called;
    expect(component.state().animateBackground).to.equal(true);
  });

  it('should render the audio player', () => {
    
    const player = component.find('.audio-player');
    expect(player.props().playlist[0].url).to.equal(sound.src);
    expect(player.props().onMediaEvent.ended).to.equal(component.instance().incrementPlays);
  });

  it('should render the choice grid', () => {
    
    const grid = component.find('.choice-grid');
    expect(grid.props().choices).to.equal(choices);
  });

  it('should increment the play count', () => {
    
    expect(component.state().playCount).to.equal(0);
    component.instance().incrementPlays();
    expect(component.state().playCount).to.equal(1);
    component.instance().incrementPlays();
    expect(component.state().playCount).to.equal(2);
  });
  
  it('should increment the users score according to the play count on a correct choice', () => {
    
    const correctAnswerId = sound.answerId;
    component.instance().checkAnswer(correctAnswerId);
    expect(component.state().score).to.equal(BASE_POINTS);

    for (let playCount=1; playCount<=maxPlays; playCount++) {
      initialise();

      component.setState({ playCount });
      component.instance().checkAnswer(correctAnswerId);
      expect(component.state().score).to.equal(Math.round(BASE_POINTS / playCount));
    }
  });

  it('should set isCorrectAnswer and showOverlay to true on a correct choice', () => {
    
    const correctAnswerId = sound.answerId;
    component.instance().checkAnswer(correctAnswerId);
    expect(component.state().isCorrectAnswer).to.equal(true);
    expect(component.state().showOverlay).to.equal(true);
  });

  it('should reset playCount on a correct choice', () => {
    
    const correctAnswerId = sound.answerId;
    component.instance().checkAnswer(correctAnswerId);
    expect(component.state().playCount).to.equal(0);
  });

  it('should retrieve a new question on a correct choice', () => {
    
    const correctAnswerId = sound.answerId;
    component.instance().checkAnswer(correctAnswerId);

    const expectedAction = multiChoiceActions.getNewQuestion(api);
    expect(store.isActionDispatched(expectedAction)).to.equal(true);
  });

  it('should set showOverlay to true on an incorrect choice', () => {
    
    const wrongAnswerId = sound.answerId + 1;
    component.instance().checkAnswer(wrongAnswerId);
    expect(component.state().showOverlay).to.equal(true);
  });

  it('should reset playCount on an incorrect choice', () => {
    
    const wrongAnswerId = sound.answerId + 1;
    component.instance().checkAnswer(wrongAnswerId);
    expect(component.state().playCount).to.equal(0);
  });

  it('should retrieve a new question on an incorrect choice', () => {
    
    const wrongAnswerId = sound.answerId + 1;
    component.instance().checkAnswer(wrongAnswerId);

    const expectedAction = multiChoiceActions.getNewQuestion(api);
    expect(store.isActionDispatched(expectedAction)).to.equal(true);
  });

  it('should not render the answer overlay when showOverlay is false', () => {
    
    const overlay = component.find('.answer-overlay');
    expect(overlay).to.have.length(0);
  });

  it('should render the answer overlay when showOverlay is true', () => {
    
    const correctAnswerId = sound.answerId;
    component.instance().checkAnswer(correctAnswerId);
    
    const overlay = component.find('.answer-overlay');
    const correctChoice = choices.filter(choice => (choice.id === sound.answerId))[0];
    expect(overlay).to.have.length(1);
    expect(overlay.props().isCorrect).to.equal(component.state().isCorrectAnswer);
    expect(overlay.props().correctChoice).to.equal(correctChoice);
  });

  it('should close the overlay and set isCorrectAnswer to false when onContinue is called', () => {
    
    const correctAnswerId = sound.answerId;
    component.instance().checkAnswer(correctAnswerId);
    
    let overlay = component.find('.answer-overlay');
    expect(overlay).to.have.length(1);

    overlay.props().onContinue();
    expect(component.state().isCorrectAnswer).to.equal(false);
    expect(component.state().showOverlay).to.equal(false);

    overlay = component.find('.answer-overlay');
    expect(overlay).to.have.length(0);
  });

  it('should stop the background animation before unmounting', () => {

    component.instance().componentWillUnmount();
    expect(bubbles.stop).to.have.been.called;
  });

});