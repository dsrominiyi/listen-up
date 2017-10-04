export const required = text => {
  if (text) {
    return null;
  } else {
    return 'Field is required';
  }
};

export const notNull = value => {
  if (value !== null && typeof value !== 'undefined') {
    return null;
  } else {
    return 'Field must have a value';
  }
};

export const assetUrl = text => {
  const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  const regex = new RegExp(expression);

  if (text.match(regex)) {
    return null;
  } else {
    return 'Field must be a valid asset url';
  }
};