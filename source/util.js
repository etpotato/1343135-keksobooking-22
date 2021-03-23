const escKeyValues = ['Escape', 'Esc'];

const isEsc = (evt) => {
  return escKeyValues.some((code) => evt.key === code);
};

export { isEsc };
