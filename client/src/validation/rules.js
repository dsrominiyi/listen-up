export const required = text => {
  if (text) {
    return null;
  } else {
    return 'Field is required';
  }
};

export const assetUrl = text => {
  const expression = /[-a-z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b\/[-a-z0-9@:%_\+.~#?&//=]+/gi;
  const regex = new RegExp(expression);

  if (text.match(regex)) {
    return null;
  } else {
    return 'Field must be a valid asset url';
  }
};

export const answerIndex = value => {
  if (value !== null && typeof value !== 'undefined') {
    return null;
  } else {
    return 'You must select one of the choices as the correct answer';
  }
};
