import { isEsc } from './util.js';
import { resetMap } from './map.js';
import { sendData } from './data.js';

const adForm = document.querySelector('.ad-form');
const housingTypeInput = adForm.querySelector('#type');
const priceInput = adForm.querySelector('#price');
const timeInInput = adForm.querySelector('#timein');
const timeOutInput = adForm.querySelector('#timeout');
const roomNumberInput = adForm.querySelector('#room_number');
const capacityInput = adForm.querySelector('#capacity');
const resetButton = adForm.querySelector('.ad-form__reset');

const HousingTypePrice = {
  palace: 10000,
  flat: 1000,
  house: 5000,
  bungalow: 0,
};

const onHousingTypeChange = () => {
  const minPrice = HousingTypePrice[housingTypeInput.value];
  priceInput.placeholder = minPrice;
  priceInput.min = minPrice;
};

housingTypeInput.addEventListener('change', () => onHousingTypeChange());

const onTimeInChange = () => {
  const time = timeInInput.value;
  timeOutInput.value = time;
};

const onTimeOutChange = () => {
  const time = timeOutInput.value;
  timeInInput.value = time;
};

timeInInput.addEventListener('change', () => onTimeInChange());
timeOutInput.addEventListener('change', () => onTimeOutChange());

const onRoomNumberChange = () => {
  const roomNumber = Number.parseInt(roomNumberInput.value);
  const capasityOptions = capacityInput.querySelectorAll('option');

  if (roomNumber === 100) {
    capasityOptions.forEach((capacityOption) => {
      const capacityValue = Number.parseInt(capacityOption.value);

      if (capacityValue === 0) {
        capacityOption.disabled = false;
        return capacityOption.selected = true;
      }

      capacityOption.disabled = true;
    });
  } else {
    capasityOptions.forEach((capacityOption) => {
      const capacityValue = Number.parseInt(capacityOption.value);

      if (capacityValue > roomNumber || capacityValue === 0) {
        return capacityOption.disabled = true;
      }

      capacityOption.disabled = false;

      if (capacityValue === roomNumber) {
        capacityOption.selected = true;
      }
    });
  }
};

roomNumberInput.addEventListener('change', () => onRoomNumberChange());

const onEscSuccessPopup = (evt) => {
  if (isEsc(evt)) {
    evt.preventDefault();
    closeSuccessPopup();
  }
};

const onEscErrorPopup = (evt) => {
  if (isEsc(evt)) {
    evt.preventDefault();
    closeErrorPopup();
  }
};

const onWindowErrorPopup = (evt) => {
  if (!evt.target.matches('.error > *')) {
    closeErrorPopup();
  }
};

const onCloseButtonErrorPopup = (evt) => {
  evt.preventDefault();
  closeErrorPopup();
};

const openSuccessPopup = () => {
  const successPopup = document
    .querySelector('#success')
    .content
    .querySelector('.success')
    .cloneNode(true);

  document.addEventListener('keydown', onEscSuccessPopup);
  document.addEventListener('click', closeSuccessPopup);
  document.querySelector('main').append(successPopup);
};

const closeSuccessPopup = () => {
  const successPopup = document.querySelector('.success');

  document.removeEventListener('keydown', onEscSuccessPopup);
  document.removeEventListener('click', closeSuccessPopup);
  successPopup.remove();
};

const openErrorPopup = () => {
  const errorPopup = document
    .querySelector('#error')
    .content
    .querySelector('.error')
    .cloneNode(true);
  const errorCloseButton = errorPopup.querySelector('.error__button');

  errorCloseButton.addEventListener('click', onCloseButtonErrorPopup);
  document.addEventListener('keydown', onEscErrorPopup);
  document.addEventListener('click', onWindowErrorPopup);
  document.querySelector('main').append(errorPopup);
};

const closeErrorPopup = () => {
  const errorPopup = document.querySelector('.error');
  const errorCloseButton = errorPopup.querySelector('.error__button');

  errorCloseButton.removeEventListener('click', onCloseButtonErrorPopup);
  document.removeEventListener('keydown', onEscErrorPopup);
  document.removeEventListener('click', onWindowErrorPopup);
  errorPopup.remove();
};

const onSuccessSubmit = () => {
  openSuccessPopup();
  adForm.reset();
  resetMap();
};

const onErrorSubmit = () => {
  openErrorPopup();
};

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  if (adForm.reportValidity()) {
    sendData(new FormData(evt.target), onSuccessSubmit, onErrorSubmit);
  }
});

resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  adForm.reset();
  resetMap();
});
