import axios from "../axiosConfig";
import { getCookie } from "./cookie";


export const adminApi = {
    updateUserInfo: async (data, url) => {
      let newRole = null;
      if(data.superadmin) {
        newRole = 'root';
      } else if (data.admin){
        newRole = "admin"
      } else {
        newRole = "manager"
      }
        try {
          const response = await axios.put(url,
            {
              username: data.username,
              password: data.password,
              id: data.id,
              email: data.email,
              role: newRole ? newRole : data.role,
              companies_id: data.companies_id,
              user_id: data.user_id,
              inactive: !data.active,
              first_name: data.first_name,
              last_name: data.last_name
            },
            {  headers: {
              'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${getCookie('accessToken')}`
          }, },
          );
          if (response.status === 200 && response.data) return response.data;
          throw new Error(`Response status code: ${response.status}`);
        } catch (error) {
            if (error.response.status === 409) {
                throw new Error(error.response.data.detail);
              } else {
                throw new Error(error.response.data.detail);
              }
        }
      },
      createCompany: async (data, url) => {
        try {
          const response = await axios.post(url,
            {
              title: data.title,
              contact_fio: data.contact_fio,
              contact_email: data.contact_email,
              contact_phone: data.contact_phone,
              img_logo: data.img_logo,
              description: data.description,
            },
            {  headers: {
              'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${getCookie('accessToken')}`
          }, },
          );
          if (response.status === 201 && response.data) return response.data;
          throw new Error(`Response status code: ${response.status}`);
        } catch (error) {
            if (error.response.status === 409) {
                throw new Error(error.response.data.detail);
              } else {
                throw new Error(error.message);
              }
        }
      },
      updateCompany: async (data, url) => {
        try {
          const response = await axios.put(url,
            {
              title: data.title,
              contact_fio: data.contact_fio,
              contact_email: data.contact_email,
              contact_phone: data.contact_phone,
              img_logo: data.img_logo,
              description: data.description,
              inactive: !data.active,
              id: data.id,
              company_id: data.company_id,
              users_id: data.users_id
            },
            {  headers: {
              'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${getCookie('accessToken')}`
          }, },
          );
          if (response.status === 200 && response.data) return response.data;
          throw new Error(`Response status code: ${response.status}`);
        } catch (error) {
            if (error.response.status === 409) {
                throw new Error(error.response.data.detail);
              } else {
                throw new Error(error);
              }
        }
      },
      createUser: async (data, url) => {
          try {
            const response = await axios.post(url,
              {
                username: data.username.toLowerCase(),
                password: data.password,
                email: data.email,
                companies_id: data.companies_id,
                first_name: data.first_name,
                last_name: data.last_name
              },
              {  headers: {
                'Content-Type': 'application/json' ,
                'Authorization': `Bearer ${getCookie('accessToken')}`
            }, },
            );
            if (response.status === 200) return response.data;
            throw new Error(`Response status code: ${response.status}`);
          } catch (error) {
              if (error.response.status === 409) {
                  throw new Error(error.response.data.detail);
                } else {
                  throw new Error(error.message);
                }
          }
        },
        toggleCompanyAndUser: async (data, url) => {
        try {
          const response = await axios.post(url,
            {
              company_id: data.companyId,
              user_id: data.userId
            },
            {  headers: {
              'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${getCookie('accessToken')}`
          }, },
          );
          if (response.status === 200) return response.data;
          throw new Error(`Response status code: ${response.status}`);
        } catch (error) {
            if (error.response.status === 409) {
                throw new Error(error.response.data.detail);
              } else {
                throw new Error(error.message);
              }
        }
      },
}