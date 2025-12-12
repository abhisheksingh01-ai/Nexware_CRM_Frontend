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
    AdminCreate: BaseUrl + "products/adminCreate",
    GetAll: BaseUrl + "products/getAll",
    GetOne: BaseUrl + "products/getOne",
    AdminUpdate: BaseUrl + "products/adminUpdate",
    AdminDelete: BaseUrl + "products/adminDelete",
  },
  Order: {
  Create: BaseUrl + "orders/",
  GetAll: BaseUrl + "orders/orders-list",
  GetOne: BaseUrl + "orders/order-details",          
  Update: BaseUrl + "orders/updateOrder",    
  Delete: BaseUrl + "orders/deleteOrder",     
}

};

export default api;
