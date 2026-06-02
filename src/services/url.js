import axios from "axios";

const API_URL = "https://api-orcamento-production.up.railway.app";

const httpsInstance = () => {
  const httpsAuthenticated = axios.create({
    baseURL: API_URL,
  });

  httpsAuthenticated.interceptors.request.use(
    (config) => {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const { token } = JSON.parse(storedUser);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  httpsAuthenticated.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // Excluir os cookies de autenticação
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        // Limpar sessionStorage
        sessionStorage.clear();

        // Só redireciona se já não estiver no login
        if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return httpsAuthenticated;
};

export default httpsInstance;
