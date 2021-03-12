/* eslint-disable no-undef */
import { isEsc } from './util.js';
import { resetMap } from './map.js';
import { sendData } from './data.js';

const MAX_PHOTO_SIZE = 2000000;

const adForm = document.querySelector('.ad-form');
const titleInput = adForm.querySelector('#title');
const housingTypeInput = adForm.querySelector('#type');
const priceInput = adForm.querySelector('#price');
const timeInInput = adForm.querySelector('#timein');
const timeOutInput = adForm.querySelector('#timeout');
const roomNumberInput = adForm.querySelector('#room_number');
const capacityInput = adForm.querySelector('#capacity');
const avatarInput = adForm.querySelector('#avatar');
const avatarDropZone = adForm.querySelector('#avatar ~ .ad-form-header__drop-zone');
const avatarPreview = adForm.querySelector('.ad-form-header__preview img');
const photoInput = adForm.querySelector('#images');
const photoDropZone = adForm.querySelector('.ad-form__drop-zone');
const photoContainer = adForm.querySelector('.ad-form__photo-container');
const resetButton = adForm.querySelector('.ad-form__reset');

// логика полей формы

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

// Загрузка изображений

const onAvatarChange = () => {
  const avatarImage = avatarInput.files[0];

  validateAvatar();

  if (!avatarImage.type.startsWith('image/') || avatarImage.size > MAX_PHOTO_SIZE) {
    return;
  }

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    avatarPreview.style.objectFit = 'cover';
    avatarPreview.src = reader.result;
  });

  reader.readAsDataURL(avatarImage);
};

avatarInput.addEventListener('change', onAvatarChange);


const onPhotoChange = () => {
  const photoPreview = adForm.querySelector('.ad-form__photo');
  const photoImages = Object.values(photoInput.files);

  validatePhoto();

  const isImage = photoImages.every((item) => item.type.startsWith('image/'));
  // const isSuitableSize = photoImages.every((item) => item.size <= MAX_PHOTO_SIZE);
  // || !isSuitableSize
  if (!isImage) {
    return;
  }

  if (photoPreview.children.length === 0) {
    photoPreview.remove();
  }

  // const reader = new FileReader();

  // let i = 0;

  // reader.addEventListener('load', () => {

  //   if (i === photoImages.length - 1) {
  //     console.log('all falies have been red');
  //     return;
  //   }
  //   const divElem = document.createElement('div');
  //   divElem.classList.add('ad-form__photo');
  //   const imageElem = document.createElement('img');
  //   imageElem.width = '70';
  //   imageElem.height = '70';
  //   imageElem.style.objectFit = 'cover';
  //   imageElem.src = reader.result;
  //   divElem.append(imageElem);
  //   photoContainer.append(divElem);

  //   i++;
  //   reader.readAsDataURL(photoImages[i]);
  // });

  // reader.readAsDataURL(photoImages[i]);

  const worker = new Worker('js/worker.js', {
    type: 'module',
  })

  worker.postMessage(photoImages);

  worker.onmessage = (evt) => {
    const divElem = document.createElement('div');
    divElem.classList.add('ad-form__photo');
    const imageElem = document.createElement('img');
    imageElem.width = '70';
    imageElem.height = '70';
    imageElem.style.objectFit = 'cover';
    imageElem.src = evt.data;
    divElem.append(imageElem);
    photoContainer.append(divElem);
  };
};

photoInput.addEventListener('change', onPhotoChange);

const resetAvatarPreview = () => {
  avatarPreview.src = "img/muffin-grey.svg";
};

const resetPhotoPreview = () => {
  const photos = Array.from(document.querySelectorAll('.ad-form__photo'));
  photos.forEach((photo) => photo.remove());
  const divElem = document.createElement('div');
  divElem.classList.add('ad-form__photo');
  photoContainer.append(divElem);
};

// валидация формы

const VALIDATION_DELAY = 1000;

const setInvalidStyle = (element) => {
  return element.style.backgroundColor = 'salmon';
};

const resetInvalidStyle = (element) => {
  return element.removeAttribute('style');
};

const validateAvatar = () => {
  const avatarImage = avatarInput.files[0];

  if (!avatarImage.type.startsWith('image/')) {
    avatarInput.setCustomValidity('Пожалуйста, выберите изображение.');
    setInvalidStyle(avatarDropZone);
  } else if (avatarImage.size > MAX_PHOTO_SIZE) {
    avatarInput.setCustomValidity('Размер изображения не должен превышать 2MB.');
    setInvalidStyle(avatarDropZone);
  } else {
    avatarInput.setCustomValidity('');
    resetInvalidStyle(avatarDropZone);
  }
  avatarInput.reportValidity();
};

const validatePhoto = () => {
  const photoImages = Object.values(photoInput.files);

  if (photoImages.length === 0) {
    photoInput.setCustomValidity('');
    resetInvalidStyle(photoDropZone);
    return;
  }

  const isImage = photoImages.every((item) => item.type.startsWith('image/'));
  // const isSuitableSize = photoImages.every((item) => item.size <= MAX_PHOTO_SIZE);

  if (!isImage) {
    photoInput.setCustomValidity('Пожалуйста, выберите изображения.');
    setInvalidStyle(photoDropZone);
    setTimeout(() => {
      resetInvalidStyle(photoDropZone);
      photoInput.setCustomValidity('');
      photoInput.value = '';
      resetPhotoPreview();
    }, 3000);
  // } else if (!isSuitableSize) {
  //   photoInput.setCustomValidity('Размер изображения не должен превышать 2MB.');
  //   setInvalidStyle(photoDropZone);
  //   setTimeout(() => {
  //     resetInvalidStyle(photoDropZone);
  //     photoInput.setCustomValidity('');
  //     photoInput.value = '';
  //     resetPhotoPreview();
  //   }, 3000);
  }
  photoInput.reportValidity();
};

const validateTitle = () => {
  const valueLength = titleInput.value.length;
  const minLength = Number.parseInt(titleInput.minLength);
  const maxLength = Number.parseInt(titleInput.maxLength);

  if (titleInput.validity.tooShort) {
    titleInput.setCustomValidity(`Введите ещё ${minLength - valueLength} симв.`);
    setInvalidStyle(titleInput);
  } else if (titleInput.validity.tooLong) {
    titleInput.setCustomValidity(`Удалите ${valueLength - maxLength} симв.`);
    setInvalidStyle(titleInput);
  } else {
    titleInput.setCustomValidity('');
    resetInvalidStyle(titleInput);
  }

  titleInput.reportValidity();
};

titleInput.addEventListener('input', _.debounce(validateTitle, VALIDATION_DELAY));

const validatePrice = () => {
  const minValue = priceInput.min;
  const maxValue = priceInput.max;

  if (priceInput.validity.rangeUnderflow) {
    priceInput.setCustomValidity(`Минимальная цена - ${minValue} руб.`);
    setInvalidStyle(priceInput);
  } else if (priceInput.validity.rangeOverflow) {
    priceInput.setCustomValidity(`Максимальная цена - ${maxValue} руб.`);
    setInvalidStyle(priceInput);
  } else {
    resetInvalidStyle(priceInput);
    priceInput.setCustomValidity('');
  }

  priceInput.reportValidity();
};

priceInput.addEventListener('input', _.debounce(validatePrice, VALIDATION_DELAY));

// отправка формы

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
  resetAvatarPreview();
  resetPhotoPreview();
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
  resetAvatarPreview();
  resetPhotoPreview();
});
