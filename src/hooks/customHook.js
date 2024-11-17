import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const useCustomQuery = (key, queryFn, options = {}) => {
  return useQuery(key, queryFn, options);
};

const useCustomMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(mutationFn, {
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || 'An error occurred');
      if (options.onError) options.onError(error, variables, context);
    },
    ...options,
  });
};

const fetchData = async (url, token) => {
  const response = await axios.get(url, {
    headers: { Authorization: `${token}` },
  });
  return response.data;
};

const postData = async (url, data, token) => {
  const response = await axios.post(url, data, {
    headers: { Authorization: `${token}` },
  });
  return response.data;
};

const putData = async (url, data, token) => {
  const response = await axios.put(url, data, {
    headers: { Authorization: `${token}` },
  });
  return response.data;
};

const deleteData = async (url, token) => {
  const response = await axios.delete(url, {
    headers: { Authorization: `${token}` },
  });
  return response.data;
};

export { useCustomQuery, useCustomMutation, fetchData, postData, putData, deleteData };
