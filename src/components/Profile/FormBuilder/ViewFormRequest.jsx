import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function ViewFormRequest() {
  const token = useSelector(state => state.auth.token);
  const [requests, setRequests] = useState([]);
  const fetchRequest = async () => {
    try {
      const response = await axios.get('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/Request', {
        headers: {
          Authorization: `${token}`
        }
      });
      setRequests(response.data.$values);
      console.log(response.data.$values);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
    fetchRequest();
  }, [token])
  return (
    <div>ViewFormRequest</div>
  )
}

export default ViewFormRequest