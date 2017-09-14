import React from 'react';
import PropTypes from 'prop-types';

const AnswerOverlay = ({ isCorrect, correctChoice, onContinue }) => {

  return (
    <div 
      className="answer-overlay"
      onClick={onContinue}
    >
      <span className={`${isCorrect ? 'correct' : 'wrong'}-answer-msg`}>
        { isCorrect ? 'Correct!' : ' Wrong!' }
        The answer is { correctChoice.text }
      </span>

      <img className="correct-choice-img" src={correctChoice.img} />

      <span className="continue-msg">
        Click to continue
      </span>
    </div>
  );
};

AnswerOverlay.propTypes = {
  isCorrect: PropTypes.bool.isRequired,
  correctChoice: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired
};

export default AnswerOverlay;