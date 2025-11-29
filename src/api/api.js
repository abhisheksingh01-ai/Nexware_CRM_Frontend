const BaseUrl = import.meta.env.VITE_SERVER_API;

const api = {
  Auth: {
    Login: BaseUrl + "auth/login",
    Register: BaseUrl + "auth/register-secret",
  },
  User: {
    Update: BaseUrl + "users/update",
  },
};

export default api;
