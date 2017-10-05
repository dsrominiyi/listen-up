import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Tabs, Tab } from 'material-ui/Tabs';
import { TextField, FlatButton } from 'material-ui';
import GridTile from '../components/GridTile';
import AudioPlayer from 'react-responsive-audio-player';

import { validate, ruleRunner } from '../validation/validate';
import { required, assetUrl, answerIndex } from '../validation/rules';

import * as Style from '../style/js/createQuestion';
import Bubbles from '../style/js/animation/Bubbles';

import { RGB_GREY } from '../constants/style';

const choiceValidations = [
  ruleRunner('img', assetUrl),
  ruleRunner('text', required),
  ruleRunner('img', required)
];

const otherValidations = [
  ruleRunner('soundSrc', assetUrl),
  ruleRunner('soundSrc', required),
  ruleRunner('answerIndex', answerIndex)
];

class CreateQuestion extends Component {

  state = {
    selectedTab: 1,
    text: '',
    img: '',
    soundSrc: '',
    choices: [{},{},{},{}].map(() => ({ text: '', img: '' })),
    answerIndex: null,
    formValid: false,
    showErrors: false,
    validationErrors: { choicesArray: [], other: {} },
    backgroundAnimation: new Bubbles(RGB_GREY)
  };

  updateChoice = (value, field) => {
    const { selectedTab, choices } = this.state;

    if (field === 'text') {
      // remove non-alphanumeric chars
      value = value.replace(/[^a-zA-Z\d\s:]/g, '');
    }

    choices[selectedTab - 1][field] = value;
    this.onFormUpdated({ [field]: value, choices });
  }

  setAnswer = isAnswer => {
    const { selectedTab, answerIndex } = this.state;
    if (isAnswer) {
      this.onFormUpdated({ answerIndex: selectedTab - 1 });
    } else if (answerIndex === selectedTab - 1) {
      this.onFormUpdated({ answerIndex: null });
    }
  }

  hasErrors = (errors) => Object.keys(errors).length > 0

  onFormUpdated = newValues => {
    let newState = {
      ...this.state,
      ...newValues
    };

    let formValid = true;
    const validationErrors = {
      choicesArray: validate(newState.choices, choiceValidations),
      other: validate(newState, otherValidations)
    };

    const hasInvalidChoice = () => validationErrors.choicesArray
      .some(choiceErrors => this.hasErrors(choiceErrors));
    const hasInvalidOther = () => this.hasErrors(validationErrors.other);

    formValid = !hasInvalidChoice() && !hasInvalidOther();

    newState = {
      ...newState,
      validationErrors,
      formValid
    };

    this.setState(newState);
  }

  errorFor = (field) => {
    const { showErrors, selectedTab, validationErrors } = this.state;

    if (!showErrors) {
      return '';
    }

    if (field === 'text' || field === 'img') {
      const choiceErrors = validationErrors.choicesArray[selectedTab-1];
      return choiceErrors[field];
    }

    return validationErrors.other[field];
  } 

  onTabChange = tab => {
    const { choices } = this.state;
    const selectedChoice = choices[tab - 1];
    this.setState({
      text: selectedChoice.text,
      img: selectedChoice.img,
      selectedTab: tab
    });
  }

  renderTabs = () => [1, 2, 3, 4].map(i => {
    const { showErrors, validationErrors } = this.state;
    const choiceErrors = validationErrors.choicesArray[i-1];
    const errors = showErrors && this.hasErrors(choiceErrors);
    
    return (
      <Tab
        key={i}
        className={`tab ${ errors ? 'error' : '' }`}
        label={i}
        value={i}
      />
    );
  })

  componentDidMount() {
    this.state.backgroundAnimation.start();

    this.setState({ 
      validationErrors: {
        choicesArray: validate(this.state.choices, choiceValidations),
        other: validate(this.state, otherValidations)
      } 
    });
  }

  componentWillUnmount() {
    this.state.backgroundAnimation.stop();
  }

