import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Tabs, Tab} from 'material-ui/Tabs';

import * as style from '../style/js/createQuestion';
import Bubbles from '../style/js/animation/Bubbles';

import { RGB_GREY } from '../constants/style';

class CreateQuestion extends Component {

  state = {
    selectedTab: 1,
    images: [],
    choices: [],
    answer: null,
    backgroundAnimation: new Bubbles(RGB_GREY)
  };

  renderTabs = () => [1,2,3,4].map(i => (
    <Tab 
      key={i}
      className="tab" 
      label={i} 
      value={i} 
    />
  ))

  componentDidMount() {
    this.state.backgroundAnimation.start();
  }

  componentWillUnmount() {
    this.state.backgroundAnimation.stop();
  }
  
  render() {

    const { tabItemContainerStyle, inkBarStyle } = style;
    
    return (
      <div className="create-question">
        <div className="content">
          <canvas className="background-canvas" />
          <div className="main-container">
            <div className="creation-wizard">
              <div className="top-bar">
                <div className="heading">Questions</div>
                <Tabs
                  className="tabs"
                  tabItemContainerStyle={tabItemContainerStyle}
                  inkBarStyle={inkBarStyle}
                  value={this.state.selectedTab}
                  onChange={tab => this.setState({ selectedTab: tab })}
                  children={this.renderTabs()}
                />
              </div>
              <div className="main">
              </div>
              

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, null)(CreateQuestion);