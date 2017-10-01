import React, { Component } from 'react';
import { connect } from 'react-redux';

class CreateQuestion extends Component {

  state = {
    questionType: 'multi',
    images: [],
    choices: [],
    answer: null
  };
  
  render() {
    
    return (
      <div className="create-question">
        <div className="content">
          <canvas className="background-canvas" />
          <div className="main-container">
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, null)(CreateQuestion);