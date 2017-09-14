import React from 'react';
import PropTypes from 'prop-types';
import { GridList, GridTile } from 'material-ui/GridList';

const ChoiceGrid = ({ choices, onChoiceMade }) => {

  return (
    <div>
      <GridList
        className="choice-grid-list"
        cellHeight={180}
      >
        {
          choices.map(choice => (
            <GridTile
              className="choice-grid-tile"
              key={choice.id}
              title={choice.text}
              onClick={() => onChoiceMade(choice.id)}
            >
              <img className="choice-img" src={choice.img} />
            </GridTile>
          ))
        }
      </GridList>
    </div>
  );
};

ChoiceGrid.propTypes = {
  choices: PropTypes.array.isRequired,
  onChoiceMade: PropTypes.func.isRequired
};

export default ChoiceGrid;
