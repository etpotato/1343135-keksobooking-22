const getData = (onSuccess, onError) => {
  return fetch('https://22.javascript.pages.academy/keksobooking/data')
    .then((responce) => {
      if (responce.ok) {
        return responce.json();
      }
      throw new Error(`${responce.status} ${responce.statusText}`);
    })
    .then(onSuccess)
    .catch(onError);
};

const sendData = (data, onSuccess, onError) => {
  return fetch(
    'https://echo.htmlacademy.ru/courses',
    {
      method: 'POST',
      body: data,
    })
    .then((responce) => {
      if (responce.ok) {
        return onSuccess();
      }
      throw new Error(`${responce.status} ${responce.statusText}`);
    })
    .catch(onError);
};

export { getData, sendData };
