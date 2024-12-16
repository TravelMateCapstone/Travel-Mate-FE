import React, { useEffect, useState } from 'react'
import contract_glass from '../../assets/images/contact_glass.png'
import { Button, Table } from 'react-bootstrap'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CountdownTimer from '../../components/Contracts/CountdownTimer';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';

function Contract() {
  const [contracts, setContracts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const user = useSelector(state => state.auth.user);
  console.log(contracts);
  
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`https://travelmateapp.azurewebsites.net/api/BlockContract/contracts-by-traveler/${user.id}`)
      .then(response => {
        if (response.data.success) {
          const sortedContracts = response.data.data.$values.sort((a, b) => {
            if (a.status === 'Created' && b.status !== 'Created') return -1;
            if (a.status !== 'Created' && b.status === 'Created') return 1;
            return 0;
          });
          setContracts(sortedContracts);
          console.log(sortedContracts);
          
        }
      })
      .catch(error => {
        console.error('There was an error fetching the contracts!', error);
      });
  }, []);
  const creactPayment = async (tourInfo) => {
    console.log(tourInfo);
    const infoPayment = {
      tourName: 'Tour du lịch',
      tourId: tourInfo.tourId,
      localId: tourInfo.creator.id,
      travelerId: user.id,
      // amount: tourInfo.price,
      amount: 2000,
    };
    // Redirect to payment form submission
    const form = document.createElement("form");
    form.action = "https://travelmateapp.azurewebsites.net/api/order";
    form.method = "GET";

    Object.keys(infoPayment).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = infoPayment[key];
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  }
  const viewCoptract = (contract) => {
    if (contract.status === 'Created') {
      creactPayment(JSON.parse(contract.details));
    } else if (contract.status === 'Completed') {
      localStorage.setItem('contract_selected', JSON.stringify(contract));
      navigate(RoutePath.FINISH_CONTRACT_TRAVELLER);
      alert('Hợp đồng đã hoàn thành');
      return;
    }
  }
  const verifyContract = async (contract) => {
    console.log(user.id);
    
    console.log(contract);
    try {
      const response = await axios.get(
        `https://travelmateapp.azurewebsites.net/api/BlockContract/verify-contract?travelerId=${user.id}&localId=${contract.localId}&tourId=${contract.tourId}`);
      if (response.data.isValid) {
        toast.success('Hợp đồng đã được xác nhận');
      } 
    } catch (error) {
      toast.error(error.response && error.response.data.error);
      console.error('Error verifying contract:', error);
    }
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Tên tour</th>
          <th>Địa điểm</th>
          <th>Ngày bắt đầu</th>
          <th>Ngày kết thúc</th>
          <th>Trạng thái</th>
          <th>Thời gian còn lại</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {contracts.map((contract, index) => (
          <tr key={contract.travelerId}>
            <td>{JSON.parse(contract.details).tourName}</td>
            <td>{contract.location}</td>
            <td>{new Date(JSON.parse(contract.details).startDate).toLocaleDateString()}</td>
            <td>{new Date(JSON.parse(contract.details).endDate).toLocaleDateString()}</td>
            <td className={`text-nowrap ${contract.status === 'Created' ? 'text-warning' : contract.status === 'Completed' ? 'text-success' : 'text-secondary'}`}>
              {contract.status === 'Created' ? 'chưa thanh toán' : contract.status === 'Completed' ? 'Đã thanh toán' : contract.status}
            </td>
            <td>
              {contract.status !== 'Completed' && <CountdownTimer createdAt={contract.createdAt} />}
            </td>
            <td className='d-flex gap-2'>
              <Button variant='primary' className='text-nowrap' onClick={() => viewCoptract(contract)}>
                {contract.status === 'Created' ? 'Thanh toán' : 'Xem'}
              </Button>
              <Button className='text-nowrap' onClick={() => verifyContract(contract)}>
                Xác nhận hợp đồng
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default Contract