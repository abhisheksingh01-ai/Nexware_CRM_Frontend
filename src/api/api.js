// src/api/api.js

const BaseUrl = import.meta.env.VITE_SERVER_API;

const api = {
  Auth: {
    Login: BaseUrl + "auth/login",
    Register: BaseUrl + "auth/register-secret",
  },
  User: {
    Create: BaseUrl + "users",             
    GetAll: BaseUrl + "users",             
    Update: (id) => `${BaseUrl}users/${id}`, 
    UpdateStatus: BaseUrl + "users/status", 
    Delete: (id) => `${BaseUrl}users/${id}`, 
  },
  // Example placeholder for other modules
  // Leads: {
  //   GetAll: BaseUrl + "leads",
  //   Create: BaseUrl + "leads",
  //   Update: (id) => `${BaseUrl}leads/${id}`,
  //   Delete: (id) => `${BaseUrl}leads/${id}`,
  // },
};

export default api;
