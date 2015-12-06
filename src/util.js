export function handleResponse(response) {
  if (response.status === 200)
    return response.json();
  return response.text()
    .then(text => Promise.reject(new Error(`${response.status} ${response.statusText}: ${text}`)));
}
