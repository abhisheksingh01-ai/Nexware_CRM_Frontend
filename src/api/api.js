const BaseUrl = import.meta.env.VITE_SERVER_API;

const api = {
  Auth: {
    Login: BaseUrl + "auth/login",
    Register: BaseUrl + "auth/register-secret",
    AdminCheckLastLogin: BaseUrl + "auth/lastlogin",
  },
  User: {
    GetOwnProfile: BaseUrl + "users/me",
    AdminCreate: BaseUrl + "users",
    AdminGetAll: BaseUrl + "users",
    AdminUpdate: BaseUrl + "users/adminUpdate",
    UpdateOwnProfile: BaseUrl + "users/update",
    AdminUpdateStatus: BaseUrl + "users/status",
    AdminUpdateAnyUserPassword: BaseUrl + "users/password",
    AdminDelete: BaseUrl + "users/delete",
  },
  Leads: {
    Create: BaseUrl + "leads/",
    GetAll: BaseUrl + "leads/leads-list",
    GetDetails: (leadId) => `${BaseUrl}leads/lead-details?leadId=${leadId}`,
    Update: BaseUrl + "leads/updateLead",
    AdminDelete: BaseUrl + "leads/deleteLead",
  },
  Product: {
    AdminCreate: BaseUrl + "product/adminCreate",
    GetAll: BaseUrl + "product/getAll",
    GetOne: BaseUrl + "product/getOne",
    AdminUpdate: BaseUrl + "product/adminUpdate",
    AdminDelete: BaseUrl + "product/adminDelete",
  }
};

export default api;
