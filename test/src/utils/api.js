import axios from "../axiosConfig";
import { getCookie } from "./cookie";


export const api = {
    fetchData: async ( parameters ,url) => {
      try {
        const response = await axios.get(url,
          {  headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`
        }, },
        );
        if (response.status === 200 && response.data) return response.data;
        throw new Error(`Response status code: ${response.status}`);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteData: async (queryParams, data) => {
      const url = `${queryParams}${data.id}?from_date=${data.from}&to_date=${data.to}`
      try {
        const response = await axios.delete(url,
          {  headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`
        }, },
        );
        if (response.status === 200 && response.data) return response.data;
        throw new Error(`Response status code: ${response.status}`);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  };