import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

import ChoiceGrid from '../components/ChoiceGrid';
import AnswerOverlay from '../components/AnswerOverlay';

import { BASE_POINTS } from '../constants';

export default class MultiChoice extends Component {

  static propTypes = {
    choices: PropTypes.array.isRequired,
    sound: PropTypes.object.isRequired,
    maxPlays: PropTypes.number.isRequired,
    getNewSound: PropTypes.func.isRequired
  }

  state = {
    score: 0,
    playCount: 0,
    isWrongAnswer: false,
    isCorrectAnswer: false,
    showOverlay: false
  };

  incrementPlays() {
    let { playCount } = this.state;
    playCount++;
    this.setState({ playCount });
  }

  checkAnswer(choiceId) {
    const { sound } = this.props;

    if (choiceId !== sound.answerId) {
      this.wrongAnswer();
    }

    const { playCount } = this.state;

    const pointsAwarded = playCount
      ? Math.round(BASE_POINTS / playCount)
      : BASE_POINTS;

    this.correctAnswer(pointsAwarded);
  }

  wrongAnswer() {
    this.setState({
      showOverlay: true
    });
    this.props.getNewSound();
  }

  correctAnswer(points) {
    this.setState({
      score: this.state.score + points,
      isCorrectAnswer: true,
      showOverlay: true
    });
    this.props.getNewSound();
  }

  nextSound() {
    this.setState({
      isCorrectAnswer: false,
      showOverlay: false
    });
  }

  componentDidMount() {
    this.props.getNewSound();
  }

  render() {

    const { choices, sound } = this.props;
    const { isCorrectAnswer, showOverlay } = this.state;

    const correctChoice = choices.filter(choice => (choice.id === sound.answerId))[0];

    return (
      <div className="multi-choice">

        <span>Name the sound!</span>

        <ReactPlayer
          className="audio-player"
          url={sound.src}
          onEnded={this.incrementPlays}
        />

        <ChoiceGrid
          className="choice-grid"
          choices={choices}
          onChoiceMade={choiceId => this.checkAnswer(choiceId)}
        />

        {
          showOverlay
            ? (
              <AnswerOverlay
                className="answer-overlay"
                isCorrect={isCorrectAnswer}
                correctChoice={correctChoice}
                onContinue={() => this.setState({
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