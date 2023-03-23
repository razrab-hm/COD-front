import axios from '../axiosConfig';
import { getCookie } from './cookie';
const { REACT_APP_API_URL } = process.env;

export const reportsApi = {
  getReport: async (data, url, pdf, xlsx) => {
    try {
      const response = await axios.post(
        url,
        {
          year: data.year,
          month: data.month,
          quarter: data.quarter,
          companies: data.companies,
          output_type: pdf ? 'pdf' : xlsx ? 'xlsx' : 'json',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('accessToken')}`,
          },
        }
      );
      if (response.status === 200 && response.data) return response.data;
      throw new Error(`Response status code: ${response.status}`);
    } catch (error) {
      if (error.response.status === 403) throw new Error('Empty companies');
      if (error.response.status === 409) throw new Error('Empty data');
      throw new Error(error.message);
    }
  },
  getXlsxReport: async (data, url) => {
    try {
      const response = await fetch(`${REACT_APP_API_URL.slice(0, -1)}${url}`, {
        method: 'POST',
        body: JSON.stringify({ ...data, output_type: 'xlsx' }),
        headers: {
          Authorization: `Bearer ${getCookie('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) return response;
      throw new Error(`Response status code: ${response.status}`);
    } catch (error) {
      if (error.response?.status === 403)
        throw new Error('Error during downloading file');
      if (error.response?.status === 404) throw new Error('Empty data');
      throw new Error(error);
    }
  },
  uploadFile: async (file, currentEditCompanyId) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(
        `${REACT_APP_API_URL}hashrates/import/${currentEditCompanyId}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`,
          },
        }
      );
      if (response.status === 200) return response.data;
      throw new Error(`Response status code: ${response.status}`);
    } catch (error) {
      if (error.response.status === 403)
        throw new Error('Error during upload file');
      if (error.response.status === 409) throw new Error('Empty data');
      throw new Error(error.message);
    }
  },
};
