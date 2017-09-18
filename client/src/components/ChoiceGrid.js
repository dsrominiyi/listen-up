import React from 'react';
import PropTypes from 'prop-types';
import { GridList, GridTile } from 'material-ui/GridList';

const ChoiceGrid = ({ choices, onChoiceMade }) => {

  return (
    <div className="choice-grid">
      <GridList cellHeight={200}>
        {
          choices.map(choice => (
            <GridTile
              className="tile hover-bw"
              key={choice.id}
              title={choice.text}
              titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
              onClick={() => onChoiceMade(choice.id)}
            >
              <img className="tile-img" src={choice.img} />
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
