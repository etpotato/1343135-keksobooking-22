/* eslint-disable no-undef */
import { inactivateForms } from './inactiveState.js';
import { activateForms } from './activeState.js';
import { data } from './data.js';
import { makeCard } from './similar-poster.js';

const DEFAULT_COORDINATES = {lat: 35.6762, lng: 139.6503};
const FLOATING_POINT_DIGITS = 5;

inactivateForms();

const mapElem = document.createElement('div');
mapElem.style.height = '100%';
mapElem.id = 'map';
document.querySelector('#map-canvas').prepend(mapElem);

const formatCoordinates = (coordinates) => {
  return `${coordinates.lat.toFixed(FLOATING_POINT_DIGITS)}, ${coordinates.lng.toFixed(FLOATING_POINT_DIGITS)}`
};

const map = L.map('map')
  .addEventListener('load', () => activateForms())
  .setView(
    DEFAULT_COORDINATES,
    12,
  );

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);
L.control.scale().addTo(map);

const mainPin = L.icon({
  iconUrl: '../img/main-pin.svg',
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

const addressInput = document.querySelector('#address');
addressInput.value = formatCoordinates(DEFAULT_COORDINATES);
addressInput.readOnly = true;

const ordinaryPin = L.icon({
  iconUrl: '../img/pin.svg',
  iconSize: [42, 42],
  iconAnchor: [21, 42],
});

const renderOrdinaryMarker = (poster) => {
  const popupContent = makeCard(poster);
  L.marker({lat: poster.location.x, lng: poster.location.y}, {
    icon: ordinaryPin,
  }).bindPopup(popupContent, {
    keepInView: true,
    offset: L.point(0, -15),
  }).openPopup()
    .addTo(map);
};

const renderOrdinaryMarkers = (data) => {
  data.forEach((poster) => {
    renderOrdinaryMarker(poster);
  });
};

renderOrdinaryMarkers(data);
