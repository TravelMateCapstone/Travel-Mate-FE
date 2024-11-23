import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function ViewFormRequest() {
  const token = useSelector(state => state.auth.token);
  const [requests, setRequests] = useState([]);
  const fetchRequest = () => {
    const response = axios.get('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/Request', {
      headers: {
        Authorization: `${token}`
      }
    })
    setRequests(response.data)
    console.log(response);
  }
  useEffect(() => {
    fetchRequest();
  }, [token])


  return (
    <div>ViewFormRequest</div>
  )
}

export default ViewFormRequest