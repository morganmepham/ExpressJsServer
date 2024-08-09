// useAxios.js

import { useState, useCallback } from 'react';
import axios from 'axios';

const useAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
  });

  const fetchData = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance({
          url,
          method,
          data: body,
          headers,
        });
        setData(response.data);
        return response;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [axiosInstance]
  );

  const get = useCallback((url, headers = {}) => fetchData(url, 'GET', null, headers), [fetchData]);
  const post = useCallback((url, body, headers = {}) => fetchData(url, 'POST', body, headers), [fetchData]);
  const put = useCallback((url, body, headers = {}) => fetchData(url, 'PUT', body, headers), [fetchData]);
  const del = useCallback((url, headers = {}) => fetchData(url, 'DELETE', null, headers), [fetchData]);

  return {
    loading,
    error,
    data,
    get,
    post,
    put,
    del,
  };
};

export default useAxios;
