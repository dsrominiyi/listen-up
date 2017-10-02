import React from 'react';
import PropTypes from 'prop-types';
import GridTile from './GridTile';

const renderTiles = ({ choices, onChoiceMade }) => {
  const tiles = [];
  let style;
  let marginRight = true;
  for (const choice of choices) {
    style = marginRight ? { marginRight: '2px' } : { marginLeft: '2px' };
    marginRight = !marginRight;
    tiles.push(
      <GridTile
        className="tile"
        key={choice.id}
        text={choice.text}
        img={choice.img}
        style={style}
        onClick={() => onChoiceMade(choice.id)}
      />
    );
  }
  return tiles;
};

const ChoiceGrid = (props) => (
  <div className="choice-grid">
    { renderTiles(props) }
  </div>
);

ChoiceGrid.propTypes = {
  choices: PropTypes.array.isRequired,
  onChoiceMade: PropTypes.func.isRequired
};

export default ChoiceGrid;
