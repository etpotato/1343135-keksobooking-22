import './map.js';
import { sendData } from './data.js';
import { resetMap } from './map.js';
import { onSuccessSubmit, onErrorSubmit } from './form.js';

const adForm = document.querySelector('.ad-form');
const resetButton = adForm.querySelector('.ad-form__reset');

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  sendData(new FormData(evt.target), onSuccessSubmit(resetMap), onErrorSubmit);
});

resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  adForm.reset();
  resetMap();
});
