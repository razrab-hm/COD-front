import axios from "../axiosConfig";
import ENUMS from '../constants/appEnums';
import { deleteCookie } from "./cookie";
import { setCookie } from "./cookie";

const authHttpHeaders = {
    headers: {
        'Content-Type': 'application/json'
    },
  };

export const authApi = {
    authStatus: async (token) => {
        try {
            const response = await axios.get(ENUMS.API_ROUTES.AUTH_STATUS, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.status === 200 && response.data) return response.data
            ;
            throw new Error(`Response status code: ${response.status}`);
          } catch (error) {
            throw new Error(error.message);
          }
    },
    login: async (data) => {
      try {
        const response = await axios.post(ENUMS.API_ROUTES.AUTH_LOGIN,
          {
            username: data.username?.toLowerCase(),
            password: data.password?.toLowerCase(),
          },
          { ...authHttpHeaders },
        );
        if (response.status === 202 && response.data) {
          console.log(1)
          setCookie('accessToken', response.data.access_token);
          setCookie('refreshToken', response.data.refresh_token);
          return response.data
        };
        throw new Error(`Response status code: ${response.status}`);
      } catch (error) {
        if (error.response.status === 401) throw new Error("Incorrect username or password");
        if (error.response.status === 403) throw new Error("Inactive account!");
        throw new Error(error.message);
      }
    },
    register: async (data) => {
        try {
          const response = await axios.post(
            ENUMS.API_ROUTES.AUTH_REGISTER,
            {
              username: data.username?.toLowerCase(),
              email: data.email.toLowerCase(),
              password: data.password,
              first_name: data.first_name,
              last_name: data.last_name
            },
            { ...authHttpHeaders }
          );
          if (response.status === 201 && response.data) return response.data;
          throw new Error(`Response status code: ${response.status}`);
        } catch (error) {
          if (error.response.status === 406) {
            throw new Error(error.response.data.detail);
          } else {
            throw new Error(error.message);
          }
        }
      },
    logout: async (token) => {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const response = await axios.post(ENUMS.API_ROUTES.AUTH_LOGOUT);
        if (response.status === 205) {
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
          return response.data
        }
        throw new Error("User is not logged out successfully");
      } catch (error) {
        throw new Error(error.message);
      }
    },
  };