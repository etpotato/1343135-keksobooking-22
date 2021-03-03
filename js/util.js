const getIntegerFromRange = (min, max) => {

  if (min >= 0 && max >= 1 && min < max) {
    return Math.round((Math.random() * (max - min)) + min);
  }

  throw new Error ('Invalid range');
};

const getNumberFromRange = (min, max, digits) => {

  if (min >= 0 && max > min) {
    return ((Math.random() * (max - min)) + min).toFixed(digits);
  }

  throw new Error ('Invalid range');
};

const isEsc = (evt) => {
  return evt.key === ('Escape' || 'Esc');
};

export { getIntegerFromRange, getNumberFromRange, isEsc };
