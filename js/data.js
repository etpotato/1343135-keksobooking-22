const getData = (url, onSuccess, onError) => {
  return fetch(url)
    .then((responce) => {
      if (responce.ok) {
        return responce.json();
      }
      throw new Error(`${responce.status} ${responce.statusText}`);
    })
    .then(json => onSuccess(json))
    .catch((error) => onError(error));
};

export { getData };
