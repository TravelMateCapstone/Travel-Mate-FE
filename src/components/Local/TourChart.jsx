import { useEffect, useState } from 'react';
import { Bar,  } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchTourData } from '../../utils/UserDashBoard/statistical';
import PropTypes from 'prop-types';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

function TourChart({ tours, token }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tourAmounts = await fetchTourData(tours, token);
        if (tourAmounts.length === 0) {
          setChartData(null); // Không có dữ liệu
        } else {
          const labels = tourAmounts.map(tour => tour.tourName);
          const dataBar = tourAmounts.map(tour => tour.amount);
          const dataLine = tourAmounts.map(tour => tour.totalPaid);

          setChartData({
            labels,
            datasets: [
              {
                type: 'bar',
                label: 'Dự tính',
                data: dataBar,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
              {
                type: 'line',
                label: 'Thực tế',
                data: dataLine,
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                fill: false,
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setChartData(null); // Lỗi, không có dữ liệu
      } finally {
        setLoading(false);
      }
    };

    if (tours.length > 0) {
      fetchData();
    } else {
      setChartData(null);
      setLoading(false);
    }
  }, [tours, token]);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000000,
        },
        title: {
          display: true,
          text: 'Amount',
        },
      },
      x: {
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Doanh thu mỗi tour du lịch',
      },
    },
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!chartData) {
    return <div>Chưa có dữ liệu thống kê</div>;
  }

  return <Bar data={chartData} options={options} />;
}

TourChart.propTypes = {
  tours: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
};

export default TourChart;
