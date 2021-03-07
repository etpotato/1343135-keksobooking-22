/* eslint-disable no-undef */
import { makeCard } from './similar-poster.js';
import { getData } from './data.js';

const DEFAULT_COORDINATES = {lat: 35.6762, lng: 139.6503};
const FLOATING_POINT_DIGITS = 5;
const NUMBER_OF_POSTERS = 10;

const adForm = document.querySelector('.ad-form');
const adFormFieldsets = adForm.querySelectorAll('fieldset');
const addressInput = adForm.querySelector('#address');
const filtersForm = document.querySelector('.map__filters');
const filterFormInputs = filtersForm.childNodes;
const mapElem = document.querySelector('#map-canvas');

const inactivateForms = () => {
  adForm.classList.add('ad-form--disabled');
  adFormFieldsets.forEach((fieldset) => fieldset.disabled = true);

  filtersForm.classList.add('map__filters--disabled');
  filterFormInputs.forEach((fieldset) => fieldset.disabled = true);
};
inactivateForms();

const activateForms = () => {
  adForm.classList.remove('ad-form--disabled');
  adFormFieldsets.forEach((fieldset) => fieldset.disabled = false);

  filtersForm.classList.remove('map__filters--disabled');
  filterFormInputs.forEach((fieldset) => fieldset.disabled = false);
};

const formatCoordinates = (coordinates) => {
  return `${coordinates.lat.toFixed(FLOATING_POINT_DIGITS)}, ${coordinates.lng.toFixed(FLOATING_POINT_DIGITS)}`
};

const map = L.map(mapElem)
  .addEventListener('load', () => setTimeout(() => {
    activateForms();
    addressInput.value = formatCoordinates(DEFAULT_COORDINATES);
    addressInput.readOnly = true;
    mapElem.style.zIndex = 0;
    getData(renderOrdinaryMarkers, showError);
  }, 0))
  .setView(
    DEFAULT_COORDINATES,
    10,
  );

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

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
  L.marker({lat: poster.location.lat, lng: poster.location.lng}, {
    icon: ordinaryPin,
  }).bindPopup(popupContent, {
    keepInView: true,
    offset: L.point(0, -15),
  }).openPopup()
    .addTo(map);
};

const renderOrdinaryMarkers = (data) => {
  data.slice(0, NUMBER_OF_POSTERS).forEach((poster) => {
    renderOrdinaryMarker(poster);
  });
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

  setTimeout(() => popup.remove(), 5000);
};

const resetMap = () => {
  mainMarker.setLatLng(DEFAULT_COORDINATES);
  addressInput.value = formatCoordinates(mainMarker.getLatLng());
};

export { resetMap };
