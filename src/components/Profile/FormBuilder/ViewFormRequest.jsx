import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import RequestCard from './RequestCard' // Import the new component

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
    <Container>
      {requests.map(request => (
        <RequestCard key={request.id} request={request} /> // Use the new component
      ))}
    </Container>
  )
}

export default ViewFormRequest