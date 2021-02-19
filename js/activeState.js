const activateForms = () => {
  const adForm = document.querySelector('.ad-form');
  adForm.classList.remove('ad-form--disabled');
  const adFormFieldsets = adForm.querySelectorAll('fieldset');
  adFormFieldsets.forEach((fieldset) => fieldset.disabled = false);

  const filtersForm = document.querySelector('.map__filters');
  filtersForm.classList.remove('map__filters--disabled');
  const filterFormInputs = filtersForm.childNodes;
  filterFormInputs.forEach((fieldset) => fieldset.disabled = false);
};

export { activateForms };
