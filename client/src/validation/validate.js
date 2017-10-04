export const ruleRunner = (field, ...validations) => {
  return (state) => {
    for (const v of validations) {
      const errorMessage = v(state[field], state);
      if (errorMessage) {
        return { [field]: errorMessage };
      }
    }
    return null;
  };
};

export const validate = (state, runners) => {

  const getErrors = _state => runners.reduce((errors, runner) => ({
    ...errors,
    ...runner(_state)
  }), {});

  if (Array.isArray(state)) {
    return state.map(item => getErrors(item));
  }

  return getErrors(state);
};