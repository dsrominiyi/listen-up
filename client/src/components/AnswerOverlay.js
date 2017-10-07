import React from 'react';
import PropTypes from 'prop-types';

const AnswerOverlay = ({ isCorrect, correctChoice, onContinue }) => {

  const name = 'answer-overlay';

  return (
    <div
      key={name}
      className={`${isCorrect ? 'correct' : 'wrong'} ${name}`}
      onClick={onContinue}
    >
      <span className={`msg ${isCorrect ? 'correct' : 'wrong'} answer`}>
        {isCorrect ? 'Correct!' : ' Wrong!'}<br />
        The answer is {correctChoice.text}
      </span>

      <div className="img-div">
        <img className="answer-img hvr-pulse-grow-active" src={correctChoice.img} />
      </div>

      <span className="msg continue">
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