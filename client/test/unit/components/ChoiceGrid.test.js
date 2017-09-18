import React from 'react';
import '../../../node_modules/enzyme/mount';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import ChoiceGrid from '../../../src/components/ChoiceGrid';

describe('<ChoiceGrid />', () => {

  let component;
  let choices;
  let onChoiceMade;

  beforeEach(() => {
    
    choices = [];
    for (let i=1; i<=4; i++) {
      choices.push({
        id: i,
        text: `choice ${i}`,
        img: `/images/${i}.jpg`
      });
    }

    onChoiceMade = sinon.spy();

    component = shallow(
      <ChoiceGrid 
        choices={choices} 
        onChoiceMade={onChoiceMade} 
      />
    );
  });

  it('should contain a tile for each choice', () => {

    const tiles = component.find('.tile');
    expect(tiles).to.have.length(choices.length);
  });

  it('should populate each tile with the correct data', () => {
    
    const tiles = component.find('.tile');

    for (let i=0; i<choices.length; i++) {
      const tile = tiles.get(i);
      const img = tile.props.children;

      expect(+tile.key).to.equal(choices[i].id);
      expect(tile.props.title).to.equal(choices[i].text);

      expect(img.type).to.equal('img');
      expect(img.props.src).to.equal(choices[i].img);
    }
  });

  it('should call onChoiceMade with the choice id when a tile is clicked', () => {
    
    const tiles = component.find('.tile');

    for (let i=0; i<choices.length; i++) {
      const tile = tiles.get(i);
      
      tile.props.onClick();
      expect(onChoiceMade).to.have.been.calledWith(choices[i].id);
    }
  });

});