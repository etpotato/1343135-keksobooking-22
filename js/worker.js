onmessage = (evt) => {
  const reader = new FileReader();

  let i = 0;

  reader.addEventListener('load', () => {
    postMessage(reader.result);

    if (i === evt.data.length - 1) {
      return;
    }

    i++;
    reader.readAsDataURL(evt.data[i]);
  });

  reader.readAsDataURL(evt.data[i]);
};
