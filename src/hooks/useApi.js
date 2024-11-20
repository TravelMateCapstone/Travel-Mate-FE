import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';

const useApi = (endpoint, queryKey) => {
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);

  const fetchData = async () => {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return data;
  };

  const createData = async (newData) => {
    const { data } = await axios.post(endpoint, newData, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return data;
  };

  const updateData = async ({ id, updatedData }) => {
    const { data } = await axios.put(`${endpoint}/${id}`, updatedData, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return data;
  };

  const deleteData = async (id) => {
    const { data } = await axios.delete(`${endpoint}/${id}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return data;
  };

  const useFetch = () => useQuery(queryKey || [endpoint], fetchData);

  const useCreate = () => {
    const mutation = useMutation(createData, {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey || [endpoint]);
      },
    });
    return {
      ...mutation,
      isLoading: mutation.isLoading,
      isSuccess: mutation.isSuccess,
    };
  };

  const useUpdate = () => {
    const mutation = useMutation(updateData, {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey || [endpoint]);
      },
    });
    return {
      ...mutation,
      isLoading: mutation.isLoading,
      isSuccess: mutation.isSuccess,
    };
  };

  const useDelete = (invalidateCache = true) => {
    const mutation = useMutation(deleteData, {
      onSuccess: () => {
        if (invalidateCache) {
          queryClient.invalidateQueries(queryKey || [endpoint]);
        }
      },
    });
    return {
      ...mutation,
      isLoading: mutation.isLoading,
      isSuccess: mutation.isSuccess,
    };
  };

  return { useFetch, useCreate, useUpdate, useDelete };
};

export default useApi;
