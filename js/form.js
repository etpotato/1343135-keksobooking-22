import { isEsc } from './util.js';

const adForm = document.querySelector('.ad-form');

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

const onSuccessSubmit = (cb) => {
  openSuccessPopup();
  adForm.reset();
  cb();
};

const onErrorSubmit = () => {
  openErrorPopup();
};

export { onSuccessSubmit, onErrorSubmit };