import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Form } from 'react-bootstrap';
import MonthlySpendingChart from '../../components/Local/MonthlySpendingChart';
import TourChart from '../../components/Local/TourChart';
import TourPieChart from '../../components/Local/TourPieChart';
import { fetchTours } from '../../utils/UserDashBoard/statistical';

function LocalIncomeStatistics() {
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const [transactions, setTransactions] = useState([]);
  const [tours, setTours] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    fetchToursData();
  }, [user]);

  useEffect(() => {
    if (tours.length > 0) {
      setEventsData(tours);
    }
  }, [token, tours]);

  useEffect(() => {
    if (transactions.length > 0 || tours.length > 0) {
      console.log('Recalculating results due to changes in transactions or tours');
    }
  }, [transactions, tours]);

  const fetchToursData = async () => {
    try {
      const toursData = await fetchTours(token);
      setTours(toursData);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`https://travelmateapp.azurewebsites.net/api/Transaction/traveler/${user.id}`);
        const data = await response.json();
        setTransactions(data.$values.map(transaction => ({
          name: transaction.travelerName,
          tourName: transaction.tourName,
          localName: transaction.localName,
          date: new Date(transaction.transactionTime).toLocaleDateString('vi-VN'),
          amount: transaction.price,
          transactionTime: transaction.transactionTime
        })));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [user]);

  return (
    <div>
      <h4 className='text-uppercase fw-bold'>Thống kê</h4>
      <Row className='mt-5'>
        <Col lg={6}>
          <TourChart tours={tours} token={token} />
        </Col>
        <Col lg={6}>
          <TourPieChart tours={tours} />
        </Col>
      </Row>
      
    </div>
  );
}

export default LocalIncomeStatistics;
