import { getIntegerFromRange, getNumberFromRange } from './util.js';

const POSTERS_NUMBER = 10;
const AVATAR_NUMBERS = new Array(8).fill(null)
  .map((avatarNumber, index) => avatarNumber = `0${index + 1}`);

const MAX_PRICE = 200;
const TYPES = ['palace', 'flat', 'house', 'bungalow'];
const MAX_ROOM = 8;
const MAX_GUEST = 12;
const CHECK_TIMES = ['12:00', '13:00', '14:00'];
const FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
const PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
];
const LOCATION_X_MIN = 35.65000;
const LOCATION_X_MAX = 35.70000;
const LOCATION_Y_MIN = 139.70000;
const LOCATION_Y_MAX = 139.80000;
const LOCATION_DIGITS = 5;

const getRandomArrayElement = (array) => array[getIntegerFromRange(0, array.length - 1)];

const getRandomArray = (parentArray) => {
  const randomArray = new Array(getIntegerFromRange(1, parentArray.length))
    .fill('')
    .reduce((accumulator, currentValue, index) => {
      currentValue = getRandomArrayElement(parentArray);

      while (accumulator.some(addedValue => addedValue === currentValue)) {
        currentValue = getRandomArrayElement(parentArray);
      }

      accumulator[index] = currentValue;
      return accumulator;
    }, []);
  return randomArray;
};

const createPoster = () => {
  const locationX = getNumberFromRange(LOCATION_X_MIN, LOCATION_X_MAX, LOCATION_DIGITS);
  const locationY = getNumberFromRange(LOCATION_Y_MIN, LOCATION_Y_MAX, LOCATION_DIGITS);

  return {
    author: {
      avatar: `img/avatars/user${getRandomArrayElement(AVATAR_NUMBERS)}.png`,
    },
    offer: {
      title: 'Appartments for rent',
      address: `${locationX}, ${locationY}`,
      price: getIntegerFromRange(0, MAX_PRICE),
      type: getRandomArrayElement(TYPES),
      rooms: getIntegerFromRange(0, MAX_ROOM),
      guests: getIntegerFromRange(0, MAX_GUEST),
      checkin: getRandomArrayElement(CHECK_TIMES),
      checkout: getRandomArrayElement(CHECK_TIMES),
      features: getRandomArray(FEATURES),
      description: 'Some fancy description',
      photos: getRandomArray(PHOTOS),
    },
    location: {
      x: locationX,
      y: locationY,
    },
  }
};

const getSimilarPosters = (postersNumber) => {
  return new Array(postersNumber).fill(null).map(() => createPoster())
};
const data = getSimilarPosters(POSTERS_NUMBER);
export { data };