  render() {   
    const selectAnswerError = this.errorFor('answerIndex'); 

    return (
      <div className="create-question">
        <div className="content">
          <canvas className="background-canvas" />
          <div className="main-container">
            <div className="creation-wizard">

              <div className="header">
                Create a Multiple Choice Question
              </div>

              <div className="section">
                <div className="top-bar">
                  <div className="heading">Sound</div>
                  <div className="player-div">
                    <AudioPlayer
                      className="audio-player"
                      hideBackSkip={true}
                      hideForwardSkip={true}
                      disableSeek={true}
                      cycle={false}
                      playlist={[{
                        url: this.state.soundSrc
                      }]}
                      audioElementRef={ref => this.audioPlayer = ref}
                    />
                  </div>
                </div>
                <div className="main">
                  <div className="panel left">
                    <div className="input">
                      <TextField
                        id="soundSrc"
                        className="text-field"
                        value={this.state.soundSrc}
                        onChange={e => this.onFormUpdated({ soundSrc: e.target.value })}
                        hintText="http://audio.com/sound.mp3"
                        floatingLabelText="Sound URL"
                        errorText={this.errorFor('soundSrc')}
                        inputStyle={Style.textFieldStyle}
                        floatingLabelStyle={Style.floatingLabelStyle}
                        underlineFocusStyle={Style.underlineFocusStyle}
                        underlineStyle={Style.underlineStyle}
                        hintStyle={Style.hintStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="section">
                {
                  selectAnswerError
                    ? <span className="error">{selectAnswerError}</span>
                    : ''
                }
                <div className="top-bar">
                  <div className="heading">Choices</div>
                  <Tabs
                    className="tabs"
                    value={this.state.selectedTab}
                    onChange={this.onTabChange}
                    children={this.renderTabs()}
                    tabItemContainerStyle={Style.tabItemContainerStyle}
                    inkBarStyle={Style.inkBarStyle}
                  />
                </div>

                <div className="main">
                  <div className="panel left">
                    <div className="input">
                      <TextField
                        id="text"
                        className="text-field"
                        value={this.state.text}
                        onChange={e => this.updateChoice(e.target.value, 'text')}
                        hintText="A dog barking"
                        floatingLabelText="Choice Text"
                        errorText={this.errorFor('text')}
                        inputStyle={Style.textFieldStyle}
                        floatingLabelStyle={Style.floatingLabelStyle}
                        underlineFocusStyle={Style.underlineFocusStyle}
                        underlineStyle={Style.underlineStyle}
                        hintStyle={Style.hintStyle}
                      />
                    </div>

                    <div className="input">
                      <TextField
                        id="img"
                        className="text-field"
                        value={this.state.img}
                        onChange={e => this.updateChoice(e.target.value, 'img')}
                        hintText="http://images.com/dog.jpg"
                        floatingLabelText="Choice Image URL"
                        errorText={this.errorFor('img')}
                        inputStyle={Style.textFieldStyle}
                        floatingLabelStyle={Style.floatingLabelStyle}
                        underlineFocusStyle={Style.underlineFocusStyle}
                        underlineStyle={Style.underlineStyle}
                        hintStyle={Style.hintStyle}
                      />
                    </div>

                    <div className="input">
                      <input
                        type="checkbox"
                        checked={this.state.answerIndex === this.state.selectedTab - 1}
                        onChange={e => this.setAnswer(e.target.checked)}
                      />
                      Is correct answer
                    </div>
                  </div>

                  <div className="panel preview">
                    <div className="tile-preview">
                      <GridTile
                        className="tile"
                        text={this.state.text}
                        img={this.state.img || '/app/images/placeholder.jpg'}
                        onClick={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="footer">
                <div className="button">
                  <FlatButton
                    fullWidth={true}
                    label="Save"
                    labelStyle={Style.labelStyle(!this.state.formValid, this.state.showErrors)}
                    onClick={() => this.setState({ showErrors: true })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, null)(CreateQuestion);