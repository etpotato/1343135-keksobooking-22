function getIntegerFromRange(min, max) {

  if (min >= 0 && max >= 1 && min < max) {
    return Math.round((Math.random() * (max - min)) + min);
  }

  return 'Задан неверный диапазон';
}

getIntegerFromRange(1, 10);

function getNumberFromRange(min, max, digits) {

  if (min >= 0 && max > min) {
    return ((Math.random() * (max - min)) + min).toFixed(digits);
  }

  return 'Задан неверный диапазон';
}

getNumberFromRange(1, 10, 3);
