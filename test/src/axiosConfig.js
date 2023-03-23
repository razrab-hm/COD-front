import axios from "axios";
import ENUMS from './constants/appEnums';
import { setCookie, getCookie, deleteCookie } from "./utils//cookie";
const { REACT_APP_API_URL } = process.env

const instance = axios.create({
  baseURL:  REACT_APP_API_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function axiosResponseInterceptor() {
  const interceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
          // Reject promise if usual error
          if (error.response.status !== 422) {
              return Promise.reject(error);
          }
          /*
           * When response code is 422, try to refresh the token.
           * Eject the interceptor so it doesn't loop in case
           * token refresh causes the 422 response.
           *
           * Must be re-attached later on or the token refresh will only happen once
           */
          instance.interceptors.response.eject(interceptor);
          instance.defaults.headers.common['Authorization'] = `Bearer ${getCookie("refreshToken")}`
          return instance
              .post(ENUMS.API_ROUTES.REFRESH_TOKEN)
              .then((response) => {
                  setCookie("accessToken", response.data.access_token);
                  setCookie("refreshToken", response.data.refresh_token);
                  error.response.config.headers["Authorization"] =
                      "Bearer " + response.data.access_token;
                  // Retry the initial call, but with the updated token in the headers. 
                  // Resolves the promise if successful
                  return axios(error.response.config);
              })
              .catch((error2) => {
                  // Retry failed, clean up and reject the promise
                  deleteCookie("accessToken");
                  deleteCookie("refreshToken");
                  this.router.push("/login");
                  return Promise.reject(error2);
              })
              .finally(axiosResponseInterceptor); // Re-attach the interceptor by running the method
      }
  );
}
axiosResponseInterceptor();



export default instance;


// /api/users/add_company
// {
// "company_id": 0,
// "user_id": 0
// }

// /api/users/remove_company
// {
// "company_id": 0,
// "user_id": 0
// }