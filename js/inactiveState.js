const inactivateForms = () => {
  const adForm = document.querySelector('.ad-form');
  adForm.classList.add('ad-form--disabled');
  const adFormFieldsets = adForm.querySelectorAll('fieldset');
  adFormFieldsets.forEach((fieldset) => fieldset.disabled = true);

  const filtersForm = document.querySelector('.map__filters');
  filtersForm.classList.add('map__filters--disabled');
  const filterFormInputs = filtersForm.childNodes;
  filterFormInputs.forEach((fieldset) => fieldset.disabled = true);
};

export { inactivateForms };
