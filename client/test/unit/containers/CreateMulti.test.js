import React from 'react';
import '../../../node_modules/enzyme/mount';
import { shallowWithStore } from 'enzyme-redux';
import { createMockStore } from 'redux-test-utils';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

import * as multiChoiceActions from '../../../src/actions/multiChoiceActions';

import { STATUS_SUCCESS, STATUS_ERROR } from '../../../src/constants/common';

const bubbles = {
  start: sinon.spy(),
  stop: sinon.spy()
};

const validate = sinon.stub();
const ruleRunner = sinon.spy();

const rules = {
  required: () => {},
  assetUrl: () => {},
  answerIndex: () => {}
};

const ApiClient = function () { return { post: () => { } }; };
const Bubbles = function () { return bubbles; };

proxyquire.noCallThru();

const module = proxyquire(
  '../../../src/containers/CreateMulti',
  {
    '../validation/validate': { validate, ruleRunner },
    '../validation/rules': rules,
    '../services/ApiClient': ApiClient,
    '../style/js/animation/Bubbles': Bubbles
  }
);
const CreateMulti = module.default;

describe('<CreateMulti />', () => {

  let component;
  let store;
  let api;
  let saveResponse;
  let fields;

  const initialise = () => {
    const state = {
      createMulti: { saveResponse }
    };

    store = createMockStore(state);
    component = shallowWithStore(<CreateMulti />, store).dive();
  };

  beforeEach(() => {

    saveResponse = null;

    bubbles.start.reset();
    bubbles.stop.reset();

    validate.resetHistory();
    ruleRunner.reset();

    validate.withArgs(sinon.match.array, sinon.match.array).returns([
      {},{},{},{}
    ]);
    validate.withArgs(sinon.match.object, sinon.match.array).returns({});

    api = new ApiClient();

    fields = ['soundSrc', 'description', 'text', 'img', 'answerIndex'];

    initialise();
  });

  describe('mounting', () => {

    it('should define the field validations', () => {

      expect(ruleRunner).to.have.been.calledWith('img', rules.assetUrl);
      expect(ruleRunner).to.have.been.calledWith('text', rules.required);
      expect(ruleRunner).to.have.been.calledWith('img', rules.required);

      expect(ruleRunner).to.have.been.calledWith('soundSrc', rules.assetUrl);
      expect(ruleRunner).to.have.been.calledWith('soundSrc', rules.required);
      expect(ruleRunner).to.have.been.calledWith('answerIndex', rules.answerIndex);
    });


    it('should perform initial form validation when the component has mounted', () => {

      const { choiceValidations } = component.instance();
      const { otherValidations } = component.instance();
      component.instance().componentDidMount();

      expect(validate).to.have.been.calledWith(sinon.match.array, choiceValidations);
      expect(validate).to.have.been.calledWith(sinon.match.object, otherValidations);
    });

    it('should start the background animation when the component has mounted', () => {

      component.instance().componentDidMount();
      expect(bubbles.start).to.have.been.called;
    });
  });

  describe('render', () => {

    it('should render inputs for the fields', () => {
      
      for (const field of fields) {
        const input = component.find(`#${field}`);

        expect(input.length).to.equal(1);
      }
    });

    it('should render the audio player', () => {
      
      const audioPlayer = component.find('.audio-player');
      expect(audioPlayer.length).to.equal(1);
    });

    it('should render the tabs', () => {
      
      const tabs = component.find('.tab');
      expect(tabs.length).to.equal(4);
    });

    it('should render the preview tile', () => {
      
      const previewTile = component.find('.tile');
      expect(previewTile.length).to.equal(1);
    });

    it('should render the save button', () => {
      
      const saveButton = component.find('#save');
      expect(saveButton.length).to.equal(1);
    });
  });


  describe('form updates', () => {

    it('should update state with the values of the fields', () => {

      const value = 'new value';
      const e = { target: { value } };

      for (const field of fields) {
        if (field === 'answerIndex') {
          continue;
        }
        const input = component.find(`#${field}`);
        input.props().onChange(e);

        expect(component.state()[field]).to.equal(value);
      }
    });

    it('should update the answerIndex based on the selected tab', () => {

      const e = { target: { checked: true } };
      const checkBox = component.find('#answerIndex');

      [1, 2, 3, 4].forEach(tabNumber => {
        component.instance().onTabChange(tabNumber);
        checkBox.props().onChange(e);

        expect(component.state().answerIndex).to.equal(tabNumber - 1);
      });
    });

    it('should clear the answerIndex if the checkbox is unchecked', () => {

      const e = { target: { checked: false } };
      const checkBox = component.find('#answerIndex');
      const answerIndex = 2;

      component.setState({ answerIndex, selectedTab: answerIndex + 1 });
      checkBox.props().onChange(e);

      expect(component.state().answerIndex).to.equal(null);
    });

    it('should re-validate the form when fields are updated', () => {

      const { choiceValidations } = component.instance();
      const { otherValidations } = component.instance();
      const e = { target: { value: '', checked: true } };

      for (const field of fields) {
        validate.resetHistory();

        const input = component.find(`#${field}`);
        input.props().onChange(e);

        expect(validate).to.have.been.calledWith(sinon.match.array, choiceValidations);
        expect(validate).to.have.been.calledWith(sinon.match.object, otherValidations);
      }
    });

    it('should map soundSrc to the audio player url', () => {
      
      const e = { target: { value: 'audio.url' } };

      const soundSrc = component.find('#soundSrc');
      soundSrc.props().onChange(e);

      const audioPlayer = component.find('.audio-player');
      const audioPlayerUrl = audioPlayer.props().playlist[0].url;
      expect(audioPlayerUrl).to.equal(e.target.value);
    });

    it('should map description to the audio player displayText', () => {
      
      const e = { target: { value: 'description' } };

      const description = component.find('#description');
      description.props().onChange(e);

      const audioPlayer = component.find('.audio-player');
      const audioPlayerText = audioPlayer.props().playlist[0].displayText;
      expect(audioPlayerText).to.equal(e.target.value);
    });

    it('should map text and img to one of the choices based on selectedTab', () => {

      let text = component.find('#text');
      let img = component.find('#img');

      for (let selectedTab=1; selectedTab<=4; selectedTab++) {
        component.instance().onTabChange(selectedTab);

        const textValue = 'choice text'+selectedTab;
        const imageValue = 'image.url'+selectedTab;
        text.props().onChange({ target: { value: textValue } });
        img.props().onChange({ target: { value: imageValue } });

        const selectedChoice = component.state().choices[selectedTab-1];
        expect(selectedChoice.text).to.equal(textValue);
        expect(selectedChoice.img).to.equal(imageValue);
      }

      const choices = [
        { text: 'text1', img: 'img1'}, { text: 'text2', img: 'img2'}, 
        { text: 'text4', img: 'img4'}, { text: 'text4', img: 'img4'} 
      ];

      component.setState({ choices });

      for (let selectedTab=1; selectedTab<=4; selectedTab++) {
        component.instance().onTabChange(selectedTab);
        text = component.find('#text');
        img = component.find('#img');

        expect(text.props().value).to.equal(choices[selectedTab-1].text);
        expect(img.props().value).to.equal(choices[selectedTab-1].img);
      }
    });

    it('should map text and img to the preview tile props', () => {
      
      const text = component.find('#text');
      const img = component.find('#img');

      const textValue = 'choice text';
      const imageValue = 'image.url';
      text.props().onChange({ target: { value: textValue } });
      img.props().onChange({ target: { value: imageValue } });

      const previewTile = component.find('.tile');
      expect(previewTile.props().text).to.equal(textValue);
      expect(previewTile.props().img).to.equal(imageValue);
    });
  });

  describe('form submission', () => {

    beforeEach(() => { 
      component.instance().componentDidMount(); // needed to populate validationErrors.choicesArray
    });
    
    it('should not display validation errors until the user has attempted to submit', () => {
      
      expect(component.state().showErrors).to.equal(false);

      const saveButton = component.find('#save');
      saveButton.simulate('click');

      expect(component.state().showErrors).to.equal(true);
    });

    it('should not attempt to save if the form is not valid', () => {
      
      expect(component.state().formValid).to.equal(false);

      const saveButton = component.find('#save');
      saveButton.simulate('click');

      expect(store.getActions().length).to.equal(0);
    });

    it('should save the question if the form is valid', () => {
      
      const newQuestion = {
        description: 'description',
        soundSrc: 'sound.url',
        answerIndex: 3,
        choices: [
          { text: 'text1', img: 'img1'}, { text: 'text2', img: 'img2'}, 
          { text: 'text4', img: 'img4'}, { text: 'text4', img: 'img4'} 
        ]
      };

      component.setState({ ...newQuestion, formValid: true });

      const saveButton = component.find('#save');
      saveButton.simulate('click');

      const expectedAction = multiChoiceActions.createMulti(api, newQuestion);
      expect(store.getActions().length).to.equal(1);
      expect(store.isActionDispatched(expectedAction)).to.equal(true);
    });
  });

  describe('save response', () => {

    let state;

    beforeEach(() => {
  
      state = {
        selectedTab: 1,
        description: 'description',
        text: 'text1', 
        img: 'img1',
        soundSrc: 'sound.url',
        answerIndex: 3,
        choices: [
          { text: 'text1', img: 'img1'}, { text: 'text2', img: 'img2'}, 
          { text: 'text4', img: 'img4'}, { text: 'text4', img: 'img4'} 
        ],
        formValid: true,
        showErrors: true,
        notification: false,
        validationErrors: { choicesArray: [{},{},{},{}], other: {} },
        backgroundAnimation: bubbles
      };

      component.setState(state);
    });

    it('should set notification to true when a save response is received', () => {
      
      const saveResponse = {};
      component.setProps({ saveResponse });

      expect(component.state().notification).to.equal(true);
    });

    it('should re-initialise the fields when a success response is received', () => {
      
      const saveResponse = { success: true };
      component.setProps({ saveResponse });

      expect(component.state()).to.deep.equal({
        ...component.instance().initFields,
        notification: true,
        backgroundAnimation: bubbles
      });
    });

    it('should not re-initialise the fields when a non successful response is received', () => {
      
      const saveResponse = {};
      component.setProps({ saveResponse });

      expect(component.state()).to.deep.equal({ ...state, notification: true });
    });
  });

  describe('notification', () => {

    it('should render a success notification when a success response is received', () => {
      
      const saveResponse = { success: true };
      component.setProps({ saveResponse });

      const notification = component.find('.notification');
      expect(notification.props().type).to.equal(STATUS_SUCCESS);
    });

    it('should render an error notification when a non successful response is received', () => {
      
      const saveResponse = {};
      component.setProps({ saveResponse });

      const notification = component.find('.notification');
      expect(notification.props().type).to.equal(STATUS_ERROR);
    });

    it('should set notification to false when the notifications onDismiss prop is called', () => {
      
      const saveResponse = {};
      component.setProps({ saveResponse });

      const notification = component.find('.notification');
      notification.props().onDismiss();
      expect(component.state().notification).to.equal(false);
    });
  });

  describe('unmounting', () => {

    it('should stop the background animation before unmounting', () => {

      component.instance().componentWillUnmount();
      expect(bubbles.stop).to.have.been.called;
    });
  });
});