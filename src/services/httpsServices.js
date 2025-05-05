import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  timeout: 50000,
  headers: {},
});

instance.interceptors.request.use(function (config) {
  // Retrieve both tokens from localStorage
  const authToken = localStorage.getItem("authToken");
  const token = localStorage.getItem("token");

  // Add whichever token is available to the Authorization header
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  } else if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

const responseBody = (response) => response.data;

const requests = {
  patch: (url, body) => instance.patch(url, body).then(responseBody),
  post: (url, body) => instance.post(url, body).then(responseBody),
  delete: (url, body) => instance.delete(url, body).then(responseBody),
  get: (url, body) => instance.get(url, body).then(responseBody),
};

export default requests;
