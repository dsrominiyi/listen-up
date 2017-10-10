import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ type, message, onDismiss }) => {

  setTimeout(onDismiss, 5000);

  return (
    <div 
      className="notification"
      onClick={onDismiss}
    >
      <div className={`message ${type}`}>
        { message }
      </div>
    </div>
  );
};

Notification.propTypes = {
  type: PropTypes.string.isRequired, // 'success' || 'error'
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired
};

export default Notification;
