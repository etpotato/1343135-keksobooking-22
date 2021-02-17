import { getSimilarPosters } from './data.js';

const mapCanvas = document.querySelector('#map-canvas');
const similarPosters = getSimilarPosters(1);

const PlaceType = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
};

const renderFeatures = (container, features) => {
  container.innerHTML = '';
  features.forEach((feature) => {
    const listItem = document.createElement('li');
    listItem.classList.add('popup__feature', `popup__feature--${feature}`);
    listItem.textContent = feature;
    container.appendChild(listItem);
  });
};

const renderImages = (container, imageSources) => {
  container.innerHTML = '';
  imageSources.forEach((imageSource) => {
    const image = document.createElement('img');
    image.src = imageSource;
    image.classList.add('popup__photo');
    image.width = '45';
    image.height = '40';
    image.alt = 'Фотография жилья';
    container.appendChild(image);
  });
};

const makeCard = (poster) => {
  const card = document.querySelector('#card').content.cloneNode(true);
  card.querySelector('.popup__title').textContent = poster.offer.title;
  card.querySelector('.popup__text--address').textContent = poster.offer.address;
  card.querySelector('.popup__text--price').innerHTML = `${poster.offer.price} ₽/ночь`;
  card.querySelector('.popup__type').textContent = PlaceType[poster.offer.type];
  card.querySelector('.popup__text--capacity').textContent = `${poster.offer.rooms} комнаты для ${poster.offer.guests} гостей`;
  card.querySelector('.popup__text--time').textContent = `Заезд после ${poster.offer.checkin}, выезд до ${poster.offer.checkout}`;
  renderFeatures(card.querySelector('.popup__features'), poster.offer.features);
  card.querySelector('.popup__description').textContent = poster.offer.description;
  renderImages(card.querySelector('.popup__photos'), poster.offer.photos);
  card.querySelector('.popup__avatar').src = poster.author.avatar;
  return card;
};

const renderCard = (container, card) => {
  container.appendChild(card);
};

renderCard(mapCanvas, makeCard(similarPosters[0]));
