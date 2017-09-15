import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ReactPlayer from 'react-player';
import ChoiceGrid from '../components/ChoiceGrid';
import AnswerOverlay from '../components/AnswerOverlay';

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
    this.props.getNewQuestion();
  }

  correctAnswer(points) {
    this.setState({
      score: this.state.score + points,
      isCorrectAnswer: true,
      showOverlay: true
    });
    this.props.getNewQuestion();
  }

  nextSound() {
    this.setState({
      isCorrectAnswer: false,
      showOverlay: false
    });
  }

  componentDidMount() {
    this.props.getNewQuestion();
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