import React from 'react';
import '../../../node_modules/enzyme/mount';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import MultiChoice from '../../../src/containers/MultiChoice';

import { BASE_POINTS } from '../../../src/constants';

describe('<MultiChoice />', () => {

  let component;
  let choices;
  let sound;
  let maxPlays;
  let getNewSound;

  const initialise = () => {
    component = shallow(
      <MultiChoice 
        choices={choices} 
        sound={sound} 
        maxPlays={maxPlays} 
        getNewSound={getNewSound} 
      />
    );
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
    getNewSound = sinon.spy();
    
    initialise();
  });

  it('should retrieve a question when the component has mounted', () => {
    
    component.instance().componentDidMount();
    expect(getNewSound).to.have.been.called;
  });

  it('should render the audio player', () => {
    
    const player = component.find('.audio-player');
    expect(player.props().url).to.equal(sound.src);
    expect(player.props().onEnded).to.equal(component.instance().incrementPlays);
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

  it('should retrieve a new sound on a correct choice', () => {
    
    const correctAnswerId = sound.answerId;
    component.instance().checkAnswer(correctAnswerId);
    expect(getNewSound).to.have.been.called;
  });


  it('should set showOverlay to true on an incorrect choice', () => {
    
    const wrongAnswerId = sound.answerId + 1;
    component.instance().checkAnswer(wrongAnswerId);
    expect(component.state().showOverlay).to.equal(true);
  });

  it('should retrieve a new sound on an incorrect choice', () => {
    
    const wrongAnswerId = sound.answerId + 1;
    component.instance().checkAnswer(wrongAnswerId);
    expect(getNewSound).to.have.been.called;
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

});