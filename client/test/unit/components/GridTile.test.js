import React from 'react';
import 'enzyme/mount';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import GridTile from '../../../src/components/GridTile';

describe('<GridTile />', () => {

  let component;
  let text;
  let img;
  let style;
  let onClick;

  beforeEach(() => {
    
    text = 'tile text';
    img = 'images/img1.png';
    style = { margin: 'auto' };
    onClick = sinon.spy();

    component = shallow(
      <GridTile 
        text={text}
        img={img}
        style={style}
        onClick={onClick}
      />
    );
  });

  it('should display the text', () => {

    const tileText = component.find('.tile-text');
    expect(tileText.props().children).to.contain(text);
  });

  it('should display the img', () => {
    
    const tileImg = component.find('.tile-img');
    expect(tileImg.type()).to.equal('img');
    expect(tileImg.props().src).to.equal(img);
  });

  it('should apply the style prop', () => {
    
    expect(component.props().style).to.equal(style);
  });

  it('should call onClick when clicked', () => {
    
    component.simulate('click');
    expect(onClick).to.have.been.called;
  });
});