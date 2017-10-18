import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Tabs, Tab } from 'material-ui/Tabs';
import { TextField, FlatButton } from 'material-ui';
import GridTile from '../components/GridTile';
import Notification from '../components/Notification';
import AudioPlayer from 'react-responsive-audio-player';

import { validate, ruleRunner } from '../validation/validate';
import { required, assetUrl, answerIndex } from '../validation/rules';

import * as Style from '../style/js/createMulti';
import Bubbles from '../style/js/animation/Bubbles';

import ApiClient from '../services/ApiClient';

import * as multiChoiceActions from '../actions/multiChoiceActions';

import { BASE_URL, STATUS_SUCCESS, STATUS_ERROR } from '../constants/common';
import { RGB_GREY } from '../constants/style';

class CreateMulti extends Component {

  static propTypes = {
    createMulti: PropTypes.func.isRequired,
    saveResponse: PropTypes.object
  }

  initFields = {
    selectedTab: 1,
    description: '',
    text: '', // selected choice 
    img: '', // "
    soundSrc: '',
    choices: [{}, {}, {}, {}].map(() => ({ text: '', img: '' })),
    answerIndex: null,
    formValid: false,
    showErrors: false,
    validationErrors: { choicesArray: [], other: {} }
  };

  state = {
    ...this.initFields,
    notification: false,
    backgroundAnimation: new Bubbles(RGB_GREY)
  };

  choiceValidations = [
    ruleRunner('img', assetUrl),
    ruleRunner('text', required),
    ruleRunner('img', required)
  ];

  otherValidations = [
    ruleRunner('soundSrc', assetUrl),
    ruleRunner('soundSrc', required),
    ruleRunner('answerIndex', answerIndex)
  ];

  updateChoice = (value, field) => {
    const { selectedTab, choices } = this.state;

    if (field === 'text') {
      // remove non-alphanumeric chars
      value = value.replace(/[^a-z\d\s:]/gi, '');
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

    const validationErrors = {
      choicesArray: validate(newState.choices, this.choiceValidations),
      other: validate(newState, this.otherValidations)
    };

    const hasInvalidChoice = () => validationErrors.choicesArray
      .some(choiceErrors => this.hasErrors(choiceErrors));
    const hasInvalidOther = () => this.hasErrors(validationErrors.other);

    const formValid = !hasInvalidChoice() && !hasInvalidOther();

    newState = {
      ...newState,
      validationErrors,
      formValid
    };

    this.setState(newState);
  }

  onSubmit = () => {
    const { formValid, showErrors } = this.state;

    if (!formValid && !showErrors) {
      this.setState({ showErrors: true });
    }

    if (formValid) {
      const { description, choices, soundSrc, answerIndex } = this.state;
      const newQuestion = {
        description,
        choices,
        soundSrc,
        answerIndex
      };
      this.props.createMulti(newQuestion);
    }
  }

  errorFor = (field) => {
    const { showErrors, selectedTab, validationErrors } = this.state;

    if (!showErrors) {
      return '';
    }

    if (field === 'text' || field === 'img') {
      const choiceErrors = validationErrors.choicesArray[selectedTab - 1];
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
    const choiceErrors = validationErrors.choicesArray[i - 1];
    const errors = showErrors && this.hasErrors(choiceErrors);

    return (
      <Tab
        key={i}
        className={`tab ${errors ? 'error' : ''}`}
        label={i}
        value={i}
      />
    );
  })

  componentDidMount() {
    this.state.backgroundAnimation.start();

    this.setState({
      validationErrors: {
        choicesArray: validate(this.state.choices, this.choiceValidations),
        other: validate(this.state, this.otherValidations)
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { saveResponse } = nextProps;

    if (saveResponse) {
      const newState = saveResponse.success
        ? { ...this.initFields, notification: true }
        : { notification: true };

      this.setState(newState);
    }
  }

  componentWillUnmount() {
    this.state.backgroundAnimation.stop();
  }

  render() {
    const selectAnswerError = this.errorFor('answerIndex');
    const { saveResponse } = this.props;
    const textFieldStyles = {
      inputStyle: Style.textFieldStyle,
      floatingLabelStyle: Style.floatingLabelStyle,
      underlineFocusStyle: Style.underlineFocusStyle,
      underlineStyle: Style.underlineStyle,
      hintStyle: Style.hintStyle
    };

    return (
      <div className="create-multi">
        <div className="content">
          <canvas className="background-canvas" />
          <ReactCSSTransitionGroup
            transitionName="notification"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
          >
            {
              this.state.notification
                ? (
                  <Notification
                    className="notification"
                    type={saveResponse.success ? STATUS_SUCCESS : STATUS_ERROR}
                    message={saveResponse.success ? 'Question created' : 'Error'}
                    onDismiss={() => this.setState({ notification: false })}
                  />
                )
                : ''
            }
          </ReactCSSTransitionGroup>

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
                        url: this.state.soundSrc,
                        displayText: this.state.description || 'Name the sound!'
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
                        { ...textFieldStyles }
                      />
                    </div>
                  </div>
                  <div className="panel right">
                    <div className="input">
                      <TextField
                        id="description"
                        className="text-field"
                        value={this.state.description}
                        onChange={e => this.onFormUpdated({ description: e.target.value })}
                        hintText="Name the sound!"
                        floatingLabelText="Description"
                        errorText={this.errorFor('description')}
                        { ...textFieldStyles }
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
                        { ...textFieldStyles }
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
                        { ...textFieldStyles }
                      />
                    </div>

                    <div className="input">
                      <input
                        id="answerIndex"
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
                        onClick={() => { }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="footer">
                <div className="button">
                  <FlatButton
                    id="save"
                    fullWidth={true}
                    label="Save"
                    labelStyle={Style.labelStyle(!this.state.formValid, this.state.showErrors)}
                    onClick={this.onSubmit}
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

const api = new ApiClient(BASE_URL);

const mapStateToProps = ({ createMulti }) => {
  return {
    saveResponse: createMulti.saveResponse
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createMulti: newQuestion => dispatch(multiChoiceActions.createMulti(api, newQuestion))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateMulti);