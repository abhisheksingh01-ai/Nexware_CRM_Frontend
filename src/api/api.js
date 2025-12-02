const BaseUrl = import.meta.env.VITE_SERVER_API;

const api = {
  Auth: {
    Login: BaseUrl + "auth/login",
    Register: BaseUrl + "auth/register-secret",
    AdminCheckLastLogin: BaseUrl + "auth/lastlogin"
  },
  User: {
    GetOwnProfile: BaseUrl + "users/me",
    AdminCreate: BaseUrl + "users",
    AdminGetAll: BaseUrl + "users",
    AdminUpdate: BaseUrl + "users/adminUpdate",
    UpdateOwnProfile: BaseUrl + "users/update",
    AdminUpdateStatus: BaseUrl + "users/status",
    AdminUpdateAnyUserPassword : BaseUrl + "users/password",
    AdminDelete: BaseUrl + "users/delete",
  },
};

export default api;
