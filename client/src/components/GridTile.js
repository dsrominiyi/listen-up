import React from 'react';
import PropTypes from 'prop-types';

const GridTile = ({ text, img, style, onClick }) => {

  return (
    <div 
      className="grid-tile hvr-buzz-out" 
      style={style}
      onClick={onClick}
    >
      <img className="tile-img" src={img} /> 
      <div className="tile-text">
        { text }
      </div>
    </div>
  );
};

GridTile.propTypes = {
  text: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object
};

export default GridTile;
