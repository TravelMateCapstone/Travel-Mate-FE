import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import Spinner from 'react-bootstrap/Spinner';

function TourPieChart({ tours }) {
  const [loading, setLoading] = useState(true);
  const [pieChartData, setPieChartData] = useState({});

  const calculateData = async () => {
    if (tours.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#E0E0E0'],
        }]
      };
    }
    const labels = tours.map(tour => tour.tourName);
    const data = tours.map(tour => tour.price);
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      }]
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await calculateData();
      setPieChartData(data);
      setLoading(false);
    };
    fetchData();
  }, [tours]);

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Giá tiền của từng tour',
      },
    },
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div style={{
      border: '1px solid #ccc',
      flex: 1,
      borderRadius: '10px',
      padding: '10px',
      height: '500px',
    }}>
      <Pie data={pieChartData} options={options} />
    </div>
  );
}

TourPieChart.propTypes = {
  tours: PropTypes.arrayOf(
    PropTypes.shape({
      tourName: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TourPieChart;
