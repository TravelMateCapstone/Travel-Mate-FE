import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TourChart from '../../components/Local/TourChart';
import TourPieChart from '../../components/Local/TourPieChart';
import { fetchTours } from '../../utils/UserDashBoard/statistical';
import '../../assets/css/Local/LocalIncomeStatistics.css';

function LocalIncomeStatistics() {
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const [transactions, setTransactions] = useState([]);
  const [tours, setTours] = useState([]);
  // eslint-disable-next-line no-unused-vars
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
    <div className='bg-light'>
      <h4 className='text-uppercase fw-bold'>Thống kê</h4>
      <div className='d-flex justify-content-between gap-4'>
        <div className='statics_card'>
          <small className='text-uppercase fw-semibold'>Tổng số tour</small>
          <h3 className='statics_card_data'>{tours.length}</h3>
        </div>
        <div className='statics_card'>
          <small className='text-uppercase fw-semibold'>Tổng doanh thu</small>
          <h3 className='statics_card_data'>{transactions.reduce((total, transaction) => total + transaction.amount, 0).toLocaleString('vi-VN')} VND</h3>
        </div>

        <div className='statics_card'>
          <small className='text-uppercase fw-semibold'>Tổng số giao dịch</small>
          <h3 className='statics_card_data'>{transactions.length}</h3>
        </div>

        <div className='statics_card'>
          <small className='text-uppercase fw-semibold'>Tổng số khách hàng</small>
          <h3 className='statics_card_data'>{transactions.length}</h3>
        </div>
      </div>

      <div className='d-flex justify-content-between gap-4 mt-5'>
        <TourChart tours={tours} token={token} />
        <TourPieChart tours={tours} />
      </div>

    </div>
  );
}

export default LocalIncomeStatistics;
