import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AudioPlayer from 'react-responsive-audio-player';
import ChoiceGrid from '../components/ChoiceGrid';
import AnswerOverlay from '../components/AnswerOverlay';

import bubblesBackground from '../style/js/bubbles';

import ApiClient from '../services/ApiClient';

import * as multiChoiceActions from '../actions/multiChoiceActions';

import { BASE_POINTS, BASE_URL } from '../constants/common';

class MultiChoice extends Component {

  static propTypes = {
    choices: PropTypes.array.isRequired,
    sound: PropTypes.object.isRequired,
    maxPlays: PropTypes.number.isRequired,
    getNewQuestion: PropTypes.func.isRequired
  }

  state = {
    score: 0,
    playCount: 0,
    isWrongAnswer: false,
    isCorrectAnswer: false,
    showOverlay: false
  };

  incrementPlays = () => {
    let { playCount } = this.state;
    playCount++;
    this.setState({ playCount });
  }

  canPlay = () => {
    const { maxPlays } = this.props;
    const { playCount } = this.state;
    if (maxPlays === playCount) {
      this.audioElement.pause();
    }
  }

  checkAnswer = (choiceId) => {
    const { sound } = this.props;

    if (choiceId !== sound.answerId) {
      return this.wrongAnswer();
    }

    const { playCount } = this.state;

    const pointsAwarded = playCount
      ? Math.round(BASE_POINTS / playCount)
      : BASE_POINTS;

    this.correctAnswer(pointsAwarded);
  }

  wrongAnswer = () => {
    this.setState({
      playCount: 0,
      showOverlay: true
    });
    this.props.getNewQuestion();
  }

  correctAnswer = (points) => {
    this.setState({
      score: this.state.score + points,
      playCount: 0,
      isCorrectAnswer: true,
      showOverlay: true
    });
    this.props.getNewQuestion();
  }

  componentDidMount() {
    bubblesBackground();
    this.props.getNewQuestion();
  }

  componentDidUpdate() {
    bubblesBackground();
  }

  render() {

    const { choices, sound, maxPlays } = this.props;
    const { isCorrectAnswer, showOverlay, playCount, score } = this.state;

    const correctChoice = choices.filter(choice => (choice.id === sound.answerId))[0];

    const playsLeft = maxPlays - playCount;

    return (
      <div className="multi-choice">
        <div className="content">
          <canvas className="background-canvas"/>
          <div className="main-container">
            <div className="info">
              <div className="text">{ `PLAYS LEFT: ${playsLeft}` }</div>
              <div className="text">{ `SCORE: ${score}` }</div>
            </div>
            <AudioPlayer
              className="audio-player"
              hideBackSkip={true}
              hideForwardSkip={true}
              disableSeek={true}
              cycle={false}
              onMediaEvent={{ 
                ended: this.incrementPlays,
                play: this.canPlay
              }}
              playlist={[{ 
                url: sound.src, 
                displayText: 'Name the sound!'
              }]}
              audioElementRef={ref => this.audioElement = ref}
            />

            <ChoiceGrid
              className="choice-grid"
              choices={choices}
              onChoiceMade={choiceId => this.checkAnswer(choiceId)}
            />
          </div>
        </div>
        {
          showOverlay
            ? (
              <AnswerOverlay
                className="answer-overlay"
                isCorrect={isCorrectAnswer}
                correctChoice={correctChoice}
                onContinue={() => this.setState({
                  playCount: 0,
                  isCorrectAnswer: false,
                  showOverlay: false
                })}
              />
            )
            : ''
        }
      </div>
    );
  }
}

const api = new ApiClient(BASE_URL);

const mapStateToProps = state => {
  return {
    choices: state.choices,
    sound: state.sound,
    maxPlays: state.maxPlays
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getNewQuestion: () => dispatch(multiChoiceActions.getNewQuestion(api))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MultiChoice);