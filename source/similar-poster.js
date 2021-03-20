const placeType = {
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
  const card = document.querySelector('#card').content.querySelector('.popup').cloneNode(true);
  card.querySelector('.popup__title').textContent = poster.offer.title;
  card.querySelector('.popup__text--address').textContent = poster.offer.address;
  card.querySelector('.popup__text--price').textContent = `${poster.offer.price} ₽/ночь`;
  card.querySelector('.popup__type').textContent = placeType[poster.offer.type];
  card.querySelector('.popup__text--capacity').textContent = `${poster.offer.rooms} комнаты для ${poster.offer.guests} гостей`;
  card.querySelector('.popup__text--time').textContent = `Заезд после ${poster.offer.checkin}, выезд до ${poster.offer.checkout}`;
  renderFeatures(card.querySelector('.popup__features'), poster.offer.features);
  card.querySelector('.popup__description').textContent = poster.offer.description;
  renderImages(card.querySelector('.popup__photos'), poster.offer.photos);
  card.querySelector('.popup__avatar').src = poster.author.avatar;
  card.querySelectorAll('*').forEach((item) => {
    if (item.children.lenght === 0) {
      item.remove();
    }
  });

  return card;
};

export { makeCard };
