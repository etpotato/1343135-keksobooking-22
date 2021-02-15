import { getSimilarPosters } from './data.js';

const template = document.querySelector('#card').content;
const fragment = document.createDocumentFragment();
const mapCanvas = document.querySelector('#map-canvas');
const similarPosters = getSimilarPosters(10);
const getOfferType = (type) => {
  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'bungalow':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    default:
      return 'Не установлено';
  }
};

const removeEmptyElement = (element) => {
  if (!element.childNodes.length) {
    element.remove();
  }
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

similarPosters.forEach((poster) => {
  const card = template.cloneNode(true);
  card.querySelector('.popup__title').textContent = poster.offer.title;
  card.querySelector('.popup__text--address').textContent = poster.offer.address;
  card.querySelector('.popup__text--price').innerHTML = `${poster.offer.price} ₽/ночь`;
  card.querySelector('.popup__type').textContent = getOfferType(poster.offer.type);
  card.querySelector('.popup__text--capacity').textContent = `${poster.offer.rooms} комнаты для ${poster.offer.guests} гостей`;
  card.querySelector('.popup__text--time').textContent = `Заезд после ${poster.offer.checkin}, выезд до ${poster.offer.checkout}`;
  poster.offer.features.forEach((feature) => {
    card.querySelectorAll('.popup__feature').forEach((listItem) => {
      if (listItem.className.includes(feature)) {
        listItem.textContent = feature;
      }
    });
  });
  card.querySelectorAll('.popup__feature').forEach((element) => removeEmptyElement(element));
  card.querySelector('.popup__description').textContent = poster.offer.description;
  renderImages(card.querySelector('.popup__photos'), poster.offer.photos);
  card.querySelector('.popup__avatar').src = poster.author.avatar;
  fragment.appendChild(card);
});

mapCanvas.appendChild(fragment.querySelector(':first-child'));
