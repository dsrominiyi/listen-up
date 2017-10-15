import React from 'react';
import '../../../node_modules/enzyme/mount';
import { shallowWithStore } from 'enzyme-redux';
import { createMockStore } from 'redux-test-utils';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

const bubbles = {
  start: sinon.spy(),
  stop: sinon.spy()
};

const validate = sinon.stub();
const ruleRunner = sinon.spy();

const rules = {
  required: () => { },
  assetUrl: () => { },
  answerIndex: () => { }
};

const ApiClient = function () { return { get: () => { } }; };
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

    it('should render inputs for the fields', () => {

      for (const field of fields) {
        const input = component.find(`#${field}`);

        expect(input.length).to.equal(1);
      }
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

      [1, 2, 3, 4].forEach(selectedTab => {
        component.setState({ selectedTab });
        checkBox.props().onChange(e);

        expect(component.state().answerIndex).to.equal(selectedTab - 1);
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

    it('should not display validation errors until the user has attempted to submit', () => {
      
      component.instance().componentDidMount();
      expect(component.state().showErrors).to.equal(false);

      const saveButton = component.find('#save');
      saveButton.simulate('click');

      expect(component.state().showErrors).to.equal(true);
    });
  });

  describe('unmounting', () => {

    it('should stop the background animation before unmounting', () => {

      component.instance().componentWillUnmount();
      expect(bubbles.stop).to.have.been.called;
    });
  });
});