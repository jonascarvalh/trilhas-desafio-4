const api = axios.create({
  baseURL: "http://api.qedu.org.br/v1/"
});

api.interceptors.request.use(config => {
  const token = "lRfFiFKnlrJIVdYPu0EoZVDQExhjsmocH7vivcpH";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;