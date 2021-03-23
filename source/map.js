/* eslint-disable no-undef */
import _ from 'lodash';
import { makeCard } from './similar-poster.js';
import { getData } from './data.js';

const DEFAULT_COORDINATES = {lat: 35.6762, lng: 139.6503};
const FLOATING_POINT_DIGITS = 5;
const NUMBER_OF_POSTERS = 10;
const ERROR_MESSAGE_TIMEOUT = 5000;
const DEBOUNCE_DELAY = 500;
const HousingPrice = {
  LOW_TO_MIDDLE_PRICE: 10000,
  MIDDLE_TO_HIGH_PRICE: 50000,
};

const adForm = document.querySelector('.ad-form');
const addressInput = adForm.querySelector('#address');
const filtersForm = document.querySelector('.map__filters');
const filterFormInputs = filtersForm.childNodes;
const typeFilter = filtersForm.querySelector('#housing-type');
const priceFilter = filtersForm.querySelector('#housing-price');
const roomsFilter = filtersForm.querySelector('#housing-rooms');
const guestsFilter = filtersForm.querySelector('#housing-guests');
const featuresFieldset = filtersForm.querySelector('#housing-features');
const checkedInputs = Array.from(featuresFieldset.querySelectorAll('.map__checkbox'));
const mapElem = document.querySelector('#map-canvas');

const inactivateFilters = () => {
  filtersForm.classList.add('map__filters--disabled');
  filterFormInputs.forEach((fieldset) => fieldset.disabled = true);
};

inactivateFilters();

const activateFilters = () => {
  filtersForm.classList.remove('map__filters--disabled');
  filterFormInputs.forEach((fieldset) => fieldset.disabled = false);
};

const formatCoordinates = (coordinates) => {
  return `${coordinates.lat.toFixed(FLOATING_POINT_DIGITS)}, ${coordinates.lng.toFixed(FLOATING_POINT_DIGITS)}`
};

const nativePosters = [];

const activeMarkers = [];

const renderMarkersOnLoad = (data) => {
  return new Promise((resolve) => {
    nativePosters.push(...data);
    renderOrdinaryMarkers(data);
    resolve();
  }).then(() => {
    activateFilters();
    addressInput.value = formatCoordinates(DEFAULT_COORDINATES);
    addressInput.readOnly = true;
    mapElem.style.zIndex = 0;
  });
};

const onMapLoad = () => {
  getData(renderMarkersOnLoad, showError);
  tileLayer.removeEventListener('load', onMapLoad);
};

const map = L.map(mapElem)
  .setView(
    DEFAULT_COORDINATES,
    10,
  );

const tileLayer = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addEventListener('load', onMapLoad)
  .addTo(map);

L.control.scale().addTo(map);

const mainPin = L.icon({
  iconUrl: 'img/main-pin.svg',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
});

const mainMarker = L.marker(DEFAULT_COORDINATES, {
  icon: mainPin,
  draggable: true,
})
  .addTo(map)
  .addEventListener('drag', () => {
    addressInput.value = formatCoordinates(mainMarker.getLatLng());
  });

const ordinaryPin = L.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [42, 42],
  iconAnchor: [21, 42],
});

const renderOrdinaryMarker = (poster) => {
  const popupContent = makeCard(poster);
  const marker = L.marker({lat: poster.location.lat, lng: poster.location.lng}, {
    icon: ordinaryPin,
  }).bindPopup(popupContent, {
    keepInView: true,
    offset: L.point(0, -15),
  }).openPopup();

  return marker;
};

const renderOrdinaryMarkers = (data) => {
  data.slice(0, NUMBER_OF_POSTERS).forEach((poster) => {
    activeMarkers.push(renderOrdinaryMarker(poster));
  });
  activeMarkers.forEach((item) => item.addTo(map));
};

const showError = () => {
  const popup = document.createElement('div');
  popup.textContent = 'Ошибка загрузки объявлений! Попробуйте обновить страницу.';
  popup.style.zIndex = 100;
  popup.style.position = 'fixed';
  popup.style.bottom = 0;
  popup.style.left = 0;
  popup.style.right = 0;
  popup.style.padding = '20px';
  popup.style.fontSize = '20px';
  popup.style.fontWeight = 'bold';
  popup.style.textAlign = 'center';
  popup.style.backgroundColor = 'tomato';
  document.body.append(popup);

  setTimeout(() => popup.remove(), ERROR_MESSAGE_TIMEOUT);
};

const removeMarkers = () => {
  activeMarkers.forEach((marker) => marker.remove());
  activeMarkers.splice(0, activeMarkers.length);
};

const resetMap = () => {
  mainMarker.setLatLng(DEFAULT_COORDINATES);
  addressInput.value = formatCoordinates(mainMarker.getLatLng());
};

const filterType = (poster) => {
  const typeValue = typeFilter.value;

  return (typeValue === 'any') ?
    true :
    poster.offer.type === typeValue;
};

const filterPrice = (poster) => {
  const priceValue = priceFilter.value;

  const isCorrectPrice = {
    low: poster.offer.price <= HousingPrice['LOW_TO_MIDDLE_PRICE'],
    middle: poster.offer.price >= HousingPrice['LOW_TO_MIDDLE_PRICE'] &&
      poster.offer.price <= HousingPrice['MIDDLE_TO_HIGH_PRICE'],
    high: poster.offer.price >= HousingPrice['MIDDLE_TO_HIGH_PRICE'],
    any: true,
  };

  return isCorrectPrice[priceValue];
};

const filterRooms = (poster) => {
  const roomsValue = roomsFilter.value;

  return (roomsValue === 'any') ?
    true :
    poster.offer.rooms === Number.parseInt(roomsValue);
};

const filterGuests = (poster) => {
  const guestsValue = guestsFilter.value;
  const guestsNumber = Number.parseInt(guestsValue);

  if (guestsValue === 'any') {
    return true;
  } else if (guestsNumber === 0) {
    return poster.offer.guests === 0;
  } else {
    return poster.offer.guests >= guestsNumber;
  }
};

const filterFeatures = (poster) => {
  const chosenFeatures = checkedInputs.reduce((accumulator, input) => {
    if (input.checked) {
      accumulator.push(input.value);
    }
    return accumulator;
  }, []);
  const posterFeatures = poster.offer.features;

  if (chosenFeatures.length === 0) {
    return true;
  }

  const areFeaturesIncluded = chosenFeatures.map((feature) => {
    return posterFeatures.includes(feature);
  });

  return areFeaturesIncluded.every((answer) => answer === true);
};

const filterPosters = (data) => {
  removeMarkers();

  const filteredData = data.filter((poster) => {
    return filterType(poster) &&
      filterPrice(poster) &&
      filterRooms(poster) &&
      filterGuests(poster) &&
      filterFeatures(poster);
  });

  renderOrdinaryMarkers(filteredData);
};

const onFilterChange = (evt) => {
  evt.preventDefault();
  filterPosters(nativePosters);
};

filtersForm.addEventListener('change', _.debounce(onFilterChange , DEBOUNCE_DELAY));

export { resetMap };
