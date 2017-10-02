import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Tabs, Tab } from 'material-ui/Tabs';
import { TextField, FlatButton } from 'material-ui';
import GridTile from '../components/GridTile';
import AudioPlayer from 'react-responsive-audio-player';

import * as style from '../style/js/createQuestion';
import Bubbles from '../style/js/animation/Bubbles';

import { RGB_GREY } from '../constants/style';

class CreateQuestion extends Component {

  state = {
    selectedTab: 1,
    text: '',
    img: '',
    soundSrc: '',
    choices: [{}, {}, {}, {}],
    answerIndex: null,
    backgroundAnimation: new Bubbles(RGB_GREY)
  };

  updateChoice = (value, prop) => {
    const { selectedTab, choices } = this.state;

    choices[selectedTab - 1][prop] = value;
    this.setState({ [prop]: value, choices });
  }

  initChoices = () => {
    const { choices } = this.state;
    for (const choice of this.state.choices) {
      choice.text = '';
      choice.img = '';
    }
    this.setState({ choices });
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

  setAnswer = isAnswer => {
    const { selectedTab, answerIndex } = this.state;
    if (isAnswer) {
      this.setState({ answerIndex: selectedTab - 1 });
    } else if (answerIndex === selectedTab - 1) {
      this.setState({ answerIndex: null });
    }
  }

  renderTabs = () => [1, 2, 3, 4].map(i => (
    <Tab
      key={i}
      className="tab"
      label={i}
      value={i}
    />
  ))

  componentDidMount() {
    this.initChoices();
    this.state.backgroundAnimation.start();
  }

  componentWillUnmount() {
    this.state.backgroundAnimation.stop();
  }

  render() {

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
                        className="text-field"
                        value={this.state.soundSrc}
                        onChange={e => this.setState({ soundSrc: e.target.value })}
                        hintText="http://audio.com/sound.mp3"
                        floatingLabelText="Sound URL"
                        inputStyle={style.textFieldStyle}
                        floatingLabelStyle={style.floatingLabelStyle}
                        underlineFocusStyle={style.underlineFocusStyle}
                        underlineStyle={style.underlineStyle}
                        hintStyle={style.hintStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="section">
                <div className="top-bar">
                  <div className="heading">Choices</div>
                  <Tabs
                    className="tabs"
                    value={this.state.selectedTab}
                    onChange={this.onTabChange}
                    children={this.renderTabs()}
                    tabItemContainerStyle={style.tabItemContainerStyle}
                    inkBarStyle={style.inkBarStyle}
                  />
                </div>

                <div className="main">
                  <div className="panel left">
                    <div className="input">
                      <TextField
                        className="text-field"
                        value={this.state.text}
                        onChange={e => this.updateChoice(e.target.value, 'text')}
                        hintText="A dog barking"
                        floatingLabelText="Choice Text"
                        inputStyle={style.textFieldStyle}
                        floatingLabelStyle={style.floatingLabelStyle}
                        underlineFocusStyle={style.underlineFocusStyle}
                        underlineStyle={style.underlineStyle}
                        hintStyle={style.hintStyle}
                      />
                    </div>

                    <div className="input">
                      <TextField
                        className="text-field"
                        value={this.state.img}
                        onChange={e => this.updateChoice(e.target.value, 'img')}
                        hintText="http://images.com/dog.jpg"
                        floatingLabelText="Choice Image URL"
                        inputStyle={style.textFieldStyle}
                        floatingLabelStyle={style.floatingLabelStyle}
                        underlineFocusStyle={style.underlineFocusStyle}
                        underlineStyle={style.underlineStyle}
                        hintStyle={style.hintStyle}
                      />
                    </div>

                    <div className="input">
                      <input
                        type="checkbox"
                        checked={this.state.answerIndex === this.state.selectedTab - 1}
                        onChange={e => this.setAnswer(e.target.checked)}
                      />
                      Is correct answer?
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
                    fullWidth={true}
                    label="Save"
                    labelStyle={style.labelStyle}
                    onClick={() => {}}
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